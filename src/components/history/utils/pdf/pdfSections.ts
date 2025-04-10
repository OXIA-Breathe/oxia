import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { BreathSession } from "@/types/breath";
import { formatTime, formatTimeDisplay } from "../formatTime";
import { prepareSessionTableData } from "./pdfDataUtils";
import { SessionStats } from "./types";
import { PDFStyling, setFillColor, setTextColor, setDrawColor, drawRoundedRect } from "./pdfStyles";

// Add summary statistics section with card layout as shown in the HTML mockup
export const addSummarySection = (
  doc: jsPDF, 
  stats: SessionStats,
  filteredSessions: BreathSession[]
) => {
  const { totalSessions, totalBreaths, totalTime, avgSessionDuration } = stats;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 30;
  const innerWidth = pageWidth - (margin * 2);
  
  // Starting position after the header
  const startY = 60;
  
  // 2x2 grid layout for stat boxes
  const boxWidth = innerWidth / 2 - 6; // 6mm gap between boxes
  const boxHeight = 40;
  
  // Box styling
  const boxBgColor = PDFStyling.colors.lightBackground;
  
  // Box 1: Total Sessions - Top Left
  drawStatBox(doc, margin, startY, boxWidth, boxHeight, "Total Sessions", totalSessions.toString(), boxBgColor);
  
  // Box 2: Total Breaths - Top Right
  drawStatBox(doc, margin + boxWidth + 12, startY, boxWidth, boxHeight, "Total Breaths", totalBreaths.toString(), boxBgColor);
  
  // Box 3: Total Time - Bottom Left
  drawStatBox(doc, margin, startY + boxHeight + 12, boxWidth, boxHeight, "Total Time", formatTimeDisplay(totalTime), boxBgColor);
  
  // Box 4: Average Duration - Bottom Right
  drawStatBox(doc, margin + boxWidth + 12, startY + boxHeight + 12, boxWidth, boxHeight, "Avg Duration", formatTimeDisplay(avgSessionDuration), boxBgColor);
};

// Helper function to draw stat box with title and value
const drawStatBox = (doc: jsPDF, x: number, y: number, width: number, height: number, title: string, value: string, bgColor: readonly [number, number, number]) => {
  // Draw box background
  setFillColor(doc, bgColor);
  doc.roundedRect(x, y, width, height, 8, 8, "F");
  
  // Draw title at the top and centered
  doc.setFont(PDFStyling.fonts.body.family, "normal");
  doc.setFontSize(PDFStyling.fonts.small.size + 2);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text(title, x + width/2, y + 12, { align: "center" });
  
  // Draw value below the title, centered and larger
  doc.setFont(PDFStyling.fonts.body.family, "bold");
  doc.setFontSize(PDFStyling.fonts.body.size + 4);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text(value, x + width/2, y + 28, { align: "center" });
};

// Add sessions table - one single consolidated table as requested
export const addSessionsTable = (doc: jsPDF, sessions: BreathSession[]) => {
  if (sessions.length === 0) return 150;
  
  const margin = 30;
  const tableY = 170;
  
  // Add section title for sessions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text("Session Details", margin, tableY - 10);
  
  const { tableData } = prepareSessionTableData(sessions);
  
  // Update autotable configuration with reduced padding
  autoTable(doc, {
    startY: tableY,
    head: [["Date / Time", "Inhale", "Hold", "Exhale", "Total Time"]], 
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 11,
      cellPadding: 4, // Reduced from 12 to 4
      overflow: "ellipsize",
      valign: "middle",
      lineWidth: 0.1,
      lineColor: [220, 220, 220],
      textColor: [29, 53, 87]
    },
    columnStyles: {
      0: { cellWidth: 45 }, // Date/Time
      1: { cellWidth: 30, halign: 'center' }, // Inhale
      2: { cellWidth: 30, halign: 'center' }, // Hold
      3: { cellWidth: 30, halign: 'center' }, // Exhale
      4: { cellWidth: 40, halign: 'center' }, // Total Time
    },
    headStyles: {
      fillColor: [239, 242, 249], // Light blue for table headers to match the stat boxes
      textColor: [29, 53, 87],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: margin, right: margin },
  });
  
  return (doc as any).lastAutoTable.finalY || 150;
};
