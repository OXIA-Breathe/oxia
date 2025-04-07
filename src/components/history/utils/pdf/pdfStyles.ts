
// PDF styling constants and utility functions

// Define color palette as RGB tuples for jsPDF compatibility
export const PDFStyling = {
  colors: {
    background: [228, 241, 254] as [number, number, number], // Very light blue
    primary: [29, 53, 87] as [number, number, number],      // Deep blue (#1D3557)
    secondary: [69, 123, 157] as [number, number, number],  // Medium blue (#457B9D)
    accent: [168, 218, 220] as [number, number, number],    // Soft teal (#A8DADC)
    lightAccent: [230, 243, 252] as [number, number, number], // Very light blue accent
    white: [255, 255, 255] as [number, number, number],
    offWhite: [248, 250, 252] as [number, number, number],
  },
  
  // Font styles
  fonts: {
    header: {
      family: "helvetica",
      size: 24,
      style: "bold"
    },
    subheader: {
      family: "helvetica",
      size: 16,
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
    borderRadius: 5
  }
};

// Helper to apply alpha to RGB colors - returns properly structured array
export const withAlpha = (color: [number, number, number], alpha: number = 1): [number, number, number, number] => {
  return [...color, alpha];
};
