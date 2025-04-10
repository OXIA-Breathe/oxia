
import { jsPDF } from "jspdf";
import { PDFStyling, setFillColor, setDrawColor } from "./pdfStyles";

// Initialize PDF document with clean white background and subtle gradient header
export const initializePDF = (): jsPDF => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Set up white background
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // White background to match the HTML/CSS layout
  setFillColor(doc, PDFStyling.colors.white);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Add report container with rounded corners
  const margin = 20;
  const containerWidth = pageWidth - (margin * 2);
  const containerHeight = pageHeight - (margin * 2);
  
  // Create container with white background and shadow
  addReportContainer(doc, margin, margin, containerWidth, containerHeight);
  
  return doc;
};

// Helper function to add report container with shadow and rounded corners
const addReportContainer = (doc: jsPDF, x: number, y: number, width: number, height: number) => {
  // Draw subtle shadow
  setFillColor(doc, [240, 240, 240]);
  doc.roundedRect(x + 1, y + 1, width, height, 4, 4, "F");
  
  // Draw white container
  setFillColor(doc, PDFStyling.colors.white);
  doc.roundedRect(x, y, width, height, 4, 4, "F");
};
