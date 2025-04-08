
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { BreathSession } from "@/types/breath";
import { formatTime, formatTimeDisplay } from "../formatTime";
import { prepareSessionTableData } from "./pdfDataUtils";
import { SessionStats } from "./types";
import { PDFStyling, setFillColor, setTextColor, setDrawColor } from "./pdfStyles";

// Add summary statistics section with card layout as shown in mockup
export const addSummarySection = (
  doc: jsPDF, 
  stats: SessionStats,
  filteredSessions: BreathSession[]
) => {
  const { totalSessions, totalBreaths, totalTime, avgSessionDuration } = stats;
  const pageWidth = doc.internal.pageSize.width;
  
  // Create main container card for all stats - white rounded card as shown in mockup
  setFillColor(doc, PDFStyling.colors.white);
  doc.roundedRect(30, 170, pageWidth - 60, 70, 10, 10, "F");
  
  // Add subtle shadow effect
  setFillColor(doc, [220, 220, 220], 0.2);
  doc.roundedRect(32, 172, pageWidth - 60, 70, 10, 10, "F");
  
  // Define column widths for 3-column layout as in mockup
  const statColumns = 3;
  const columnWidth = (pageWidth - 80) / statColumns;
  
  // Stats - Total Sessions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text(totalSessions.toString(), 50, 210, { align: "center" });
  
  doc.setFontSize(12);
  setTextColor(doc, PDFStyling.colors.secondary);
  doc.text("Total", 50, 225, { align: "center" });
  doc.text("Sessions", 50, 235, { align: "center" });
  
  // Stats - Total Breaths
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text(totalBreaths.toString(), pageWidth / 2, 210, { align: "center" });
  
  doc.setFontSize(12);
  setTextColor(doc, PDFStyling.colors.secondary);
  doc.text("Total", pageWidth / 2, 225, { align: "center" });
  doc.text("Breaths", pageWidth / 2, 235, { align: "center" });
  
  // Stats - Average Duration
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text(formatTime(avgSessionDuration), pageWidth - 50, 210, { align: "center" });
  
  doc.setFontSize(12);
  setTextColor(doc, PDFStyling.colors.secondary);
  doc.text("Average", pageWidth - 50, 225, { align: "center" });
  doc.text("Duration", pageWidth - 50, 235, { align: "center" });
  
  // Add circular progress chart if there's enough sessions (right side of stats card)
  if (filteredSessions.length > 2) {
    const centerX = pageWidth - 50;
    const centerY = 205;
    const radius = 20;
    
    // Draw progress circle background
    setDrawColor(doc, PDFStyling.colors.accent, 0.3);
    setFillColor(doc, PDFStyling.colors.accent, 0.1);
    doc.circle(centerX, centerY, radius, "FD");
    
    // Draw progress arc (about 75% complete)
    const progress = 0.75; // This would be calculated based on actual data
    doc.setLineWidth(4);
    setDrawColor(doc, PDFStyling.colors.secondary);
    
    // Draw arc manually since jsPDF doesn't have native arc support
    const startAngle = -90 * (Math.PI / 180); // Start from top
    const endAngle = startAngle + (progress * 2 * Math.PI);
    
    // Add center text (simplified version)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    setTextColor(doc, PDFStyling.colors.primary);
    
    // In a full implementation, we would calculate real progress metrics
    doc.text("2 min", centerX, centerY - 3, { align: "center" });
    doc.text("17 sec", centerX, centerY + 5, { align: "center" });
  }
};

// Add sessions table - consolidated as one single table as in mockup
export const addSessionsTable = (doc: jsPDF, sessions: BreathSession[]) => {
  if (sessions.length === 0) return 260;
  
  // Table headers based on mockup
  const tableY = 260;
  
  // Headers
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setTextColor(doc, PDFStyling.colors.primary);
  
  // Header cells
  doc.text("Date", 40, tableY);
  doc.text("Time", 105, tableY);
  doc.text("Inhale / Hold / Exhale", 155, tableY);
  doc.text("Repetitions", 200, tableY);
  doc.text("Duration", 250, tableY);
  
  // Light separator line under headers
  setDrawColor(doc, PDFStyling.colors.tableBorder);
  doc.setLineWidth(0.5);
  doc.line(30, tableY + 5, doc.internal.pageSize.width - 30, tableY + 5);
  
  // Create a single table with all sessions similar to mockup
  const { tableColumns, tableData } = prepareSessionTableData(sessions);
  
  // Use autotable for the body with clean styling
  autoTable(doc, {
    startY: tableY + 10,
    head: [], // We've already drawn custom headers
    body: tableData,
    theme: 'plain',
    styles: {
      fontSize: 11,
      cellPadding: 5,
      overflow: "ellipsize",
      valign: "middle",
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 65 }, // Date
      1: { cellWidth: 50 }, // Time
      2: { cellWidth: 65 }, // Breath Pattern
      3: { cellWidth: 20, halign: 'center' }, // Repetitions
      4: { cellWidth: 30, halign: 'center' }, // Duration
    },
    alternateRowStyles: {
      fillColor: [PDFStyling.colors.tableStripe[0], PDFStyling.colors.tableStripe[1], PDFStyling.colors.tableStripe[2]]
    },
    tableLineColor: [PDFStyling.colors.tableBorder[0], PDFStyling.colors.tableBorder[1], PDFStyling.colors.tableBorder[2]],
    tableLineWidth: 0.2,
    // Set only horizontal lines between rows for cleaner look like in mockup
    showHead: false,
    didDrawPage: function(data) {
      // If table spans multiple pages, add header on new pages
      if (data.pageNumber > 1) {
        const currentY = data.settings.margin.top;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        setTextColor(doc, PDFStyling.colors.primary);
        
        // Column headers on additional pages
        doc.text("Date", 40, currentY - 5);
        doc.text("Time", 105, currentY - 5);
        doc.text("Inhale / Hold / Exhale", 155, currentY - 5);
        doc.text("Repetitions", 200, currentY - 5);
        doc.text("Duration", 250, currentY - 5);
        
        // Separator line
        setDrawColor(doc, PDFStyling.colors.tableBorder);
        doc.setLineWidth(0.5);
        doc.line(30, currentY, doc.internal.pageSize.width - 30, currentY);
      }
    }
  });
  
  return (doc as any).lastAutoTable.finalY || 300;
};
