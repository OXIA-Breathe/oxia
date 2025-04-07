
// PDF styling constants and utility functions

// Define color palette as RGB arrays for jsPDF compatibility
export const PDFStyling = {
  colors: {
    background: [228, 241, 254], // Very light blue
    primary: [29, 53, 87],      // Deep blue (#1D3557)
    secondary: [69, 123, 157],  // Medium blue (#457B9D)
    accent: [168, 218, 220],    // Soft teal (#A8DADC)
    lightAccent: [230, 243, 252], // Very light blue accent
    white: [255, 255, 255],
    offWhite: [248, 250, 252],
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

// Helper functions for common styling tasks could be added here
