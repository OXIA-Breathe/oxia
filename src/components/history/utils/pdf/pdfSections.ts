
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { BreathSession } from "@/types/breath";
import { formatTime, formatTimeDisplay } from "../formatTime";
import { prepareSessionTableData } from "./pdfDataUtils";
import { SessionStats } from "./types";
import { PDFStyling, withAlpha } from "./pdfStyles";

// Add summary statistics section with improved grouped info cards
export const addSummarySection = (
  doc: jsPDF, 
  stats: SessionStats,
  filteredSessions: BreathSession[]
) => {
  const { totalSessions, totalBreaths, totalTime, avgSessionDuration } = stats;
  const pageWidth = doc.internal.pageSize.width;
  
  // Create a unified container for all stat cards with soft shadow
  doc.setFillColor(255, 255, 255, 0.95);
  doc.roundedRect(20, 130, pageWidth - 40, 90, 8, 8, "F");
  
  // Add subtle shadow effect
  doc.setFillColor(220, 220, 220, 0.2);
  doc.roundedRect(22, 132, pageWidth - 40, 90, 8, 8, "F");
  
  // Add section title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(PDFStyling.colors.primary[0], PDFStyling.colors.primary[1], PDFStyling.colors.primary[2]);
  doc.text("Your Breathing Journey", pageWidth / 2, 145, { align: "center" });
  
  // Add decorative accent line
  doc.setDrawColor(PDFStyling.colors.accent[0], PDFStyling.colors.accent[1], PDFStyling.colors.accent[2]);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 40, 150, pageWidth / 2 + 40, 150);
  
  // Define columns for stats display
  const statColumns = 3;
  const columnWidth = (pageWidth - 60) / statColumns;
  
  // Add background accent blocks for each stat to group them visually
  for (let i = 0; i < 3; i++) {
    const xPos = 30 + (i * columnWidth);
    const lightAccentWithAlpha = withAlpha(PDFStyling.colors.lightAccent, 0.2);
    doc.setFillColor(lightAccentWithAlpha[0], lightAccentWithAlpha[1], lightAccentWithAlpha[2], lightAccentWithAlpha[3]);
    doc.roundedRect(xPos, 160, columnWidth - 10, 50, 5, 5, "F");
  }
  
  // Stats - Total Sessions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(PDFStyling.colors.primary[0], PDFStyling.colors.primary[1], PDFStyling.colors.primary[2]);
  doc.text(totalSessions.toString(), 45, 180, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(PDFStyling.colors.secondary[0], PDFStyling.colors.secondary[1], PDFStyling.colors.secondary[2]);
  doc.text("Total", 45, 195, { align: "center" });
  doc.text("Sessions", 45, 205, { align: "center" });
  
  // Stats - Total Breaths
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(PDFStyling.colors.primary[0], PDFStyling.colors.primary[1], PDFStyling.colors.primary[2]);
  doc.text(totalBreaths.toString(), pageWidth / 2, 180, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(PDFStyling.colors.secondary[0], PDFStyling.colors.secondary[1], PDFStyling.colors.secondary[2]);
  doc.text("Total", pageWidth / 2, 195, { align: "center" });
  doc.text("Breaths", pageWidth / 2, 205, { align: "center" });
  
  // Stats - Average Duration
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(PDFStyling.colors.primary[0], PDFStyling.colors.primary[1], PDFStyling.colors.primary[2]);
  doc.text(formatTime(avgSessionDuration), pageWidth - 45, 180, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(PDFStyling.colors.secondary[0], PDFStyling.colors.secondary[1], PDFStyling.colors.secondary[2]);
  doc.text("Average", pageWidth - 45, 195, { align: "center" });
  doc.text("Duration", pageWidth - 45, 205, { align: "center" });
  
  // Display total time
  if (filteredSessions.length > 0) {
    // Create a soft box for total time
    const accentWithAlpha = withAlpha(PDFStyling.colors.accent, 0.2);
    doc.setFillColor(accentWithAlpha[0], accentWithAlpha[1], accentWithAlpha[2], accentWithAlpha[3]);
    doc.roundedRect(pageWidth / 2 - 50, 215, 100, 30, 5, 5, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(PDFStyling.colors.secondary[0], PDFStyling.colors.secondary[1], PDFStyling.colors.secondary[2]);
    doc.text("Total Practice Time", pageWidth / 2, 225, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(PDFStyling.colors.primary[0], PDFStyling.colors.primary[1], PDFStyling.colors.primary[2]);
    doc.text(formatTimeDisplay(totalTime), pageWidth / 2, 238, { align: "center" });
  }
};

// Add sessions table - consolidated as one single table
export const addSessionsTable = (doc: jsPDF, sessions: BreathSession[]) => {
  if (sessions.length === 0) return 260;
  
  // Section header with improved styling
  const primaryWithAlpha = withAlpha(PDFStyling.colors.primary, 0.1);
  doc.setFillColor(primaryWithAlpha[0], primaryWithAlpha[1], primaryWithAlpha[2], primaryWithAlpha[3]);
  doc.roundedRect(20, 250, doc.internal.pageSize.width - 40, 30, 5, 5, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(PDFStyling.colors.primary[0], PDFStyling.colors.primary[1], PDFStyling.colors.primary[2]);
  doc.text("Session Details", doc.internal.pageSize.width / 2, 270, { align: "center" });
  
  // Prepare data for a single table
  const { tableColumns, tableData } = prepareSessionTableData(sessions);
  
  // Create a single table with all sessions
  autoTable(doc, {
    startY: 285,
    head: [tableColumns],
    body: tableData,
    headStyles: { 
      fillColor: [PDFStyling.colors.primary[0], PDFStyling.colors.primary[1], PDFStyling.colors.primary[2]],
      textColor: [255, 255, 255],
      fontSize: 12,
      fontStyle: "bold",
      halign: "center",
      cellPadding: {top: 8, right: 5, bottom: 8, left: 5},
    },
    styles: {
      fontSize: 11,
      cellPadding: 5,
      overflow: "ellipsize",
      halign: "center",
      valign: "middle",
      lineColor: [PDFStyling.colors.lightAccent[0], PDFStyling.colors.lightAccent[1], PDFStyling.colors.lightAccent[2]],
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [250, 252, 255],
    },
    tableLineColor: [PDFStyling.colors.accent[0], PDFStyling.colors.accent[1], PDFStyling.colors.accent[2]],
    tableLineWidth: 0.2,
    // Set horizontal lines only between rows for cleaner look
    showHead: 'firstPage',
    didDrawPage: function(data: any) {
      // Optional: Add a light header on subsequent pages if table spans multiple pages
      if (data.pageNumber > 1 && data.cursor.y === data.settings.margin.top) {
        doc.setFontSize(10);
        const secondaryWithAlpha = withAlpha(PDFStyling.colors.secondary, 1);
        doc.setTextColor(secondaryWithAlpha[0], secondaryWithAlpha[1], secondaryWithAlpha[2]);
        doc.text("Session Details (continued)", doc.internal.pageSize.width / 2, 20, { align: "center" });
      }
    }
  });
  
  return (doc as any).lastAutoTable.finalY || 300;
};
