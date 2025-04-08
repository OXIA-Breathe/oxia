
// PDF styling constants and utility functions

// Define color palette as exact RGB values for jsPDF compatibility
export const PDFStyling = {
  colors: {
    background: [248, 251, 255] as const, // Light background
    primary: [29, 53, 87] as const,       // Deep blue (#1D3557)
    secondary: [69, 123, 157] as const,   // Medium blue (#457B9D)
    accent: [168, 218, 220] as const,     // Soft teal (#A8DADC)
    lightAccent: [230, 243, 252] as const, // Very light blue accent
    white: [255, 255, 255] as const,
    offWhite: [248, 250, 252] as const,
    tableHeader: [240, 246, 252] as const, // Light blue for table headers
    tableBorder: [200, 220, 240] as const, // Soft blue for borders
    tableStripe: [248, 251, 255] as const, // Very light blue for alternating rows
  },
  
  // Font styles
  fonts: {
    header: {
      family: "helvetica",
      size: 32,
      style: "bold"
    },
    subheader: {
      family: "helvetica",
      size: 22,
      style: "normal"
    },
    body: {
      family: "helvetica",
      size: 12,
      style: "normal"
    },
    small: {
      family: "helvetica",
      size: 10,
      style: "normal"
    }
  },
  
  // Spacing and layout
  spacing: {
    margin: 20,
    padding: 10,
    borderRadius: 8
  },

  // Card styles for stat blocks
  cards: {
    shadow: 2,
    borderRadius: 10,
    padding: 15
  }
};

// Helper to apply alpha to RGB colors
export const withAlpha = (color: readonly [number, number, number], alpha: number = 1): string => {
  // Returns the color in the format required by jsPDF
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
};

// Helper for setting RGB colors in jsPDF
export const setFillColor = (doc: any, color: readonly [number, number, number], alpha: number = 1) => {
  doc.setFillColor(color[0], color[1], color[2]);
};

export const setDrawColor = (doc: any, color: readonly [number, number, number], alpha: number = 1) => {
  doc.setDrawColor(color[0], color[1], color[2]);
};

export const setTextColor = (doc: any, color: readonly [number, number, number], alpha: number = 1) => {
  doc.setTextColor(color[0], color[1], color[2]);
};

// Helper for drawing rounded rectangle with shadow
export const drawRoundedRect = (doc: any, x: number, y: number, width: number, height: number, radius: number, fill: boolean = true) => {
  // Draw shadow first
  setFillColor(doc, [200, 200, 200]);
  doc.roundedRect(x + 2, y + 2, width, height, radius, radius, "F");
  
  // Draw main rectangle
  setFillColor(doc, PDFStyling.colors.white);
  doc.roundedRect(x, y, width, height, radius, radius, fill ? "F" : "S");
};
