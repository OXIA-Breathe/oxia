
import { WellnessPDFData } from "./wellnessPdfTypes";
import { assembleWellnessHtml } from "./wellnessPdfAssembler";
import { html2pdfPromise, getDefaultPdfOptions } from "@/components/history/utils/pdf/html2pdfUtil";
import { format } from "date-fns";

export const generateWellnessPDF = async (data: WellnessPDFData): Promise<{ blob: Blob; fileName: string }> => {
  const htmlElement = assembleWellnessHtml(data);

  const options = getDefaultPdfOptions(`OXIA-Wellness-Report-${format(data.reportPeriod.from, "yyyy-MM")}.pdf`);

  const blob = await html2pdfPromise(htmlElement, options);

  return {
    blob,
    fileName: `OXIA-Wellness-Report-${format(data.reportPeriod.from, "yyyy-MM")}.pdf`,
  };
};
