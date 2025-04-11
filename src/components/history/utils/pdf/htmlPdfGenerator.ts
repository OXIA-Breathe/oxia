
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
  // Create container element
  const container = document.createElement("div");
  
  // Add styles
  const style = document.createElement("style");
  style.textContent = `
    body {
      font-family: 'Nunito', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(to bottom, #A8DADC, #F7F9FA);
      color: #1D3557;
    }
    .report-container {
      max-width: 800px;
      margin: 40px auto;
      background: white;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .logo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .logo img {
      height: 40px;
    }
    .title {
      font-size: 28px;
      font-weight: 700;
    }
    .subtitle {
      font-style: italic;
      font-size: 16px;
      margin-bottom: 30px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }
    .summary-box {
      background: #E0F4F2;
      border-radius: 16px;
      padding: 20px;
      text-align: center;
    }
    .summary-box h3 {
      margin: 0;
      font-size: 16px;
    }
    .summary-box p {
      margin: 5px 0 0;
      font-size: 20px;
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th, td {
      padding: 12px;
      border-bottom: 1px solid #ccc;
      text-align: center;
    }
    th {
      font-weight: bold;
      background-color: #f8f8f8;
    }
    .footer-quote {
      font-style: italic;
      font-size: 16px;
      text-align: center;
      margin-top: 40px;
    }
  `;
  
  container.appendChild(style);
  
  // Create report container
  const reportContainer = document.createElement("div");
  reportContainer.className = "report-container";
  
  // Add header with logo
  const logoDiv = document.createElement("div");
  logoDiv.className = "logo";
  
  const title = document.createElement("div");
  title.className = "title";
  title.textContent = "Breathing Session Report";
  
  const logoImg = document.createElement("img");
  logoImg.src = "/lovable-uploads/c62adcd0-64ab-41d2-80d2-cb543b464602.png";
  logoImg.alt = "OXIA Logo";
  
  logoDiv.appendChild(title);
  logoDiv.appendChild(logoImg);
  
  // Add subtitle
  const subtitle = document.createElement("div");
  subtitle.className = "subtitle";
  subtitle.textContent = "Every breath counts.";
  
  // Date range (if applicable)
  if (dateRange.from && dateRange.to) {
    const dateRangeText = document.createElement("div");
    dateRangeText.style.fontSize = "14px";
    dateRangeText.style.marginBottom = "20px";
    dateRangeText.textContent = `${format(dateRange.from, "MMMM d, yyyy")} - ${format(dateRange.to, "MMMM d, yyyy")}`;
    reportContainer.appendChild(dateRangeText);
  }
  
  // Add summary section
  const summary = document.createElement("div");
  summary.className = "summary";
  
  // Add summary boxes
  const totalSessionsBox = createSummaryBox("Total Sessions", stats.totalSessions.toString());
  const totalBreathsBox = createSummaryBox("Total Breaths", stats.totalBreaths.toString());
  const totalTimeBox = createSummaryBox("Total Time", formatTimeDisplay(stats.totalTime));
  const avgDurationBox = createSummaryBox("Avg Duration", formatTimeDisplay(stats.avgSessionDuration));
  
  summary.appendChild(totalSessionsBox);
  summary.appendChild(totalBreathsBox);
  summary.appendChild(totalTimeBox);
  summary.appendChild(avgDurationBox);
  
  // Add sessions table
  const table = document.createElement("table");
  
  // Add table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  
  const headers = ["Date / Time", "Inhale", "Hold", "Exhale", "Total Time"];
  headers.forEach(headerText => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Add table body
  const tbody = document.createElement("tbody");
  
  // Default values for inhale/exhale since they're not stored
  const inhaleDuration = 4; // Default value
  const exhaleDuration = 4; // Default value
  
  if (sessions.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 5;
    emptyCell.textContent = "No sessions available for the selected period.";
    emptyCell.style.textAlign = "center";
    emptyCell.style.padding = "30px";
    emptyRow.appendChild(emptyCell);
    tbody.appendChild(emptyRow);
  } else {
    sessions.forEach((session) => {
      const row = document.createElement("tr");
      
      // Date/Time cell
      const dateCell = document.createElement("td");
      dateCell.textContent = format(new Date(session.date), "MMMM d, yyyy h:mm a");
      
      // Inhale cell
      const inhaleCell = document.createElement("td");
      inhaleCell.textContent = `${inhaleDuration} sec`;
      
      // Hold cell
      const holdCell = document.createElement("td");
      holdCell.textContent = `${session.holdDuration} sec`;
      
      // Exhale cell
      const exhaleCell = document.createElement("td");
      exhaleCell.textContent = `${exhaleDuration} sec`;
      
      // Total time cell
      const totalTimeCell = document.createElement("td");
      totalTimeCell.textContent = formatTimeDisplay(session.totalDuration);
      
      row.appendChild(dateCell);
      row.appendChild(inhaleCell);
      row.appendChild(holdCell);
      row.appendChild(exhaleCell);
      row.appendChild(totalTimeCell);
      
      tbody.appendChild(row);
    });
  }
  
  table.appendChild(tbody);
  
  // Add footer quote
  const footerQuote = document.createElement("div");
  footerQuote.className = "footer-quote";
  footerQuote.textContent = "Every breath is a step toward your best self.";
  
  // Assemble all parts
  reportContainer.appendChild(logoDiv);
  reportContainer.appendChild(subtitle);
  reportContainer.appendChild(summary);
  reportContainer.appendChild(table);
  reportContainer.appendChild(footerQuote);
  
  container.appendChild(reportContainer);
  
  return container;
};

// Helper function to create summary box
const createSummaryBox = (title: string, value: string): HTMLElement => {
  const box = document.createElement("div");
  box.className = "summary-box";
  
  const heading = document.createElement("h3");
  heading.textContent = title;
  
  const paragraph = document.createElement("p");
  paragraph.textContent = value;
  
  box.appendChild(heading);
  box.appendChild(paragraph);
  
  return box;
};
