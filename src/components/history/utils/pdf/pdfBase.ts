
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
