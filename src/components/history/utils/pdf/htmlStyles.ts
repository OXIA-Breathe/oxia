
// Create the CSS styles for the PDF
export const createPdfStyles = (): HTMLStyleElement => {
  const style = document.createElement("style");
  style.textContent = `
    body {
      font-family: 'Nunito', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(to bottom, #77A9E8, #e0edf5);
      color: #1D3557;
    }
    .report-container {
      max-width: 800px;
      margin: 40px auto;
      background: white;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .logo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .logo img {
      height: 40px;
    }
    .title {
      font-size: 28px;
      font-weight: 700;
    }
    .subtitle {
      font-style: italic;
      font-size: 16px;
      margin-bottom: 30px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }
    .summary-box {
      background: #e0edf5;
      border-radius: 16px;
      padding: 20px;
      text-align: center;
    }
    .summary-box h3 {
      margin: 0;
      font-size: 16px;
    }
    .summary-box p {
      margin: 5px 0 0;
      font-size: 20px;
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th, td {
      padding: 12px;
      border-bottom: 1px solid #ccc;
      text-align: center;
    }
    th {
      font-weight: bold;
      background-color: #f8f8f8;
    }
    .footer-quote {
      font-style: italic;
      font-size: 16px;
      text-align: center;
      margin-top: 40px;
    }
  `;
  return style;
};
