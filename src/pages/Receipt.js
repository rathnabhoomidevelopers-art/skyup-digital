import { useState, useRef, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ReceiptTemplate from './ReceiptTemplate';
import { generatePDF } from './utils/pdfGenerator';


export function Receipt (){
  const [showPreview, setShowPreview] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [nextInvoiceSerial, setNextInvoiceSerial] = useState(1);
  const receiptRef = useRef();

  // Company details (static)
  const companyDetails = {
    name: 'Skyup Digital Solutions LLP',
    address: 'Parinidhi #23, E Block,\n14A Main Road, 2nd Floor,\nSahakaranagar,\nBangalore - 560092',
    gstNo: '29AFUFS6710E1ZJ',
    bankDetails: {
      bankName: 'Kotak Mahindra Bank',
      accountName: 'SKYUP DIGITAL SOLUTIONS LLP',
      accountNo: '1019032325',
      ifscCode: 'KKBK0008045',
      branch: 'Sahakara Nagar'
    }
  };

  // Fetch the last invoice number on component mount
  useEffect(() => {
    fetchLastInvoiceNumber();
  }, []);

  const fetchLastInvoiceNumber = async () => {
    try {
      const response = await fetch('/api/last-invoice');
      const data = await response.json();
      if (data.lastSerial) {
        setNextInvoiceSerial(data.lastSerial + 1);
      }
    } catch (error) {
      console.error('Error fetching last invoice number:', error);
      // If API fails, try to get from localStorage as fallback
      const lastSerial = localStorage.getItem('lastInvoiceSerial');
      if (lastSerial) {
        setNextInvoiceSerial(parseInt(lastSerial) + 1);
      }
    }
  };

  // Get current financial year (April to March)
  const getCurrentFinancialYear = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 0-indexed
    
    if (currentMonth >= 4) {
      // April onwards - current year to next year
      return `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
    } else {
      // January to March - previous year to current year
      return `${currentYear - 1}-${currentYear.toString().slice(-2)}`;
    }
  };

  // Generate invoice number in format SDS/001/2025-26
  const generateInvoiceNumber = (serialNumber) => {
    const financialYear = getCurrentFinancialYear();
    const paddedSerial = serialNumber.toString().padStart(3, '0');
    return `SDS/${paddedSerial}/${financialYear}`;
  };

  // Validation schema
  const validationSchema = Yup.object({
    to: Yup.string().required('Client name/address is required'),
    date: Yup.date().required('Invoice date is required'),
    invoice_due: Yup.date().nullable(),
    hsn_no: Yup.string(),
    description: Yup.string().required('Description is required'),
    qty: Yup.number().positive('Quantity must be positive').required('Quantity is required'),
    rate: Yup.number().positive('Rate must be positive').required('Rate is required'),
    cgst: Yup.number().min(0, 'CGST cannot be negative').required('CGST is required'),
    sgst: Yup.number().min(0, 'SGST cannot be negative').required('SGST is required'),
    cgst_percentage: Yup.number().min(0).max(100),
    sgst_percentage: Yup.number().min(0).max(100),
  });

  // Calculate amount and total
  const calculateValues = (qty, rate, cgst, sgst) => {
    const amount = qty * rate;
    const total = amount + cgst + sgst;
    return { amount, total };
  };

  // Auto-calculate GST based on percentage
  const autoCalculateGST = (amount, percentage) => {
    return Math.round(amount * (percentage / 100));
  };

  // Convert number to words (Indian number system)
  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero rupees only';

    const convertHundreds = (n) => {
      let str = '';
      if (n > 99) {
        str += ones[Math.floor(n / 100)] + ' hundred ';
        n %= 100;
      }
      if (n > 19) {
        str += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        str += teens[n - 10] + ' ';
        return str;
      }
      if (n > 0) {
        str += ones[n] + ' ';
      }
      return str;
    };

    let word = '';
    if (num >= 10000000) {
      word += convertHundreds(Math.floor(num / 10000000)) + 'crore ';
      num %= 10000000;
    }
    if (num >= 100000) {
      word += convertHundreds(Math.floor(num / 100000)) + 'lakh ';
      num %= 100000;
    }
    if (num >= 1000) {
      word += convertHundreds(Math.floor(num / 1000)) + 'thousand ';
      num %= 1000;
    }
    word += convertHundreds(num);
    
    return (word.trim().charAt(0).toUpperCase() + word.trim().slice(1) + ' rupees only').replace(/\s+/g, ' ');
  };

  // Handle form submission
const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  const cgst = Number(values.cgst);
  const sgst = Number(values.sgst);
  const { amount, total } = calculateValues(values.qty, values.rate, cgst, sgst);

  const invoiceNumber = generateInvoiceNumber(nextInvoiceSerial); // Auto-generated invoice number

  const formData = {
    to: values.to,
    invoice_no: invoiceNumber, // Pass the auto-generated invoice number
    date: values.date,
    invoice_due: values.invoice_due || null,
    hsn_no: values.hsn_no || '',
    description: values.description,
    qty: parseInt(values.qty),
    rate: parseInt(values.rate),
    amount: amount,
    cgst: cgst,
    sgst: sgst,
    cgst_percentage: values.cgst_percentage || 9,
    sgst_percentage: values.sgst_percentage || 9,
    total: total,
    amount_in_words: numberToWords(total),
  };

    try {
      // First, generate and download PDF
      const receiptFullData = {
        ...formData,
        cgstLabel: `CGST @ ${values.cgst_percentage || 9}%`,
        sgstLabel: `SGST @ ${values.sgst_percentage || 9}%`,
        ...companyDetails
      };
      
      setReceiptData(receiptFullData);
      setShowPreview(true);

      // Wait a bit for the preview to render
      setTimeout(async () => {
        await generatePDF(receiptRef.current, invoiceNumber);
        
        // Then submit to backend
        const response = await fetch('/receipt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            // Keep backward compatibility with existing API
            gst9: cgst,
            Gst9: sgst,
          }),
        });

        const result = await response.json();
        
        if (response.ok) {
          alert('Receipt created and downloaded successfully!');
          // Increment and save the serial number
          const newSerial = nextInvoiceSerial + 1;
          setNextInvoiceSerial(newSerial);
          localStorage.setItem('lastInvoiceSerial', nextInvoiceSerial.toString());
          resetForm();
          setShowPreview(false);
        } else {
          alert('Failed to save receipt: ' + result.message);
        }
        
        setSubmitting(false);
      }, 500);
      
    } catch (error) {
      alert('Error creating receipt: ' + error.message);
      setSubmitting(false);
    }
  };

  // Print receipt
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const receiptContent = receiptRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${receiptData?.invoice_no}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              @page { 
                size: A4;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          ${receiptContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Download PDF again
  const handleDownloadAgain = async () => {
    await generatePDF(receiptRef.current, receiptData.invoice_no);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 font-poppins">
      <div className="max-w-5xl mx-auto">
        {!showPreview ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Header */}
            <div className="mb-8 border-b pb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Receipt</h1>
              <p className="text-gray-600">Generate professional invoice for your client</p>
            </div>

            <Formik
              initialValues={{
                to: '',
                date: new Date().toISOString().split('T')[0],
                invoice_due: '',
                hsn_no: '',
                description: '',
                qty: '',
                rate: '',
                cgst: '',
                sgst: '',
                cgst_percentage: 9,
                sgst_percentage: 9,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isSubmitting, setFieldValue }) => {
                // Calculate amount
                const amount = values.qty && values.rate ? values.qty * values.rate : 0;
                
                // Auto-calculate CGST when amount or percentage changes
                const handleCGSTPercentageChange = (e) => {
                  const percentage = parseFloat(e.target.value) || 0;
                  setFieldValue('cgst_percentage', percentage);
                  if (amount > 0) {
                    const calculatedCGST = autoCalculateGST(amount, percentage);
                    setFieldValue('cgst', calculatedCGST);
                  }
                };

                // Auto-calculate SGST when amount or percentage changes
                const handleSGSTPercentageChange = (e) => {
                  const percentage = parseFloat(e.target.value) || 0;
                  setFieldValue('sgst_percentage', percentage);
                  if (amount > 0) {
                    const calculatedSGST = autoCalculateGST(amount, percentage);
                    setFieldValue('sgst', calculatedSGST);
                  }
                };

                // Auto-update GST when qty or rate changes
                const handleQtyRateChange = (fieldName, value) => {
                  setFieldValue(fieldName, value);
                  
                  // Calculate new amount
                  const newQty = fieldName === 'qty' ? value : values.qty;
                  const newRate = fieldName === 'rate' ? value : values.rate;
                  const newAmount = newQty && newRate ? newQty * newRate : 0;
                  
                  // Update CGST if percentage is set
                  if (newAmount > 0 && values.cgst_percentage) {
                    const calculatedCGST = autoCalculateGST(newAmount, values.cgst_percentage);
                    setFieldValue('cgst', calculatedCGST);
                  }
                  
                  // Update SGST if percentage is set
                  if (newAmount > 0 && values.sgst_percentage) {
                    const calculatedSGST = autoCalculateGST(newAmount, values.sgst_percentage);
                    setFieldValue('sgst', calculatedSGST);
                  }
                };

                const cgst = Number(values.cgst) || 0;
                const sgst = Number(values.sgst) || 0;
                const total = amount + cgst + sgst;

                return (
                  <Form className="space-y-6">
                    {/* Invoice Number Preview */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">Next Invoice Number</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {generateInvoiceNumber(nextInvoiceSerial)}
                      </p>
                    </div>

                    {/* Client Details */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Client Name & Address <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="textarea"
                        name="to"
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                        placeholder="Enter client name and complete address"
                      />
                      {errors.to && touched.to && (
                        <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <span>⚠</span> {errors.to}
                        </div>
                      )}
                    </div>

                    {/* Date Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Invoice Date <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="date"
                          name="date"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                        {errors.date && touched.date && (
                          <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <span>⚠</span> {errors.date}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Invoice Due Date <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        <Field
                          type="date"
                          name="invoice_due"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* HSN Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        HSN/SAC Number <span className="text-gray-400 text-xs">(Optional)</span>
                      </label>
                      <Field
                        type="text"
                        name="hsn_no"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Enter HSN/SAC code"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                        placeholder="Enter service or product description"
                      />
                      {errors.description && touched.description && (
                        <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <span>⚠</span> {errors.description}
                        </div>
                      )}
                    </div>

                    {/* Quantity and Rate */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="qty"
                          min="1"
                          value={values.qty}
                          onChange={(e) => handleQtyRateChange('qty', e.target.value)}
                          onBlur={() => {}}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="Enter quantity"
                        />
                        {errors.qty && touched.qty && (
                          <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <span>⚠</span> {errors.qty}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Rate (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="rate"
                          min="0"
                          step="0.01"
                          value={values.rate}
                          onChange={(e) => handleQtyRateChange('rate', e.target.value)}
                          onBlur={() => {}}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="Enter rate per unit"
                        />
                        {errors.rate && touched.rate && (
                          <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <span>⚠</span> {errors.rate}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CGST and SGST Fields */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">GST Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* CGST */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CGST Percentage
                          </label>
                          <input
                            type="number"
                            name="cgst_percentage"
                            min="0"
                            max="100"
                            step="0.01"
                            value={values.cgst_percentage}
                            onChange={handleCGSTPercentageChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="e.g., 9"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CGST Amount (₹) <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="number"
                            name="cgst"
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Auto-calculated or enter manually"
                          />
                          {errors.cgst && touched.cgst && (
                            <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                              <span>⚠</span> {errors.cgst}
                            </div>
                          )}
                        </div>

                        {/* SGST */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            SGST Percentage
                          </label>
                          <input
                            type="number"
                            name="sgst_percentage"
                            min="0"
                            max="100"
                            step="0.01"
                            value={values.sgst_percentage}
                            onChange={handleSGSTPercentageChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="e.g., 9"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            SGST Amount (₹) <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="number"
                            name="sgst"
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Auto-calculated or enter manually"
                          />
                          {errors.sgst && touched.sgst && (
                            <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                              <span>⚠</span> {errors.sgst}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Calculation Summary */}
                    {values.qty && values.rate && (
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Calculation Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Amount</span>
                            <span className="font-semibold text-gray-800">₹{amount.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">CGST @ {values.cgst_percentage}%</span>
                            <span className="font-semibold text-gray-800">₹{cgst.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">SGST @ {values.sgst_percentage}%</span>
                            <span className="font-semibold text-gray-800">₹{sgst.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="border-t pt-3 mt-3 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-800">Total Amount</span>
                            <span className="text-2xl font-bold text-blue-600">₹{total.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="text-sm text-gray-600 italic mt-2">
                            In words: {numberToWords(total)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Receipt...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Create & Download Receipt
                          </span>
                        )}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-wrap gap-4 print:hidden">
              <button
                onClick={handleDownloadAgain}
                className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Receipt
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 min-w-[200px] bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Create New Receipt
              </button>
            </div>

            {/* Receipt Preview */}
            <div ref={receiptRef}>
              <ReceiptTemplate data={receiptData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};