
import { BreathSession } from "@/types/breath";

export interface GeneratePDFParams {
  sessions: BreathSession[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  exportType: "full" | "custom";
}

export interface PDFOutput {
  blob: Blob;
  fileName: string;
}

export interface SessionStats {
  totalSessions: number;
  totalBreaths: number;
  totalTime: number;
  avgSessionDuration: number;
}
