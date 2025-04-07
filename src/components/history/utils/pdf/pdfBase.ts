
import { jsPDF } from "jspdf";
import { PDFStyling } from "./pdfStyles";

// Initialize PDF document with improved gradient background
export const initializePDF = (): jsPDF => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Set up gradient background
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // First layer - light blue base for calm feeling
  doc.setFillColor(...PDFStyling.colors.background); // Very light blue base
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Add soft gradient effect with multiple rectangles of varying opacity
  for (let i = 0; i < 60; i++) {
    const y = (i / 60) * pageHeight;
    const height = pageHeight / 60;
    const alpha = 0.4 - (i / 150); // Gradually decrease opacity
    
    // Top part - lighter
    if (i < 30) {
      doc.setFillColor(...PDFStyling.colors.lightAccent, alpha); 
    } 
    // Bottom part - slightly deeper
    else {
      doc.setFillColor(...PDFStyling.colors.accent, alpha);
    }
    
    doc.rect(0, y, pageWidth, height, "F");
  }
  
  // Add soft wave design at top and bottom for a breathing theme
  addWavePattern(doc, 140, true); // Top wave
  addWavePattern(doc, pageHeight - 60, false); // Bottom wave
  
  return doc;
};

// Helper function to add wave patterns
const addWavePattern = (doc: jsPDF, yPosition: number, isTopWave: boolean) => {
  const pageWidth = doc.internal.pageSize.width;
  
  doc.setDrawColor(...PDFStyling.colors.accent, 0.3);
  doc.setLineWidth(0.3);
  doc.setFillColor(...PDFStyling.colors.accent, 0.1);
  
  // Create multiple wave layers for depth
  for (let layer = 0; layer < 3; layer++) {
    const waveHeight = 8 - (layer * 2); // Decreasing height for each layer
    const yOffset = layer * 10;
    const adjustedY = isTopWave ? yPosition + yOffset : yPosition - yOffset;
    
    let path = [];
    
    // Start point
    path.push([0, adjustedY]);
    
    // Create wave points
    for (let x = 0; x < pageWidth; x += 10) {
      const amplitude = waveHeight * Math.sin(x / 40) * (isTopWave ? 1 : -1);
      path.push([x, adjustedY + amplitude]);
    }
    
    // Close the path
    path.push([pageWidth, adjustedY]);
    
    if (isTopWave) {
      path.push([pageWidth, 0]);
      path.push([0, 0]);
    } else {
      const pageHeight = doc.internal.pageSize.height;
      path.push([pageWidth, pageHeight]);
      path.push([0, pageHeight]);
    }
    
    // Draw the path
    doc.setFillColor(...PDFStyling.colors.accent, 0.05 + (layer * 0.03));
    
    // Since jsPDF doesn't have native path drawing, we'll approximate
    doc.moveTo(path[0][0], path[0][1]);
    for (let i = 1; i < path.length; i++) {
      doc.lineTo(path[i][0], path[i][1]);
    }
    doc.lineTo(path[0][0], path[0][1]);
    doc.fill();
  }
};
