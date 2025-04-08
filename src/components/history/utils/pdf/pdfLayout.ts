
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { PDFStyling, setFillColor, setTextColor, setDrawColor } from "./pdfStyles";

// Add header section with logo and title - matching the mockup
export const addHeader = (doc: jsPDF, dateRange: { from: Date | undefined; to: Date | undefined }, exportType: "full" | "custom") => {
  const pageWidth = doc.internal.pageSize.width;
  
  // Add OXIA logo at top center - vertically stretched as requested
  const logoPath = "/lovable-uploads/c62adcd0-64ab-41d2-80d2-cb543b464602.png"; // OXIA official logo
  doc.addImage(logoPath, "PNG", (pageWidth / 2) - 30, 20, 60, 40); // Stretched vertically
  
  // Title with improved styling to match mockup
  setTextColor(doc, PDFStyling.colors.primary);
  doc.setFont(PDFStyling.fonts.header.family, PDFStyling.fonts.header.style);
  doc.setFontSize(PDFStyling.fonts.header.size);
  doc.text("Breathing Session", pageWidth / 2, 85, { align: "center" });
  doc.text("Report", pageWidth / 2, 105, { align: "center" });
  
  // Date range with improved formatting
  let dateText = "All Sessions";
  if (exportType === "custom" && dateRange.from && dateRange.to) {
    dateText = `${format(dateRange.from, "MMMM d")}–${format(dateRange.to, "d, yyyy")}`;
  }
  
  doc.setFontSize(PDFStyling.fonts.subheader.size);
  doc.setFont(PDFStyling.fonts.subheader.family, "normal");
  setTextColor(doc, PDFStyling.colors.secondary);
  doc.text(dateText, pageWidth / 2, 125, { align: "center" });
  
  // Inspirational quote as shown in mockup
  doc.setFontSize(PDFStyling.fonts.body.size + 2);
  doc.setFont(PDFStyling.fonts.body.family, "italic");
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text('"Every breath counts."', pageWidth / 2, 140, { align: "center" });
};

// Add footer section with improved motivational content as shown in mockup
export const addFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Thank you message in the bottom section
  doc.setFont(PDFStyling.fonts.body.family, "normal");
  doc.setFontSize(PDFStyling.fonts.body.size + 2);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text("Thank you for taking the time to breathe.", pageWidth / 2, pageHeight - 50, { align: "center" });
  
  // App info - minimal and elegant
  doc.setFont(PDFStyling.fonts.small.family, "normal");
  doc.setFontSize(PDFStyling.fonts.small.size);
  setTextColor(doc, PDFStyling.colors.secondary);
  doc.text("Generated with OXIA Breathing App", pageWidth / 2, pageHeight - 30, { align: "center" });
};
