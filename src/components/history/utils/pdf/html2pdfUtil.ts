
import html2pdf from "html2pdf.js";

// Helper function to wrap html2pdf in a Promise
export const html2pdfPromise = (element: HTMLElement, options: any): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    html2pdf()
      .set(options)
      .from(element)
      .outputPdf('blob')
      .then((blob: Blob) => {
        resolve(blob);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

// Get default PDF options
export const getDefaultPdfOptions = (filename: string = "OXIA-Breathing-Report.pdf") => {
  return {
    margin: 10,
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };
};
