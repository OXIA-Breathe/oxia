
import { jsPDF } from "jspdf";
import { format } from "date-fns";

// Add header section with logo and title
export const addHeader = (doc: jsPDF, dateRange: { from: Date | undefined; to: Date | undefined }, exportType: "full" | "custom") => {
  const pageWidth = doc.internal.pageSize.width;
  
  // Add OXIA logo
  const logoData = "/lovable-uploads/a94449ed-cc00-43e4-b5d4-7e810331284a.png";
  doc.addImage(logoData, "PNG", (pageWidth / 2) - 25, 25, 50, 20);
  
  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(29, 53, 87); // #1D3557 - deep blue
  doc.text("Breathing Session", pageWidth / 2, 70, { align: "center" });
  doc.text("Report", pageWidth / 2, 85, { align: "center" });
  
  // Date range
  let dateText = "All Sessions";
  if (exportType === "custom" && dateRange.from && dateRange.to) {
    dateText = `${format(dateRange.from, "MMMM d")}–${format(dateRange.to, "d, yyyy")}`;
  }
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(29, 53, 87, 0.8); // Deep blue with transparency
  doc.text(dateText, pageWidth / 2, 100, { align: "center" });
  
  // Inspirational quote
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(29, 53, 87, 0.8);
  doc.text('"Every breath counts."', pageWidth / 2, 110, { align: "center" });
};

// Add footer section
export const addFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Inspirational quote
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(29, 53, 87, 0.8);
  doc.text("Your breath is your superpower. Keep going.", pageWidth / 2, pageHeight - 35, { align: "center" });
  
  // App info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(69, 123, 157, 0.8);
  doc.text("Created with OXIA Breathing App • oxia.breathe", pageWidth / 2, pageHeight - 25, { align: "center" });
};

// Add reflection or notes section
export const addReflectionSection = (doc: jsPDF, finalY: number) => {
  // In this initial version, we'll just add a motivational quote
  // In a future version, we could integrate actual user notes
  
  const pageWidth = doc.internal.pageSize.width;
  const reflectionY = finalY + 30;
  
  doc.setFillColor(255, 255, 255, 0.8);
  doc.roundedRect(30, reflectionY, pageWidth - 60, 40, 5, 5, "F");
  
  doc.setFont("helvetica", "italic");
  doc.setFontSize(13);
  doc.setTextColor(29, 53, 87, 0.8);
  doc.text("Thank you for taking the time to breathe.", pageWidth / 2, reflectionY + 20, { align: "center" });
};
