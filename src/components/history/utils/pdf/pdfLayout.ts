
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { PDFStyling, setFillColor, setTextColor, setDrawColor } from "./pdfStyles";

export const addHeader = (doc: jsPDF, dateRange: { from: Date | undefined; to: Date | undefined }, exportType: "full" | "custom") => {
  const pageWidth = doc.internal.pageSize.width;
  const margin = 30; // margin from edges
  
  // Title with styling to match HTML layout
  setTextColor(doc, PDFStyling.colors.primary);
  doc.setFont(PDFStyling.fonts.header.family, PDFStyling.fonts.header.style);
  doc.setFontSize(PDFStyling.fonts.header.size);
  doc.text("Breathing Session Report", margin, margin + 10);
  
  // Add OXIA logo on the right side with preserved aspect ratio
  const logoPath = "/lovable-uploads/c62adcd0-64ab-41d2-80d2-cb543b464602.png"; // OXIA official logo
  
  // Determine logo size while maintaining aspect ratio
  const logoMaxWidth = 30;
  const logoMaxHeight = 15;
  
  // Add the logo without stretching
  doc.addImage(logoPath, "PNG", pageWidth - margin - logoMaxWidth, margin, logoMaxWidth, logoMaxHeight, undefined, "NONE");
  
  // Add subtitle/quote as in the HTML layout
  doc.setFont(PDFStyling.fonts.body.family, "italic");
  doc.setFontSize(PDFStyling.fonts.body.size);
  setTextColor(doc, PDFStyling.colors.secondary);
  doc.text("Every breath counts.", margin, margin + 25);
};

// Add footer section with inspirational quote
export const addFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 30;
  
  // Footer quote as in the HTML layout
  doc.setFont(PDFStyling.fonts.body.family, "italic");
  doc.setFontSize(PDFStyling.fonts.body.size);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text("Every breath is a step toward your best self.", pageWidth / 2, pageHeight - margin - 10, { align: "center" });
};
