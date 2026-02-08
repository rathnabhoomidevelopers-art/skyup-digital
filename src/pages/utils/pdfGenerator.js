import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (element, invoiceNumber) => {
  if (!element) {
    console.error('Element not found for PDF generation');
    return;
  }

  try {
    // Create canvas from HTML element with better quality
    const canvas = await html2canvas(element, {
      scale: 3,  // Higher scale for better quality
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
      x: 0, // Start from x = 0
      y: 0, // Start from y = 0
      width: element.offsetWidth,  // Ensure it matches the container width
      height: element.offsetHeight, // Ensure it matches the container height
    });

    // Get image data from canvas
    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF in A4 size
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true,
    });

    // A4 dimensions in mm
    const pdfWidth = 271;
    const pdfHeight = 316;
    
    // Add image to PDF - fit exactly to A4
    pdf.addImage(
      imgData, 
      'PNG', 
      0,  // x position
      0,  // y position
      pdfWidth,  // width - full A4 width
      pdfHeight  // height - full A4 height
    );

    // Generate filename
    const filename = `Invoice_${invoiceNumber.replace(/\//g, '_')}.pdf`;
    
    // Save PDF
    pdf.save(filename);
    
    console.log(`PDF generated successfully: ${filename}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};
