
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
  
  // First layer - light background as shown in mockup
  setFillColor(doc, PDFStyling.colors.background);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Add a subtle blue accent area at top (20% of page)
  const headerHeight = pageHeight * 0.2;
  setFillColor(doc, PDFStyling.colors.lightAccent);
  doc.rect(0, 0, pageWidth, headerHeight, "F");
  
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
  const startY = pageHeight - 100;
  
  // Draw first wave (white)
  doc.setLineWidth(0.1);
  doc.lines(
    [
      [0, 10], [10, 5], [20, 0], [30, -5], [40, -10], 
      [50, -5], [60, 0], [70, 5], [80, 10], [90, 15],
      [100, 10], [110, 5], [120, 0], [130, -5], [140, -10],
      [150, -5], [160, 0], [170, 5], [180, 10], [190, 5], [200, 0]
    ],
    startY + 30,
    0,
    [1, 1],
    "F"
  );
  
  // Add second wave with light accent blue
  setFillColor(doc, PDFStyling.colors.accent);
  doc.setLineWidth(0.1);
  doc.lines(
    [
      [0, 15], [10, 10], [20, 5], [30, 0], [40, -5], 
      [50, 0], [60, 5], [70, 10], [80, 15], [90, 10],
      [100, 5], [110, 0], [120, -5], [130, 0], [140, 5],
      [150, 10], [160, 15], [170, 10], [180, 5], [190, 0], [200, -5]
    ],
    startY + 60,
    0,
    [1, 1],
    "F"
  );
};
