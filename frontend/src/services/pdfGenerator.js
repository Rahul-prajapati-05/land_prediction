import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates an executive Real Estate Valuation Report PDF
 * @param {Object} predictionData Result returned from /api/predict
 */
export function generateValuationPDF(predictionData) {
  if (!predictionData) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [15, 30, 60];    // Navy Blue #0f1e3c
  const accentColor = [5, 150, 105];    // Emerald Green #059669
  const secondaryColor = [71, 85, 105]; // Slate Gray

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 36, 'F');

  // Accent Line
  doc.setFillColor(...accentColor);
  doc.rect(0, 36, 210, 3, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('HomePrice AI', 16, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('AUTOMATED MACHINE LEARNING REAL ESTATE VALUATION REPORT', 16, 26);

  // Report Metadata (right-aligned)
  doc.setFontSize(8);
  doc.text(`Report ID: HP-${predictionData.prediction_id || Math.floor(100000 + Math.random() * 900000)}`, 194, 15, { align: 'right' });
  doc.text(`Date & Time: ${predictionData.timestamp || new Date().toLocaleString()}`, 194, 21, { align: 'right' });
  doc.text(`Model: Scikit-learn Linear Regression`, 194, 27, { align: 'right' });

  // Main Valuation Highlight Box
  let y = 48;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(16, y, 178, 42, 3, 3, 'FD');

  doc.setTextColor(...secondaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ESTIMATED MARKET VALUATION', 24, y + 10);

  doc.setTextColor(...accentColor);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  const priceText = predictionData.formatted_price?.combined || `INR ${predictionData.predicted_price}`;
  doc.text(priceText, 24, y + 22);

  // Confidence Interval and Rate
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const lowerRange = predictionData.price_range?.formatted_lower?.compact || 'N/A';
  const upperRange = predictionData.price_range?.formatted_upper?.compact || 'N/A';
  doc.text(`Estimated Range (90% Conf.): ${lowerRange} - ${upperRange}`, 24, y + 33);

  const rateText = predictionData.formatted_price_per_sqft || 'N/A';
  doc.text(`Unit Rate: ${rateText}`, 120, y + 33);

  // Section: Property Specifications Table
  y = 100;
  doc.setTextColor(...primaryColor);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Property Specifications & Attributes', 16, y);

  const inputs = predictionData.inputs || {};
  const tableData = [
    ['Location / Metro City', inputs.City || 'N/A', 'Property Type', inputs.Property_Type || 'N/A'],
    ['Super Built-up Area', `${inputs.Area_sqft} sq.ft`, 'Property Age', `${inputs.Property_Age} years`],
    ['Bedrooms (BHK)', `${inputs.BHK} BHK`, 'Dedicated Parking', inputs.Parking || 'N/A'],
    ['Bathrooms', `${inputs.Bathrooms}`, 'Furnishing Status', inputs.Furnishing || 'N/A'],
    ['Number of Floors', `${inputs.Floors}`, 'Benchmark Comparison', predictionData.city_benchmark?.diff_percent ? `${predictionData.city_benchmark.diff_percent > 0 ? '+' : ''}${predictionData.city_benchmark.diff_percent}% vs City Avg` : 'Within City Range']
  ];

  autoTable(doc, {
    startY: y + 4,
    head: [['Attribute', 'Specification', 'Attribute', 'Specification']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 9,
      cellPadding: 3.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [248, 250, 252], width: 45 },
      1: { width: 44 },
      2: { fontStyle: 'bold', fillColor: [248, 250, 252], width: 45 },
      3: { width: 44 },
    },
    margin: { left: 16, right: 16 }
  });

  // Machine Learning Model Performance Section
  y = doc.lastAutoTable.finalY + 12;
  doc.setTextColor(...primaryColor);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Machine Learning Model Validation', 16, y);

  const mlMetrics = [
    ['Model Algorithm', 'Linear Regression (Ordinary Least Squares - OLS) with One-Hot Preprocessing'],
    ['Dataset Representation', '5,000 Verified Metro Property Listings across 8 Indian Megacities'],
    ['Model Accuracy (R² Score)', '87.61% variance explained on unseen testing sample (1,000 listings)'],
    ['Root Mean Squared Error (RMSE)', 'Calculated across out-of-sample data points for bounds estimation'],
    ['Pipeline Framework', 'Scikit-learn StandardScaler + OneHotEncoder ColumnTransformer']
  ];

  autoTable(doc, {
    startY: y + 4,
    body: mlMetrics,
    theme: 'striped',
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { fontStyle: 'bold', width: 60, textColor: primaryColor },
      1: { width: 118 }
    },
    margin: { left: 16, right: 16 }
  });

  // Verification Seal / Certificate Stamp
  y = doc.lastAutoTable.finalY + 10;
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.6);
  doc.roundedRect(16, y, 178, 28, 2, 2, 'D');

  doc.setTextColor(...accentColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFIED MACHINE LEARNING VALUATION', 24, y + 8);

  doc.setTextColor(...secondaryColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'This appraisal is synthesized computationally by HomePrice AI using a trained Ordinary Least Squares regression pipeline. ' +
    'Valuation reflects statistical market dynamics based on comparable multi-city listing parameters and econometrics.',
    24, y + 15, { maxWidth: 162 }
  );

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('HomePrice AI Platform • Generated dynamically for client portfolio & real estate assessment', 105, 287, { align: 'center' });

  // Save the PDF
  const city = inputs.City || 'Property';
  const fileName = `HomePrice_AI_Valuation_${city}_${Date.now()}.pdf`;
  doc.save(fileName);
}
