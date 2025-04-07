
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { BreathSession } from "@/types/breath";
import { formatTime, formatTimeDisplay } from "../formatTime";
import { prepareSessionTableData } from "./pdfDataUtils";
import { SessionStats } from "./types";

// Add summary statistics section with cards
export const addSummarySection = (
  doc: jsPDF, 
  stats: SessionStats,
  filteredSessions: BreathSession[]
) => {
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
  if (filteredSessions.length > 0) {
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
    
    // Draw a series of small segments to approximate an arc
    const startAngle = 0; 
    const endAngle = 270; // 3/4 of a circle in degrees
    
    // Draw a series of small segments to approximate an arc
    for (let angle = startAngle; angle <= endAngle; angle += 10) {
      const radians = (angle * Math.PI) / 180;
      const x = chartCenterX + chartRadius * Math.cos(radians);
      const y = chartCenterY + chartRadius * Math.sin(radians);
      
      doc.circle(x, y, 1, "F");
    }
    
    // Add text inside circle
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(29, 53, 87);
    doc.text(formatTimeDisplay(totalTime), chartCenterX, chartCenterY, { align: "center" });
  }
};

// Add sessions table
export const addSessionsTable = (doc: jsPDF, sessions: BreathSession[]) => {
  if (sessions.length === 0) return 220;
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(29, 53, 87);
  doc.text("Session Details", doc.internal.pageSize.width / 2, 220, { align: "center" });
  
  const { tableColumns, tableData } = prepareSessionTableData(sessions);
  
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
