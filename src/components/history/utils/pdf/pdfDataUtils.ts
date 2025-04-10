
import { BreathSession } from "@/types/breath";
import { format } from "date-fns";
import { formatTime } from "../formatTime";
import { SessionStats } from "./types";

// Filter sessions based on date range if needed
export const filterSessionsByDateRange = (
  sessions: BreathSession[], 
  dateRange: { from: Date | undefined; to: Date | undefined }, 
  exportType: "full" | "custom"
): BreathSession[] => {
  if (exportType === "custom" && dateRange.from && dateRange.to) {
    const fromDate = dateRange.from.setHours(0, 0, 0, 0);
    const toDate = dateRange.to.setHours(23, 59, 59, 999);
    
    return sessions.filter((session) => {
      const sessionDate = new Date(session.date).getTime();
      return sessionDate >= fromDate && sessionDate <= toDate;
    });
  }
  return sessions;
};

// Calculate summary statistics
export const calculateSessionStats = (sessions: BreathSession[]): SessionStats => {
  const totalSessions = sessions.length;
  const totalBreaths = sessions.reduce((acc, s) => acc + s.breathCount, 0);
  const totalTime = sessions.reduce((acc, s) => acc + s.totalDuration, 0);
  const avgSessionDuration = totalSessions ? Math.floor(totalTime / totalSessions) : 0;
  
  return { totalSessions, totalBreaths, totalTime, avgSessionDuration };
};

// Prepare table data for the sessions - updated to match HTML layout
export const prepareSessionTableData = (sessions: BreathSession[]) => {
  // Default values for inhale/exhale since they're not stored but needed for the report
  const inhaleDuration = 4; // Default value
  const exhaleDuration = 4; // Default value
  
  const tableData = sessions.map((session) => {
    const date = new Date(session.date);
    
    return [
      format(date, "MMMM d, yyyy h:mm a"), // Combined date/time column
      `${inhaleDuration} sec`,              // Inhale column
      `${session.holdDuration} sec`,        // Hold column
      `${exhaleDuration} sec`,              // Exhale column
      formatTimeDisplay(session.totalDuration),  // Total time column
    ];
  });
  
  return { tableData };
};

// Format time in a more readable way for display
export const formatTimeDisplay = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  
  if (minutes === 0) {
    return `${seconds} sec`;
  } else if (seconds === 0) {
    return `${minutes} min`;
  }
  
  return `${minutes} min ${seconds} sec`;
};
