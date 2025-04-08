
import { jsPDF } from "jspdf";
import "jspdf/dist/polyfills.es.js";
import { GeneratePDFParams, PDFOutput } from "./types";
import { initializePDF } from "./pdfBase";
import { addHeader, addFooter } from "./pdfLayout";
import { filterSessionsByDateRange, calculateSessionStats } from "./pdfDataUtils";
import { addSummarySection, addSessionsTable } from "./pdfSections";

// Main PDF generation function
export const generatePDF = ({ sessions, dateRange, exportType }: GeneratePDFParams): PDFOutput => {
  try {
    // Initialize PDF document with mockup-style background
    const doc = initializePDF();
    
    // Add header section with logo and title
    addHeader(doc, dateRange, exportType);
    
    // Filter sessions based on date range if needed
    const filteredSessions = filterSessionsByDateRange(sessions, dateRange, exportType);
    
    // Calculate summary statistics
    const stats = calculateSessionStats(filteredSessions);
    
    // Add summary statistics section in card layout
    addSummarySection(doc, stats, filteredSessions);
    
    // Add sessions table in mockup style
    const finalY = addSessionsTable(doc, filteredSessions);
    
    // Add footer with thank you message
    addFooter(doc);
    
    // Generate PDF output
    const pdfOutput = doc.output("blob");
    const fileName = "OXIA-Breathing-Report.pdf";
    
    return { blob: pdfOutput, fileName };
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error; // Re-throw to be caught by the calling function
  }
};
