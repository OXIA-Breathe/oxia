
import { jsPDF } from "jspdf";

// Initialize PDF document with gradient background
export const initializePDF = (): jsPDF => {
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
export const addHeader = (doc: jsPDF, dateRange: { from: Date | undefined; to: Date | undefined }, exportType: "full" | "custom") => {
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
    const { format } = require('date-fns');
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

// Add footer section
export const addFooter = (doc: jsPDF) => {
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

// Add reflection or notes section
export const addReflectionSection = (doc: jsPDF, finalY: number) => {
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
