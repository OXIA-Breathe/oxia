
import { BreathSession } from "@/types/breath";
import { format } from "date-fns";
import { SessionStats } from "./types";
import { createPdfStyles } from "./htmlStyles";
import { 
  createHeader, 
  createSummarySection, 
  createSessionsTable, 
  createFooter 
} from "./htmlComponents";

// Create the HTML content for the PDF
export const createPdfHtml = (
  sessions: BreathSession[],
  stats: SessionStats,
  dateRange: { from: Date | undefined; to: Date | undefined }
): HTMLElement => {
  // Create container element
  const container = document.createElement("div");
  
  // Add styles
  const style = createPdfStyles();
  container.appendChild(style);
  
  // Create report container
  const reportContainer = document.createElement("div");
  reportContainer.className = "report-container";
  
  // Add header components
  const { logoDiv, subtitle } = createHeader();
  reportContainer.appendChild(logoDiv);
  reportContainer.appendChild(subtitle);
  
  // Date range (if applicable)
  if (dateRange.from && dateRange.to) {
    const dateRangeText = document.createElement("div");
    dateRangeText.style.fontSize = "14px";
    dateRangeText.style.marginBottom = "20px";
    dateRangeText.textContent = `${format(dateRange.from, "MMMM d, yyyy")} - ${format(dateRange.to, "MMMM d, yyyy")}`;
    reportContainer.appendChild(dateRangeText);
  }
  
  // Add summary section
  const summary = createSummarySection(stats);
  reportContainer.appendChild(summary);
  
  // Add sessions table
  const table = createSessionsTable(sessions);
  reportContainer.appendChild(table);
  
  // Add footer
  const footerQuote = createFooter();
  reportContainer.appendChild(footerQuote);
  
  // Assemble final container
  container.appendChild(reportContainer);
  
  return container;
};
