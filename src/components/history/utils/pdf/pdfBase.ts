
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
  
  // Set up background
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Light blue background to match the HTML/CSS layout
  setFillColor(doc, PDFStyling.colors.background);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Add report container with rounded corners
  const margin = 20;
  const containerWidth = pageWidth - (margin * 2);
  const containerHeight = pageHeight - (margin * 2);
  
  // Create container with white background
  addReportContainer(doc, margin, margin, containerWidth, containerHeight);
  
  return doc;
};

// Helper function to add report container with rounded corners
const addReportContainer = (doc: jsPDF, x: number, y: number, width: number, height: number) => {
  // Draw white container with rounded corners
  setFillColor(doc, PDFStyling.colors.white);
  doc.roundedRect(x, y, width, height, 10, 10, "F");
};
