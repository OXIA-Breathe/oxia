
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { BreathSession } from "@/types/breath";
import { formatTime, formatTimeDisplay } from "./formatTime";

// Add Open Sans font
import "jspdf/dist/polyfills.es.js";

interface GeneratePDFParams {
  sessions: BreathSession[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  exportType: "full" | "custom";
}

interface PDFOutput {
  blob: Blob;
  fileName: string;
}

// Initialize PDF document with gradient background
const initializePDF = (): jsPDF => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Set up gradient background
  // Create soft blue gradient from top to bottom
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // First layer - light blue base
  doc.setFillColor(209, 233, 252); // #D1E9FC - very light blue
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Add gradient effect with multiple rectangles of varying opacity
  for (let i = 0; i < 50; i++) {
    const y = (i / 50) * pageHeight;
    const height = pageHeight / 50;
    const alpha = 0.5 - (i / 100); // Gradually decrease opacity
    
    // Top part - lighter
    if (i < 25) {
      doc.setFillColor(168, 218, 220, alpha); // #A8DADC
    } 
    // Bottom part - darker
    else {
      doc.setFillColor(69, 123, 157, alpha); // #457B9D
    }
    
    doc.rect(0, y, pageWidth, height, "F");
  }
  
  // Add wavy design at bottom
  const wavyY = pageHeight - 50;
  doc.setDrawColor(255, 255, 255, 0.5);
  doc.setLineWidth(0.5);
  
  for (let i = 0; i < 3; i++) {
    const offsetY = i * 10;
    doc.setFillColor(255, 255, 255, 0.3 - (i * 0.1));
    
    // Create wavy pattern
    doc.moveTo(0, wavyY + offsetY);
    for (let x = 0; x < pageWidth; x += 10) {
      const y = wavyY + offsetY + Math.sin(x/20) * 5;
      doc.lineTo(x, y);
    }
    
    doc.lineTo(pageWidth, wavyY + offsetY);
    doc.lineTo(pageWidth, pageHeight);
    doc.lineTo(0, pageHeight);
    doc.lineTo(0, wavyY + offsetY);
    doc.fill();
  }
  
  return doc;
};

// Add header section with logo and title
const addHeader = (doc: jsPDF, dateRange: GeneratePDFParams['dateRange'], exportType: GeneratePDFParams['exportType']) => {
  const pageWidth = doc.internal.pageSize.width;
  
  // Add OXIA logo
  const logoData = "/lovable-uploads/a94449ed-cc00-43e4-b5d4-7e810331284a.png";
  doc.addImage(logoData, "PNG", (pageWidth / 2) - 25, 25, 50, 20);
  
  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(29, 53, 87); // #1D3557 - deep blue
  doc.text("Breathing Session", pageWidth / 2, 70, { align: "center" });
  doc.text("Report", pageWidth / 2, 85, { align: "center" });
  
  // Date range
  let dateText = "All Sessions";
  if (exportType === "custom" && dateRange.from && dateRange.to) {
    dateText = `${format(dateRange.from, "MMMM d")}–${format(dateRange.to, "d, yyyy")}`;
  }
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(29, 53, 87, 0.8); // Deep blue with transparency
  doc.text(dateText, pageWidth / 2, 100, { align: "center" });
  
  // Inspirational quote
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(29, 53, 87, 0.8);
  doc.text('"Every breath counts."', pageWidth / 2, 110, { align: "center" });
};

// Filter sessions based on date range if needed
const filterSessionsByDateRange = (
  sessions: BreathSession[], 
  dateRange: GeneratePDFParams['dateRange'], 
  exportType: GeneratePDFParams['exportType']
): BreathSession[] => {
  if (exportType === "custom" && dateRange.from && dateRange.to) {
    const fromDate = dateRange.from.setHours(0, 0, 0, 0);
    const toDate = dateRange.to.setHours(23, 59, 59, 999);
    
    return sessions.filter((session) => {
      const sessionDate = new Date(session.date).getTime();
      return sessionDate >= fromDate && sessionDate <= toDate;
    });
  }
  return sessions;
};

// Calculate summary statistics
const calculateSessionStats = (sessions: BreathSession[]) => {
  const totalSessions = sessions.length;
  const totalBreaths = sessions.reduce((acc, s) => acc + s.breathCount, 0);
  const totalTime = sessions.reduce((acc, s) => acc + s.totalDuration, 0);
  const avgSessionDuration = totalSessions ? Math.floor(totalTime / totalSessions) : 0;
  
  return { totalSessions, totalBreaths, totalTime, avgSessionDuration };
};

// Add summary statistics section with cards
const addSummarySection = (doc: jsPDF, stats: ReturnType<typeof calculateSessionStats>) => {
  const { totalSessions, totalBreaths, totalTime, avgSessionDuration } = stats;
  const pageWidth = doc.internal.pageSize.width;
  
  // Create white rounded card for stats
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(20, 130, pageWidth - 40, 70, 10, 10, "F");
  
  // Add subtle shadow effect
  doc.setFillColor(230, 230, 230, 0.3);
  doc.roundedRect(22, 132, pageWidth - 40, 70, 10, 10, "F");
  
  // Define columns for stats display
  const statColumns = 3;
  const columnWidth = (pageWidth - 60) / statColumns;
  
  // Stats - Total Sessions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(29, 53, 87);
  doc.text(totalSessions.toString(), 45, 155, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(69, 123, 157);
  doc.text("Total", 45, 165, { align: "center" });
  doc.text("Sessions", 45, 172, { align: "center" });
  
  // Stats - Total Breaths
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(29, 53, 87);
  doc.text(totalBreaths.toString(), pageWidth / 2, 155, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(69, 123, 157);
  doc.text("Total", pageWidth / 2, 165, { align: "center" });
  doc.text("Breaths", pageWidth / 2, 172, { align: "center" });
  
  // Stats - Average Duration
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(29, 53, 87);
  doc.text(formatTime(avgSessionDuration), pageWidth - 45, 155, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(69, 123, 157);
  doc.text("Average", pageWidth - 45, 165, { align: "center" });
  doc.text("Duration", pageWidth - 45, 172, { align: "center" });
  
  // Add circular progress chart
  if (sessions.length > 0) {
    const chartCenterX = pageWidth - 50;
    const chartCenterY = 185;
    const chartRadius = 15;
    
    // Draw circular progress background
    doc.setDrawColor(168, 218, 220, 0.5); // #A8DADC with transparency
    doc.setFillColor(168, 218, 220, 0.2);
    doc.circle(chartCenterX, chartCenterY, chartRadius, "FD");
    
    // Draw progress arc (3/4 circle for visual effect)
    doc.setDrawColor(0, 180, 216); // #00B4D8 bright aqua
    doc.setFillColor(0, 180, 216, 0.5);
    doc.setLineWidth(3);
    
    // Draw arc (simplified - just a visual indicator)
    const startAngle = 0;
    const endAngle = Math.PI * 1.5; // 3/4 of a circle
    
    doc.arc(chartCenterX, chartCenterY, chartRadius, startAngle, endAngle, "FD");
    
    // Add text inside circle
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(29, 53, 87);
    doc.text(formatTimeDisplay(totalTime), chartCenterX, chartCenterY, { align: "center" });
  }
};

// Add sessions table
const addSessionsTable = (doc: jsPDF, sessions: BreathSession[]) => {
  if (sessions.length === 0) return 220;
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(29, 53, 87);
  doc.text("Session Details", doc.internal.pageSize.width / 2, 220, { align: "center" });
  
  const tableColumns = [
    "Date", "Time", "Inhale / Hold / Exhale", "Repetitions", "Duration"
  ];
  
  const tableData = sessions.map((session) => {
    const date = new Date(session.date);
    return [
      format(date, "MMM d, yyyy"),
      format(date, "h:mm a"),
      `${session.inhaleDuration || 4}s / ${session.holdDuration}s / ${session.exhaleDuration || 4}s`,
      session.repetitions.toString(),
      formatTime(session.totalDuration),
    ];
  });
  
  autoTable(doc, {
    startY: 230,
    head: [tableColumns],
    body: tableData,
    headStyles: { 
      fillColor: [69, 123, 157],
      textColor: [255, 255, 255],
      fontSize: 12,
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 11,
      cellPadding: 5,
      overflow: "ellipsize",
      halign: "center",
      valign: "middle",
      lineColor: [168, 218, 220],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    tableLineColor: [168, 218, 220],
    tableLineWidth: 0.5,
  });
  
  return (doc as any).lastAutoTable.finalY || 250;
};

// Add reflection or notes section
const addReflectionSection = (doc: jsPDF, finalY: number) => {
  // In this initial version, we'll just add a motivational quote
  // In a future version, we could integrate actual user notes
  
  const pageWidth = doc.internal.pageSize.width;
  const reflectionY = finalY + 30;
  
  doc.setFillColor(255, 255, 255, 0.8);
  doc.roundedRect(30, reflectionY, pageWidth - 60, 40, 5, 5, "F");
  
  doc.setFont("helvetica", "italic");
  doc.setFontSize(13);
  doc.setTextColor(29, 53, 87, 0.8);
  doc.text("Thank you for taking the time to breathe.", pageWidth / 2, reflectionY + 20, { align: "center" });
};

// Add footer section
const addFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Inspirational quote
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(29, 53, 87, 0.8);
  doc.text("Your breath is your superpower. Keep going.", pageWidth / 2, pageHeight - 35, { align: "center" });
  
  // App info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(69, 123, 157, 0.8);
  doc.text("Created with OXIA Breathing App • oxia.breathe", pageWidth / 2, pageHeight - 25, { align: "center" });
};

// Main PDF generation function
export const generatePDF = ({ sessions, dateRange, exportType }: GeneratePDFParams): PDFOutput => {
  try {
    // Initialize PDF document
    const doc = initializePDF();
    
    // Add header section
    addHeader(doc, dateRange, exportType);
    
    // Filter sessions based on date range if needed
    const filteredSessions = filterSessionsByDateRange(sessions, dateRange, exportType);
    
    // Calculate summary statistics
    const stats = calculateSessionStats(filteredSessions);
    
    // Add summary statistics section
    addSummarySection(doc, stats);
    
    // Add sessions table and get final Y position
    const finalY = addSessionsTable(doc, filteredSessions);
    
    // Add reflection section
    addReflectionSection(doc, finalY);
    
    // Add footer
    addFooter(doc);
    
    // Generate PDF output
    const pdfOutput = doc.output("blob");
    const fileName = "OXIA-Breathing-Report.pdf";
    
    return { blob: pdfOutput, fileName };
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error; // Re-throw to be caught by the calling function
  }
};
