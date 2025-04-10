
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
  const margin = 25;
  const innerWidth = pageWidth - (margin * 2);
  
  // Starting position after the header
  const startY = 60;
  
  // 2x2 grid layout for stat boxes
  const boxWidth = innerWidth / 2 - 5; // 5mm gap between boxes
  const boxHeight = 30;
  
  // Box styling
  const boxBgColor = PDFStyling.colors.lightBackground;
  
  // Box 1: Total Sessions
  drawStatBox(doc, margin, startY, boxWidth, boxHeight, "Total Sessions", totalSessions.toString(), boxBgColor);
  
  // Box 2: Total Breaths
  drawStatBox(doc, margin + boxWidth + 10, startY, boxWidth, boxHeight, "Total Breaths", totalBreaths.toString(), boxBgColor);
  
  // Box 3: Total Time
  drawStatBox(doc, margin, startY + boxHeight + 10, boxWidth, boxHeight, "Total Time", formatTimeDisplay(totalTime), boxBgColor);
  
  // Box 4: Average Duration
  drawStatBox(doc, margin + boxWidth + 10, startY + boxHeight + 10, boxWidth, boxHeight, "Avg Duration", formatTimeDisplay(avgSessionDuration), boxBgColor);
};

// Helper function to draw stat box with title and value
const drawStatBox = (doc: jsPDF, x: number, y: number, width: number, height: number, title: string, value: string, bgColor: readonly [number, number, number]) => {
  // Draw box background
  setFillColor(doc, bgColor);
  doc.roundedRect(x, y, width, height, 3, 3, "F");
  
  // Draw title
  doc.setFont(PDFStyling.fonts.small.family, "normal");
  doc.setFontSize(PDFStyling.fonts.small.size);
  setTextColor(doc, PDFStyling.colors.secondary);
  doc.text(title, x + width/2, y + 10, { align: "center" });
  
  // Draw value
  doc.setFont(PDFStyling.fonts.body.family, "bold");
  doc.setFontSize(PDFStyling.fonts.body.size + 2);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text(value, x + width/2, y + 20, { align: "center" });
};

// Add sessions table - one single consolidated table as requested
export const addSessionsTable = (doc: jsPDF, sessions: BreathSession[]) => {
  if (sessions.length === 0) return 150;
  
  const margin = 25;
  // Position table after the stat boxes
  const tableY = 140;
  
  // Add section title for sessions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text("Session Details", margin, tableY - 10);
  
  // Create a single table with all sessions - updated to match HTML layout
  const { tableData } = prepareSessionTableData(sessions);
  
  // Use autotable for clean styling
  autoTable(doc, {
    startY: tableY,
    head: [["Date / Time", "Inhale", "Hold", "Exhale", "Total Time"]], // Updated headers
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 11,
      cellPadding: 8,
      overflow: "ellipsize",
      valign: "middle",
      lineWidth: 0.1,
      lineColor: [220, 220, 220],
      textColor: [29, 53, 87] // OXIA brand primary color
    },
    columnStyles: {
      0: { cellWidth: 45 }, // Date/Time
      1: { cellWidth: 30, halign: 'center' }, // Inhale
      2: { cellWidth: 30, halign: 'center' }, // Hold
      3: { cellWidth: 30, halign: 'center' }, // Exhale
      4: { cellWidth: 40, halign: 'center' }, // Total Time
    },
    headStyles: {
      fillColor: [240, 246, 252], // Light blue for table headers
      textColor: [29, 53, 87], // OXIA brand primary color
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: margin, right: margin },
  });
  
  return (doc as any).lastAutoTable.finalY || 150;
};
