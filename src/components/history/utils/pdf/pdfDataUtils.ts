
import { BreathSession } from "@/types/breath";
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
