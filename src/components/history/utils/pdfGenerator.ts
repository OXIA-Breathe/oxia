
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { BreathSession } from "@/types/breath";

export const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

interface GeneratePDFParams {
  sessions: BreathSession[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  exportType: "full" | "custom";
}

export const generatePDF = ({ sessions, dateRange, exportType }: GeneratePDFParams) => {
  // Initialize PDF with A4 portrait orientation
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Set background with gradient (approximate using rectangles with different opacities)
  for (let i = 0; i < 20; i++) {
    const alpha = 0.02 + (i * 0.005);
    doc.setFillColor(173, 216, 230, alpha); // Light blue
    doc.rect(0, i * (297/20), 210, 297/20, "F");
  }
  
  // HEADER SECTION
  // Add OXIA logo
  const logoData = "/lovable-uploads/2537215b-9aaa-455a-9557-b82a0a16a948.png";
  doc.addImage(logoData, "PNG", 75, 15, 60, 25);
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(41, 82, 156); // Blue text accent
  doc.text("Breathing Session Report", 105, 55, { align: "center" });
  
  // Date range
  let dateText = "All Sessions";
  if (exportType === "custom" && dateRange.from && dateRange.to) {
    dateText = `${format(dateRange.from, "MMMM d")}–${format(dateRange.to, "d, yyyy")}`;
  }
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(dateText, 105, 63, { align: "center" });
  
  // Inspirational subheading
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.text("Every breath counts.", 105, 70, { align: "center" });
  
  // Filter sessions based on date range if custom is selected
  let filteredSessions = sessions;
  if (exportType === "custom" && dateRange.from && dateRange.to) {
    const fromDate = dateRange.from.setHours(0, 0, 0, 0);
    const toDate = dateRange.to.setHours(23, 59, 59, 999);
    
    filteredSessions = sessions.filter((session) => {
      const sessionDate = new Date(session.date).getTime();
      return sessionDate >= fromDate && sessionDate <= toDate;
    });
  }
  
  // Calculate summary statistics
  const totalSessions = filteredSessions.length;
  const totalBreaths = filteredSessions.reduce((acc, s) => acc + s.breathCount, 0);
  const totalTime = filteredSessions.reduce((acc, s) => acc + s.totalDuration, 0);
  const avgSessionDuration = totalSessions ? totalTime / totalSessions : 0;
  
  // SUMMARY BLOCK - Create white card effect
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 85, 180, 60, 5, 5, "F");
  
  // Draw summary boxes (2x2 grid)
  const drawStatBox = (x: number, y: number, title: string, value: string) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, 80, 20, 3, 3, "F");
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(title, x + 40, y + 7, { align: "center" });
    
    doc.setFontSize(14);
    doc.setTextColor(41, 82, 156);
    doc.text(value, x + 40, y + 16, { align: "center" });
  };
  
  drawStatBox(25, 95, "TOTAL SESSIONS", totalSessions.toString());
  drawStatBox(115, 95, "TOTAL BREATHS", totalBreaths.toString());
  drawStatBox(25, 125, "TOTAL TIME", formatTime(totalTime));
  drawStatBox(115, 125, "AVERAGE DURATION", formatTime(Math.round(avgSessionDuration)));
  
  // PROGRESS VISUAL - Simple circular chart
  if (filteredSessions.length > 1) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 155, 180, 70, 5, 5, "F");
    doc.setFontSize(14);
    doc.setTextColor(41, 82, 156);
    doc.text("Your Breathing Journey", 105, 170, { align: "center" });
    
    // Get last 5 sessions for visualization
    const recentSessions = filteredSessions.slice(0, Math.min(5, filteredSessions.length)).reverse();
    
    // Draw simple bar chart of session durations
    const barWidth = 25;
    const maxHeight = 40;
    const startX = 40;
    const startY = 210;
    const gap = 10;
    const maxDuration = Math.max(...recentSessions.map(s => s.totalDuration));
    
    recentSessions.forEach((session, index) => {
      const barHeight = (session.totalDuration / maxDuration) * maxHeight;
      const x = startX + (index * (barWidth + gap));
      
      // Draw bar
      const hue = 200 + (index * 10); // Shift from blue to turquoise
      doc.setFillColor(41, 82, 156, 0.7 - (index * 0.1));
      doc.roundedRect(x, startY - barHeight, barWidth, barHeight, 2, 2, "F");
      
      // Draw date label
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(format(new Date(session.date), "MMM d"), x + (barWidth / 2), startY + 8, { align: "center" });
    });
  }
  
  // SESSION TABLE
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 235, 180, 0, 5, 5, "F"); // Height will be adjusted by autoTable
  
  doc.setFontSize(14);
  doc.setTextColor(41, 82, 156);
  doc.text("Session Details", 105, 245, { align: "center" });
  
  const tableColumns = [
    "Date", "Time", "Breath Pattern", "Repetitions", "Breaths", "Duration"
  ];
  
  const tableData = filteredSessions.map((session) => {
    const date = new Date(session.date);
    return [
      format(date, "MMM d, yyyy"),
      format(date, "h:mm a"),
      `${4}s-${session.holdDuration}s-${4}s`, // Assuming standard inhale/exhale of 4s
      session.repetitions.toString(),
      session.breathCount.toString(),
      formatTime(session.totalDuration),
    ];
  });
  
  autoTable(doc, {
    startY: 255,
    head: [tableColumns],
    body: tableData,
    theme: "grid",
    headStyles: { 
      fillColor: [63, 131, 193],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
    },
    styles: {
      overflow: "linebreak",
      cellWidth: "auto",
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
    },
  });
  
  // FOOTER
  const finalY = (doc as any).lastAutoTable.finalY || 270;
  
  // Inspirational quote
  doc.setFillColor(248, 250, 252, 0.7);
  doc.roundedRect(30, finalY + 15, 150, 25, 5, 5, "F");
  
  doc.setFontSize(11);
  doc.setTextColor(41, 82, 156);
  doc.text("Your breath is your superpower. Keep going.", 105, finalY + 25, { align: "center" });
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Created with OXIA Breathing App • oxia.breathe", 105, finalY + 35, { align: "center" });
  
  const pdfOutput = doc.output("blob");
  const fileName = "OXIA-Breathing-Report.pdf";
  
  return { blob: pdfOutput, fileName };
};
