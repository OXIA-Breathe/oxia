
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { BreathSession } from "@/types/breath";
import { formatTime, formatTimeDisplay } from "../formatTime";
import { prepareSessionTableData } from "./pdfDataUtils";
import { SessionStats } from "./types";
import { PDFStyling, setFillColor, setTextColor, setDrawColor, drawRoundedRect } from "./pdfStyles";

// Add summary statistics section with card layout as shown in mockup
export const addSummarySection = (
  doc: jsPDF, 
  stats: SessionStats,
  filteredSessions: BreathSession[]
) => {
  const { totalSessions, totalBreaths, totalTime, avgSessionDuration } = stats;
  const pageWidth = doc.internal.pageSize.width;
  const cardWidth = 80;
  const cardHeight = 80;
  const cardSpacing = 10;
  
  // Create 2x2 grid of stat cards
  const startX = (pageWidth - ((cardWidth * 2) + cardSpacing)) / 2;
  const startY = 160;
  
  // Card 1: Total Sessions
  drawRoundedRect(doc, startX, startY, cardWidth, cardHeight, 8);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text(totalSessions.toString(), startX + (cardWidth / 2), startY + 35, { align: "center" });
  
  doc.setFontSize(12);
  setTextColor(doc, PDFStyling.colors.secondary);
  doc.text("Total", startX + (cardWidth / 2), startY + 55, { align: "center" });
  doc.text("Sessions", startX + (cardWidth / 2), startY + 65, { align: "center" });
  
  // Card 2: Total Breaths
  drawRoundedRect(doc, startX + cardWidth + cardSpacing, startY, cardWidth, cardHeight, 8);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text(totalBreaths.toString(), startX + cardWidth + cardSpacing + (cardWidth / 2), startY + 35, { align: "center" });
  
  doc.setFontSize(12);
  setTextColor(doc, PDFStyling.colors.secondary);
  doc.text("Total", startX + cardWidth + cardSpacing + (cardWidth / 2), startY + 55, { align: "center" });
  doc.text("Breaths", startX + cardWidth + cardSpacing + (cardWidth / 2), startY + 65, { align: "center" });
  
  // Card 3: Total Time
  drawRoundedRect(doc, startX, startY + cardHeight + cardSpacing, cardWidth, cardHeight, 8);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text(formatTime(totalTime), startX + (cardWidth / 2), startY + cardHeight + cardSpacing + 35, { align: "center" });
  
  doc.setFontSize(12);
  setTextColor(doc, PDFStyling.colors.secondary);
  doc.text("Total", startX + (cardWidth / 2), startY + cardHeight + cardSpacing + 55, { align: "center" });
  doc.text("Duration", startX + (cardWidth / 2), startY + cardHeight + cardSpacing + 65, { align: "center" });
  
  // Card 4: Average Duration
  drawRoundedRect(doc, startX + cardWidth + cardSpacing, startY + cardHeight + cardSpacing, cardWidth, cardHeight, 8);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text(formatTime(avgSessionDuration), startX + cardWidth + cardSpacing + (cardWidth / 2), startY + cardHeight + cardSpacing + 35, { align: "center" });
  
  doc.setFontSize(12);
  setTextColor(doc, PDFStyling.colors.secondary);
  doc.text("Average", startX + cardWidth + cardSpacing + (cardWidth / 2), startY + cardHeight + cardSpacing + 55, { align: "center" });
  doc.text("Duration", startX + cardWidth + cardSpacing + (cardWidth / 2), startY + cardHeight + cardSpacing + 65, { align: "center" });
};

// Add sessions table - one single consolidated table as requested
export const addSessionsTable = (doc: jsPDF, sessions: BreathSession[]) => {
  if (sessions.length === 0) return 340;
  
  // Position table after the stat cards
  const tableY = 340;
  
  // Add section title for sessions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text("Session Details", doc.internal.pageSize.width / 2, tableY - 10, { align: "center" });
  
  // Create a single table with all sessions
  const { tableColumns, tableData } = prepareSessionTableData(sessions);
  
  // Use autotable for clean styling
  autoTable(doc, {
    startY: tableY,
    head: [["Date", "Time", "Breathing Pattern", "Reps", "Duration"]], // Single header row
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 11,
      cellPadding: 5,
      overflow: "ellipsize",
      valign: "middle",
      lineWidth: 0.1,
      lineColor: [PDFStyling.colors.tableBorder[0], PDFStyling.colors.tableBorder[1], PDFStyling.colors.tableBorder[2]],
      textColor: [PDFStyling.colors.primary[0], PDFStyling.colors.primary[1], PDFStyling.colors.primary[2]]
    },
    columnStyles: {
      0: { cellWidth: 35 }, // Date
      1: { cellWidth: 30 }, // Time
      2: { cellWidth: 65 }, // Breath Pattern
      3: { cellWidth: 20, halign: 'center' }, // Repetitions
      4: { cellWidth: 30, halign: 'center' }, // Duration
    },
    headStyles: {
      fillColor: [PDFStyling.colors.tableHeader[0], PDFStyling.colors.tableHeader[1], PDFStyling.colors.tableHeader[2]],
      textColor: [PDFStyling.colors.primary[0], PDFStyling.colors.primary[1], PDFStyling.colors.primary[2]],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [PDFStyling.colors.tableStripe[0], PDFStyling.colors.tableStripe[1], PDFStyling.colors.tableStripe[2]]
    },
    margin: { left: 20, right: 20 }, // Ensure table is centered
    didParseCell: function(data) {
      // Custom styling for cells
    },
    didDrawPage: function(data) {
      // Only add header on first page - don't duplicate
      if (data.pageNumber > 1) {
        // If we're on a new page, only add the column headers
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        setTextColor(doc, PDFStyling.colors.primary);
      }
    }
  });
  
  return (doc as any).lastAutoTable.finalY || 350;
};
