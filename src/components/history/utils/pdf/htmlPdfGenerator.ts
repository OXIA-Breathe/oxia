
import { BreathSession } from "@/types/breath";
import { GeneratePDFParams, PDFOutput } from "./types";
import { calculateSessionStats, filterSessionsByDateRange } from "./pdfDataUtils";
import { createPdfHtml } from "./htmlAssembler";
import { html2pdfPromise, getDefaultPdfOptions } from "./html2pdfUtil";

// Main function to generate PDF from HTML
export const generateHTMLPDF = async ({ sessions, dateRange, exportType }: GeneratePDFParams): Promise<PDFOutput> => {
  try {
    // Filter sessions based on date range
    const filteredSessions = filterSessionsByDateRange(sessions, dateRange, exportType);
    
    // Calculate summary statistics
    const stats = calculateSessionStats(filteredSessions);
    
    // Generate HTML content
    const htmlContent = createPdfHtml(filteredSessions, stats, dateRange);
    
    // Get HTML2PDF options
    const options = getDefaultPdfOptions();
    
    // Generate PDF from HTML
    const pdfBlob = await html2pdfPromise(htmlContent, options);
    
    return {
      blob: pdfBlob,
      fileName: "OXIA-Breathing-Report.pdf",
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
