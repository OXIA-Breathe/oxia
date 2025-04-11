
import { format } from "date-fns";
import { BreathSession } from "@/types/breath";
import { formatTimeDisplay } from "./pdfDataUtils";

// Helper function to create summary box
export const createSummaryBox = (title: string, value: string): HTMLElement => {
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

// Create header section with logo and title
export const createHeader = (): { logoDiv: HTMLDivElement, subtitle: HTMLDivElement } => {
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
  
  return { logoDiv, subtitle };
};

// Create summary section
export const createSummarySection = (stats: {
  totalSessions: number;
  totalBreaths: number;
  totalTime: number;
  avgSessionDuration: number;
}): HTMLDivElement => {
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
  
  return summary;
};

// Create sessions table
export const createSessionsTable = (sessions: BreathSession[]): HTMLTableElement => {
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
  return table;
};

// Create footer with quote
export const createFooter = (): HTMLDivElement => {
  const footerQuote = document.createElement("div");
  footerQuote.className = "footer-quote";
  footerQuote.textContent = "Every breath is a step toward your best self.";
  return footerQuote;
};
