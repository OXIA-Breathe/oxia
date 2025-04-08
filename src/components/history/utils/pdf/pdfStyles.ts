
// PDF styling constants and utility functions

// Define color palette as exact RGB tuples for jsPDF compatibility
export const PDFStyling = {
  colors: {
    background: [217, 235, 252] as [number, number, number], // Soft sky blue from mockup
    primary: [29, 53, 87] as [number, number, number],      // Deep blue (#1D3557)
    secondary: [69, 123, 157] as [number, number, number],  // Medium blue (#457B9D)
    accent: [168, 218, 220] as [number, number, number],    // Soft teal (#A8DADC)
    lightAccent: [230, 243, 252] as [number, number, number], // Very light blue accent
    white: [255, 255, 255] as [number, number, number],
    offWhite: [248, 250, 252] as [number, number, number],
    tableHeader: [240, 246, 252] as [number, number, number], // Light blue for table headers
    tableBorder: [200, 220, 240] as [number, number, number], // Soft blue for borders
    tableStripe: [248, 251, 255] as [number, number, number], // Very light blue for alternating rows
  },
  
  // Font styles
  fonts: {
    header: {
      family: "helvetica",
      size: 36,
      style: "bold"
    },
    subheader: {
      family: "helvetica",
      size: 24,
      style: "bold"
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

// Helper to apply alpha to RGB colors - returns array with correct structure
export const withAlpha = (color: [number, number, number], alpha: number = 1): number[] => {
  return [...color, alpha * 255];
};

// Helper for setting RGB colors in jsPDF with proper unpacking
export const setFillColor = (doc: any, color: [number, number, number], alpha: number = 1) => {
  if (alpha < 1) {
    doc.setFillColor(color[0], color[1], color[2], alpha);
  } else {
    doc.setFillColor(color[0], color[1], color[2]);
  }
};

export const setDrawColor = (doc: any, color: [number, number, number], alpha: number = 1) => {
  if (alpha < 1) {
    doc.setDrawColor(color[0], color[1], color[2], alpha);
  } else {
    doc.setDrawColor(color[0], color[1], color[2]);
  }
};

export const setTextColor = (doc: any, color: [number, number, number], alpha: number = 1) => {
  if (alpha < 1) {
    doc.setTextColor(color[0], color[1], color[2], alpha);
  } else {
    doc.setTextColor(color[0], color[1], color[2]);
  }
};
