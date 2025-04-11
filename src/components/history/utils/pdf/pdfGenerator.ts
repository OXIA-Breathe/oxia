
import { GeneratePDFParams, PDFOutput } from "./types";
import { generateHTMLPDF } from "./htmlPdfGenerator";

// Main PDF generation function - now using HTML-based generator
export const generatePDF = async ({ sessions, dateRange, exportType }: GeneratePDFParams): Promise<PDFOutput> => {
  try {
    // Use HTML-based PDF generation
    const result = await generateHTMLPDF({ sessions, dateRange, exportType });
    return result;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
