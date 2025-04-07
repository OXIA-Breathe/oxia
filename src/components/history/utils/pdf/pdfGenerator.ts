
import { jsPDF } from "jspdf";
import "jspdf/dist/polyfills.es.js";
import { BreathSession } from "@/types/breath";
import { initializePDF, addHeader, addFooter, addReflectionSection } from "./pdfStyles";
import { filterSessionsByDateRange, calculateSessionStats } from "./pdfDataUtils";
import { addSummarySection, addSessionsTable } from "./pdfSections";

interface GeneratePDFParams {
  sessions: BreathSession[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  exportType: "full" | "custom";
}

interface PDFOutput {
  blob: Blob;
  fileName: string;
}

// Main PDF generation function
export const generatePDF = ({ sessions, dateRange, exportType }: GeneratePDFParams): PDFOutput => {
  try {
    // Initialize PDF document
    const doc = initializePDF();
    
    // Add header section
    addHeader(doc, dateRange, exportType);
    
    // Filter sessions based on date range if needed
    const filteredSessions = filterSessionsByDateRange(sessions, dateRange, exportType);
    
    // Calculate summary statistics
    const stats = calculateSessionStats(filteredSessions);
    
    // Add summary statistics section
    addSummarySection(doc, stats, filteredSessions);
    
    // Add sessions table and get final Y position
    const finalY = addSessionsTable(doc, filteredSessions);
    
    // Add reflection section
    addReflectionSection(doc, finalY);
    
    // Add footer
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
