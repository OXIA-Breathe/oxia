
import html2pdf from "html2pdf.js";
import { format } from "date-fns";
import { BreathSession } from "@/types/breath";
import { formatTimeDisplay } from "./pdfDataUtils";
import { GeneratePDFParams, PDFOutput, SessionStats } from "./types";
import { calculateSessionStats, filterSessionsByDateRange } from "./pdfDataUtils";

// Main function to generate PDF from HTML
export const generateHTMLPDF = async ({ sessions, dateRange, exportType }: GeneratePDFParams): Promise<PDFOutput> => {
  try {
    // Filter sessions based on date range
    const filteredSessions = filterSessionsByDateRange(sessions, dateRange, exportType);
    
    // Calculate summary statistics
    const stats = calculateSessionStats(filteredSessions);
    
    // Generate HTML content
    const htmlContent = createPdfHtml(filteredSessions, stats, dateRange);
    
    // HTML2PDF options
    const options = {
      margin: 10,
      filename: "OXIA-Breathing-Report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };
    
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

// Helper function to wrap html2pdf in a Promise
const html2pdfPromise = (element: HTMLElement, options: any): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    html2pdf()
      .set(options)
      .from(element)
      .save()
      .outputPdf('blob')
      .then((blob: Blob) => {
        resolve(blob);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

// Create the HTML content for the PDF
const createPdfHtml = (
  sessions: BreathSession[],
  stats: SessionStats,
  dateRange: { from: Date | undefined; to: Date | undefined }
): HTMLElement => {
  // Create a container div
  const container = document.createElement("div");
  container.className = "pdf-container";
  container.style.fontFamily = "Helvetica, Arial, sans-serif";
  container.style.padding = "30px";
  container.style.color = "#1D3557";
  
  // Add header section
  container.appendChild(createHeader(dateRange));
  
  // Add stats section
  container.appendChild(createStatsSection(stats));
  
  // Add sessions table
  container.appendChild(createSessionsTable(sessions));
  
  // Add footer
  container.appendChild(createFooter());
  
  return container;
};

// Create header section with logo
const createHeader = (dateRange: { from: Date | undefined; to: Date | undefined }): HTMLElement => {
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "30px";
  header.style.borderBottom = "1px solid #E1E5EB";
  header.style.paddingBottom = "15px";
  
  // Title and subtitle
  const titleSection = document.createElement("div");
  
  const title = document.createElement("h1");
  title.textContent = "Breathing Session Report";
  title.style.fontSize = "24px";
  title.style.color = "#1D3557";
  title.style.margin = "0 0 5px 0";
  
  const subtitle = document.createElement("p");
  subtitle.textContent = "Every breath counts.";
  subtitle.style.fontSize = "14px";
  subtitle.style.fontStyle = "italic";
  subtitle.style.color = "#457B9D";
  subtitle.style.margin = "0";
  
  // Date range (if applicable)
  if (dateRange.from && dateRange.to) {
    const dateRangeText = document.createElement("p");
    dateRangeText.textContent = `${format(dateRange.from, "MMMM d, yyyy")} - ${format(dateRange.to, "MMMM d, yyyy")}`;
    dateRangeText.style.fontSize = "12px";
    dateRangeText.style.margin = "5px 0 0 0";
    titleSection.appendChild(dateRangeText);
  }
  
  titleSection.appendChild(title);
  titleSection.appendChild(subtitle);
  
  // Logo
  const logoContainer = document.createElement("div");
  const logo = document.createElement("img");
  logo.src = "/lovable-uploads/c62adcd0-64ab-41d2-80d2-cb543b464602.png";
  logo.style.height = "40px";
  logo.style.width = "auto";
  logoContainer.appendChild(logo);
  
  header.appendChild(titleSection);
  header.appendChild(logoContainer);
  
  return header;
};

// Create stats section with cards
const createStatsSection = (stats: SessionStats): HTMLElement => {
  const { totalSessions, totalBreaths, totalTime, avgSessionDuration } = stats;
  
  const statsSection = document.createElement("div");
  statsSection.style.marginBottom = "30px";
  
  const statsTitle = document.createElement("h2");
  statsTitle.textContent = "Summary Statistics";
  statsTitle.style.fontSize = "18px";
  statsTitle.style.margin = "0 0 15px 0";
  statsSection.appendChild(statsTitle);
  
  const statsGrid = document.createElement("div");
  statsGrid.style.display = "grid";
  statsGrid.style.gridTemplateColumns = "repeat(2, 1fr)";
  statsGrid.style.gap = "15px";
  
  // Create stat cards
  statsGrid.appendChild(createStatCard("Total Sessions", totalSessions.toString()));
  statsGrid.appendChild(createStatCard("Total Breaths", totalBreaths.toString()));
  statsGrid.appendChild(createStatCard("Total Time", formatTimeDisplay(totalTime)));
  statsGrid.appendChild(createStatCard("Avg Duration", formatTimeDisplay(avgSessionDuration)));
  
  statsSection.appendChild(statsGrid);
  return statsSection;
};

// Helper to create a stat card
const createStatCard = (title: string, value: string): HTMLElement => {
  const card = document.createElement("div");
  card.style.backgroundColor = "#F1F8FA";
  card.style.borderRadius = "8px";
  card.style.padding = "15px";
  card.style.textAlign = "center";
  
  const cardTitle = document.createElement("div");
  cardTitle.textContent = title;
  cardTitle.style.fontSize = "14px";
  cardTitle.style.color = "#457B9D";
  cardTitle.style.marginBottom = "5px";
  
  const cardValue = document.createElement("div");
  cardValue.textContent = value;
  cardValue.style.fontSize = "22px";
  cardValue.style.fontWeight = "bold";
  cardValue.style.color = "#1D3557";
  
  card.appendChild(cardTitle);
  card.appendChild(cardValue);
  
  return card;
};

// Create sessions table
const createSessionsTable = (sessions: BreathSession[]): HTMLElement => {
  const tableSection = document.createElement("div");
  
  const tableTitle = document.createElement("h2");
  tableTitle.textContent = "Session Details";
  tableTitle.style.fontSize = "18px";
  tableTitle.style.margin = "0 0 15px 0";
  tableSection.appendChild(tableTitle);
  
  if (sessions.length === 0) {
    const noData = document.createElement("p");
    noData.textContent = "No sessions available for the selected period.";
    noData.style.fontStyle = "italic";
    noData.style.color = "#457B9D";
    tableSection.appendChild(noData);
    return tableSection;
  }
  
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  
  // Table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.style.backgroundColor = "#F1F8FA";
  
  const headers = ["Date / Time", "Inhale", "Hold", "Exhale", "Total Time"];
  headers.forEach(headerText => {
    const th = document.createElement("th");
    th.textContent = headerText;
    th.style.padding = "10px";
    th.style.textAlign = "left";
    th.style.fontSize = "14px";
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Table body
  const tbody = document.createElement("tbody");
  
  // Default values for inhale/exhale since they're not stored
  const inhaleDuration = 4; // Default value
  const exhaleDuration = 4; // Default value
  
  sessions.forEach((session, index) => {
    const row = document.createElement("tr");
    row.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#F8FAFC";
    
    // Date / Time cell
    const dateCell = document.createElement("td");
    dateCell.textContent = format(new Date(session.date), "MMMM d, yyyy h:mm a");
    dateCell.style.padding = "10px";
    
    // Inhale cell
    const inhaleCell = document.createElement("td");
    inhaleCell.textContent = `${inhaleDuration} sec`;
    inhaleCell.style.padding = "10px";
    inhaleCell.style.textAlign = "center";
    
    // Hold cell
    const holdCell = document.createElement("td");
    holdCell.textContent = `${session.holdDuration} sec`;
    holdCell.style.padding = "10px";
    holdCell.style.textAlign = "center";
    
    // Exhale cell
    const exhaleCell = document.createElement("td");
    exhaleCell.textContent = `${exhaleDuration} sec`;
    exhaleCell.style.padding = "10px";
    exhaleCell.style.textAlign = "center";
    
    // Total time cell
    const totalTimeCell = document.createElement("td");
    totalTimeCell.textContent = formatTimeDisplay(session.totalDuration);
    totalTimeCell.style.padding = "10px";
    totalTimeCell.style.textAlign = "center";
    
    row.appendChild(dateCell);
    row.appendChild(inhaleCell);
    row.appendChild(holdCell);
    row.appendChild(exhaleCell);
    row.appendChild(totalTimeCell);
    
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  tableSection.appendChild(table);
  
  return tableSection;
};

// Create footer with inspirational quote
const createFooter = (): HTMLElement => {
  const footer = document.createElement("div");
  footer.style.marginTop = "30px";
  footer.style.borderTop = "1px solid #E1E5EB";
  footer.style.paddingTop = "15px";
  footer.style.textAlign = "center";
  
  const quote = document.createElement("p");
  quote.textContent = "Every breath is a step toward your best self.";
  quote.style.fontSize = "14px";
  quote.style.fontStyle = "italic";
  quote.style.color = "#1D3557";
  
  footer.appendChild(quote);
  
  return footer;
};
