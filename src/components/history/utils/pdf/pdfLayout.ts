
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { PDFStyling, withAlpha } from "./pdfStyles";

// Add header section with logo and title
export const addHeader = (doc: jsPDF, dateRange: { from: Date | undefined; to: Date | undefined }, exportType: "full" | "custom") => {
  const pageWidth = doc.internal.pageSize.width;
  
  // Add OXIA logo - using the official transparent PNG logo
  const logoData = "/lovable-uploads/c62adcd0-64ab-41d2-80d2-cb543b464602.png";
  doc.addImage(logoData, "PNG", (pageWidth / 2) - 25, 25, 50, 20);
  
  // Title with improved styling
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(PDFStyling.colors.primary[0], PDFStyling.colors.primary[1], PDFStyling.colors.primary[2]); // Deep blue
  doc.text("Breathing Session", pageWidth / 2, 70, { align: "center" });
  doc.text("Report", pageWidth / 2, 85, { align: "center" });
  
  // Date range with improved formatting
  let dateText = "All Sessions";
  if (exportType === "custom" && dateRange.from && dateRange.to) {
    dateText = `${format(dateRange.from, "MMMM d")}–${format(dateRange.to, "d, yyyy")}`;
  }
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  
  const primaryWithAlpha = withAlpha(PDFStyling.colors.primary, 0.8);
  doc.setTextColor(primaryWithAlpha[0], primaryWithAlpha[1], primaryWithAlpha[2], primaryWithAlpha[3]); // Deep blue with transparency
  doc.text(dateText, pageWidth / 2, 100, { align: "center" });
  
  // Inspirational quote for personal growth focus
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  
  const secondaryWithAlpha = withAlpha(PDFStyling.colors.secondary, 0.8);
  doc.setTextColor(secondaryWithAlpha[0], secondaryWithAlpha[1], secondaryWithAlpha[2], secondaryWithAlpha[3]);
  doc.text('"Every breath is a step toward your best self."', pageWidth / 2, 115, { align: "center" });
};

// Add footer section with improved motivational content
export const addFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Add a soft gradient bar above footer content
  const lightAccentWithAlpha = withAlpha(PDFStyling.colors.lightAccent, 0.3);
  doc.setFillColor(lightAccentWithAlpha[0], lightAccentWithAlpha[1], lightAccentWithAlpha[2], lightAccentWithAlpha[3]);
  doc.roundedRect(30, pageHeight - 50, pageWidth - 60, 2, 1, 1, "F");
  
  // Inspirational quote focused on growth
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  
  const primaryWithAlpha = withAlpha(PDFStyling.colors.primary, 0.8);
  doc.setTextColor(primaryWithAlpha[0], primaryWithAlpha[1], primaryWithAlpha[2], primaryWithAlpha[3]);
  doc.text("Your breath connects your mind and body. Keep growing.", pageWidth / 2, pageHeight - 35, { align: "center" });
  
  // App info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  const secondaryWithAlpha = withAlpha(PDFStyling.colors.secondary, 0.8);
  doc.setTextColor(secondaryWithAlpha[0], secondaryWithAlpha[1], secondaryWithAlpha[2], secondaryWithAlpha[3]);
  doc.text("Created with OXIA Breathing App • oxia.breathe", pageWidth / 2, pageHeight - 25, { align: "center" });
};

// Add reflection section with more focus on personal growth
export const addReflectionSection = (doc: jsPDF, finalY: number) => {
  const pageWidth = doc.internal.pageSize.width;
  const reflectionY = finalY + 30;
  
  // Create a calming background block
  const lightAccentWithAlpha = withAlpha(PDFStyling.colors.lightAccent, 0.2);
  doc.setFillColor(lightAccentWithAlpha[0], lightAccentWithAlpha[1], lightAccentWithAlpha[2], lightAccentWithAlpha[3]);
  doc.roundedRect(30, reflectionY, pageWidth - 60, 50, 5, 5, "F");
  
  // Section title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(PDFStyling.colors.primary[0], PDFStyling.colors.primary[1], PDFStyling.colors.primary[2]);
  doc.text("Your Journey", pageWidth / 2, reflectionY + 15, { align: "center" });
  
  // Meaningful message
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(PDFStyling.colors.secondary[0], PDFStyling.colors.secondary[1], PDFStyling.colors.secondary[2]);
  doc.text("Each session represents a moment of self-care and growth.", pageWidth / 2, reflectionY + 30, { align: "center" });
  doc.text("Keep nurturing your practice.", pageWidth / 2, reflectionY + 40, { align: "center" });
};
