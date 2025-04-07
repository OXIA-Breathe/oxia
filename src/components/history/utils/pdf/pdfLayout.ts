
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { PDFStyling } from "./pdfStyles";

// Add header section with logo and title
export const addHeader = (doc: jsPDF, dateRange: { from: Date | undefined; to: Date | undefined }, exportType: "full" | "custom") => {
  const pageWidth = doc.internal.pageSize.width;
  
  // Add OXIA logo - using the official transparent PNG logo
  const logoData = "/lovable-uploads/c62adcd0-64ab-41d2-80d2-cb543b464602.png";
  doc.addImage(logoData, "PNG", (pageWidth / 2) - 25, 25, 50, 20);
  
  // Title with improved styling
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(PDFStyling.colors.primary); // Deep blue
  doc.text("Breathing Session", pageWidth / 2, 70, { align: "center" });
  doc.text("Report", pageWidth / 2, 85, { align: "center" });
  
  // Date range with improved formatting
  let dateText = "All Sessions";
  if (exportType === "custom" && dateRange.from && dateRange.to) {
    dateText = `${format(dateRange.from, "MMMM d")}–${format(dateRange.to, "d, yyyy")}`;
  }
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(PDFStyling.colors.primary, 0.8); // Deep blue with transparency
  doc.text(dateText, pageWidth / 2, 100, { align: "center" });
  
  // Inspirational quote for personal growth focus
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(PDFStyling.colors.secondary, 0.8);
  doc.text('"Every breath is a step toward your best self."', pageWidth / 2, 115, { align: "center" });
};

// Add footer section with improved motivational content
export const addFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Add a soft gradient bar above footer content
  doc.setFillColor(...PDFStyling.colors.lightAccent, 0.3);
  doc.roundedRect(30, pageHeight - 50, pageWidth - 60, 2, 1, 1, "F");
  
  // Inspirational quote focused on growth
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(PDFStyling.colors.primary, 0.8);
  doc.text("Your breath connects your mind and body. Keep growing.", pageWidth / 2, pageHeight - 35, { align: "center" });
  
  // App info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(PDFStyling.colors.secondary, 0.8);
  doc.text("Created with OXIA Breathing App • oxia.breathe", pageWidth / 2, pageHeight - 25, { align: "center" });
};

// Add reflection section with more focus on personal growth
export const addReflectionSection = (doc: jsPDF, finalY: number) => {
  const pageWidth = doc.internal.pageSize.width;
  const reflectionY = finalY + 30;
  
  // Create a calming background block
  doc.setFillColor(...PDFStyling.colors.lightAccent, 0.2);
  doc.roundedRect(30, reflectionY, pageWidth - 60, 50, 5, 5, "F");
  
  // Section title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(PDFStyling.colors.primary);
  doc.text("Your Journey", pageWidth / 2, reflectionY + 15, { align: "center" });
  
  // Meaningful message
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(PDFStyling.colors.secondary);
  doc.text("Each session represents a moment of self-care and growth.", pageWidth / 2, reflectionY + 30, { align: "center" });
  doc.text("Keep nurturing your practice.", pageWidth / 2, reflectionY + 40, { align: "center" });
};
