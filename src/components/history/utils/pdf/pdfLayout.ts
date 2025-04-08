
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { PDFStyling, setFillColor, setTextColor, setDrawColor } from "./pdfStyles";

// Add header section with logo and title - matching the mockup
export const addHeader = (doc: jsPDF, dateRange: { from: Date | undefined; to: Date | undefined }, exportType: "full" | "custom") => {
  const pageWidth = doc.internal.pageSize.width;
  
  // Add OXIA logo at top center - slightly stretched vertically as requested
  const logoData = "/lovable-uploads/c62adcd0-64ab-41d2-80d2-cb543b464602.png";
  doc.addImage(logoData, "PNG", (pageWidth / 2) - 25, 30, 50, 30); // Increased height for vertical stretch
  
  // Title with improved styling to match mockup
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  setTextColor(doc, PDFStyling.colors.primary);
  doc.text("Breathing Session", pageWidth / 2, 90, { align: "center" });
  doc.text("Report", pageWidth / 2, 110, { align: "center" });
  
  // Date range with improved formatting
  let dateText = "All Sessions";
  if (exportType === "custom" && dateRange.from && dateRange.to) {
    dateText = `${format(dateRange.from, "MMMM d")}–${format(dateRange.to, "d, yyyy")}`;
  }
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  setTextColor(doc, PDFStyling.colors.primary, 0.8);
  doc.text(dateText, pageWidth / 2, 130, { align: "center" });
  
  // Inspirational quote as shown in mockup
  doc.setFontSize(16);
  doc.setFont("helvetica", "italic");
  setTextColor(doc, PDFStyling.colors.primary, 0.7);
  doc.text('"Every breath counts."', pageWidth / 2, 150, { align: "center" });
};

// Add footer section with improved motivational content as shown in mockup
export const addFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Thank you message in the bottom section
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  setTextColor(doc, PDFStyling.colors.primary, 0.8);
  doc.text("Thank you for taking the time to breathe.", pageWidth / 2, pageHeight - 180, { align: "center" });
  
  // App info - minimal and elegant
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(doc, PDFStyling.colors.secondary, 0.6);
  doc.text("Generated with OXIA Breathing App", pageWidth / 2, pageHeight - 25, { align: "center" });
};

// Add reflection section with more focus on personal growth
export const addReflectionSection = (doc: jsPDF, finalY: number) => {
  // In the mockup, this section is replaced with the thank you message and wave pattern
  // The reflection content is omitted to match the mockup's cleaner layout
};
