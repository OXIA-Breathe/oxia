
import { jsPDF } from "jspdf";
import { PDFStyling, setFillColor, setDrawColor } from "./pdfStyles";

// Initialize PDF document with improved gradient background to match mockup
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
  
  // First layer - light blue base as shown in mockup
  setFillColor(doc, PDFStyling.colors.background);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Add a slightly darker blue rectangle to match the darker header area in mockup
  const headerHeight = 140;
  setFillColor(doc, PDFStyling.colors.background, 1.1); // Slightly darker
  doc.rect(67, 20, pageWidth - 134, headerHeight, "F");
  
  // Add wave pattern at bottom as shown in mockup
  addWavePatternBottom(doc);
  
  return doc;
};

// Helper function to add wave pattern at the bottom of the page as in mockup
const addWavePatternBottom = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Create smooth wave pattern at bottom
  setFillColor(doc, PDFStyling.colors.white);
  setDrawColor(doc, PDFStyling.colors.white);
  
  // Starting position for the wave (about 80% down the page)
  const startY = pageHeight - 140;
  
  // Draw first wave
  doc.moveTo(0, pageHeight);
  doc.lineTo(0, startY + 50);
  
  // Create smooth wave points
  for (let x = 0; x <= pageWidth; x += 10) {
    const amplitude = 30 * Math.sin((x / pageWidth) * Math.PI * 2);
    doc.lineTo(x, startY + 50 + amplitude);
  }
  
  doc.lineTo(pageWidth, pageHeight);
  doc.lineTo(0, pageHeight);
  doc.fill();
  
  // Add second wave with lighter blue for depth
  setFillColor(doc, PDFStyling.colors.background, 0.7);
  
  doc.moveTo(0, pageHeight);
  doc.lineTo(0, startY + 70);
  
  for (let x = 0; x <= pageWidth; x += 10) {
    const amplitude = 25 * Math.sin((x / pageWidth) * Math.PI * 1.5);
    doc.lineTo(x, startY + 80 + amplitude);
  }
  
  doc.lineTo(pageWidth, pageHeight);
  doc.lineTo(0, pageHeight);
  doc.fill();
};
