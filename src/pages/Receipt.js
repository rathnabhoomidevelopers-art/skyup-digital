import { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import ReceiptTemplate from "./ReceiptTemplate";
import { generatePDF } from "./utils/pdfGenerator";
import API_URL from "../config/api";
import { useAuth } from "../context/AuthContext";

export function Receipt() {
  const { token } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [nextInvoiceSerial, setNextInvoiceSerial] = useState(1);
  const receiptRef = useRef();

  // Company details (static)
  const companyDetails = {
    name: "Skyup Digital Solutions LLP",
    address:
      "Parinidhi #23, E Block,\n14A Main Road, 2nd Floor,\nSahakaranagar,\nBangalore - 560092",
    gstNo: "29AFUFS6710E1ZJ",
    bankDetails: {
      bankName: "Kotak Mahindra Bank",
      accountName: "SKYUP DIGITAL SOLUTIONS LLP",
      accountNo: "1019032325",
      ifscCode: "KKBK0008045",
      branch: "Sahakara Nagar",
    },
  };

  // Fetch the last invoice number on component mount
  useEffect(() => {
    if (token) {
      fetchLastInvoiceNumber();
    }
  }, [token]);

  const fetchLastInvoiceNumber = async () => {
    try {
      const response = await fetch(`${API_URL}/api/last-invoice`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Add this
        },
      });
      const data = await response.json();
      if (data.lastSerial) {
        setNextInvoiceSerial(data.lastSerial + 1);
      }
    } catch (error) {
      console.error("Error fetching last invoice number:", error);
      const lastSerial = localStorage.getItem("lastInvoiceSerial");
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
    const paddedSerial = serialNumber.toString().padStart(3, "0");
    return `SDS/${paddedSerial}/${financialYear}`;
  };

  // Validation schema
  const validationSchema = Yup.object({
    to: Yup.string().required("Client name/address is required"),
    client_gst: Yup.string(),
    date: Yup.date().required("Invoice date is required"),
    invoice_due: Yup.date().nullable(),
    hsn_no: Yup.string(),
    items: Yup.array()
      .of(
        Yup.object({
          description: Yup.string().required("Description is required"),
          qty: Yup.number()
            .positive("Quantity must be positive")
            .required("Quantity is required"),
          rate: Yup.number()
            .positive("Rate must be positive")
            .required("Rate is required"),
        }),
      )
      .min(1, "At least one item is required"),
    cgst_percentage: Yup.number().min(0).max(100),
    sgst_percentage: Yup.number().min(0).max(100),
    igst_percentage: Yup.number().min(0).max(100),
  });

  // Auto-calculate GST based on percentage
  const autoCalculateGST = (amount, percentage) => {
    return Math.round(amount * (percentage / 100));
  };

  // Convert number to words (Indian number system)
  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    if (num === 0) return "Zero rupees only";

    const convertHundreds = (n) => {
      let str = "";
      if (n > 99) {
        str += ones[Math.floor(n / 100)] + " hundred ";
        n %= 100;
      }
      if (n > 19) {
        str += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      } else if (n >= 10) {
        str += teens[n - 10] + " ";
        return str;
      }
      if (n > 0) {
        str += ones[n] + " ";
      }
      return str;
    };

    let word = "";
    if (num >= 10000000) {
      word += convertHundreds(Math.floor(num / 10000000)) + "crore ";
      num %= 10000000;
    }
    if (num >= 100000) {
      word += convertHundreds(Math.floor(num / 100000)) + "lakh ";
      num %= 100000;
    }
    if (num >= 1000) {
      word += convertHundreds(Math.floor(num / 1000)) + "thousand ";
      num %= 1000;
    }
    word += convertHundreds(num);

    return (
      word.trim().charAt(0).toUpperCase() +
      word.trim().slice(1) +
      " rupees only"
    ).replace(/\s+/g, " ");
  };

  // Calculate totals from items
  const calculateTotals = (
    items,
    cgstPercentage,
    sgstPercentage,
    igstPercentage,
  ) => {
    // Safety check: return zeros if items is undefined or not an array
    if (!items || !Array.isArray(items)) {
      return { subtotal: 0, cgst: 0, sgst: 0, igst: 0, total: 0 };
    }

    const subtotal = items.reduce((sum, item) => {
      const itemAmount = (item.qty || 0) * (item.rate || 0);
      return sum + itemAmount;
    }, 0);

    const cgst = cgstPercentage
      ? autoCalculateGST(subtotal, cgstPercentage)
      : 0;
    const sgst = sgstPercentage
      ? autoCalculateGST(subtotal, sgstPercentage)
      : 0;
    const igst = igstPercentage
      ? autoCalculateGST(subtotal, igstPercentage)
      : 0;

    const total = subtotal + cgst + sgst + igst;

    return { subtotal, cgst, sgst, igst, total };
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const { subtotal, cgst, sgst, igst, total } = calculateTotals(
      values.items,
      values.cgst_percentage,
      values.sgst_percentage,
      values.igst_percentage,
    );

    const invoiceNumber = generateInvoiceNumber(nextInvoiceSerial);

    const formData = {
      to: values.to,
      client_gst: values.client_gst || "URD",
      invoice_no: invoiceNumber,
      date: values.date,
      invoice_due: values.invoice_due || null,
      hsn_no: values.hsn_no || "",
      items: values.items.map((item) => ({
        description: item.description,
        qty: parseInt(item.qty),
        rate: parseInt(item.rate),
        amount: parseInt(item.qty) * parseInt(item.rate),
      })),
      subtotal: subtotal,
      cgst: cgst,
      sgst: sgst,
      igst: igst,
      cgst_percentage: values.cgst_percentage || 0,
      sgst_percentage: values.sgst_percentage || 0,
      igst_percentage: values.igst_percentage || 0,
      total: total,
      amount_in_words: numberToWords(total),
    };

    try {
      const receiptFullData = {
        ...formData,
        cgstLabel: cgst > 0 ? `CGST @ ${values.cgst_percentage || 9}%` : "",
        sgstLabel: sgst > 0 ? `SGST @ ${values.sgst_percentage || 9}%` : "",
        igstLabel: igst > 0 ? `IGST @ ${values.igst_percentage || 18}%` : "",
        ...companyDetails,
      };

      setReceiptData(receiptFullData);
      setShowPreview(true);

      setTimeout(async () => {
        await generatePDF(receiptRef.current, invoiceNumber);

        // ✅ Add Authorization header here
        const response = await fetch(`${API_URL}/receipt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Add this
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Receipt created and downloaded successfully!");
          const newSerial = nextInvoiceSerial + 1;
          setNextInvoiceSerial(newSerial);
          localStorage.setItem(
            "lastInvoiceSerial",
            nextInvoiceSerial.toString(),
          );
          resetForm();
          setShowPreview(false);
        } else {
          alert("Failed to save receipt: " + result.message);
        }

        setSubmitting(false);
      }, 500);
    } catch (error) {
      alert("Error creating receipt: " + error.message);
      setSubmitting(false);
    }
  };

  // Print receipt
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Create New Receipt
              </h1>
              <p className="text-gray-600">
                Generate professional invoice for your client
              </p>
            </div>

            <Formik
              initialValues={{
                to: "",
                client_gst: "",
                date: new Date().toISOString().split("T")[0],
                invoice_due: "",
                hsn_no: "",
                items: [
                  {
                    description: "",
                    qty: "",
                    rate: "",
                  },
                ],
                cgst_percentage: 9,
                sgst_percentage: 9,
                igst_percentage: 18,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isSubmitting, setFieldValue }) => {
                // Safely calculate totals with fallback to empty array
                const { subtotal, cgst, sgst, igst, total } = calculateTotals(
                  values.items || [],
                  values.cgst_percentage,
                  values.sgst_percentage,
                  values.igst_percentage,
                );

                return (
                  <Form className="space-y-6">
                    {/* Invoice Number Preview */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        Next Invoice Number
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {generateInvoiceNumber(nextInvoiceSerial)}
                      </p>
                    </div>

                    {/* Client Details */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Client Name & Address{" "}
                        <span className="text-red-500">*</span>
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

                    {/* Client GST Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Client GST Number{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional - Defaults to URD)
                        </span>
                      </label>
                      <Field
                        type="text"
                        name="client_gst"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Enter client GST number or leave blank for URD"
                      />
                      {errors.client_gst && touched.client_gst && (
                        <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <span>⚠</span> {errors.client_gst}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Enter any GST format or leave blank for "URD"
                        (Unregistered Dealer)
                      </p>
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
                          Invoice Due Date{" "}
                          <span className="text-gray-400 text-xs">
                            (Optional)
                          </span>
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
                        HSN/SAC Number{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional - Applies to all items)
                        </span>
                      </label>
                      <Field
                        type="text"
                        name="hsn_no"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Enter HSN/SAC code"
                      />
                    </div>

                    {/* Items Section */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Line Items
                        </h3>
                      </div>

                      <FieldArray name="items">
                        {({ push, remove }) => (
                          <div className="space-y-6">
                            {values.items.map((item, index) => (
                              <div
                                key={index}
                                className="bg-white border border-gray-300 rounded-lg p-6 relative"
                              >
                                {/* Remove button */}
                                {values.items.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-full transition"
                                    title="Remove item"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                )}

                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                      Item {index + 1}
                                    </span>
                                  </div>

                                  {/* Description */}
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                      Description{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                      as="textarea"
                                      name={`items.${index}.description`}
                                      rows="3"
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                                      placeholder="Enter service or product description"
                                    />
                                    {errors.items?.[index]?.description &&
                                      touched.items?.[index]?.description && (
                                        <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                          <span>⚠</span>{" "}
                                          {errors.items[index].description}
                                        </div>
                                      )}
                                  </div>

                                  {/* Quantity and Rate */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Quantity{" "}
                                        <span className="text-red-500">*</span>
                                      </label>
                                      <Field
                                        type="number"
                                        name={`items.${index}.qty`}
                                        min="1"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder="Qty"
                                      />
                                      {errors.items?.[index]?.qty &&
                                        touched.items?.[index]?.qty && (
                                          <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠</span>{" "}
                                            {errors.items[index].qty}
                                          </div>
                                        )}
                                    </div>

                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Rate (₹){" "}
                                        <span className="text-red-500">*</span>
                                      </label>
                                      <Field
                                        type="number"
                                        name={`items.${index}.rate`}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder="Rate"
                                      />
                                      {errors.items?.[index]?.rate &&
                                        touched.items?.[index]?.rate && (
                                          <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠</span>{" "}
                                            {errors.items[index].rate}
                                          </div>
                                        )}
                                    </div>

                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Amount (₹)
                                      </label>
                                      <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 font-semibold">
                                        ₹
                                        {(
                                          (item.qty || 0) * (item.rate || 0)
                                        ).toLocaleString("en-IN")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Add Item Button */}
                            <button
                              type="button"
                              onClick={() =>
                                push({ description: "", qty: "", rate: "" })
                              }
                              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-3 px-6 rounded-lg transition duration-200 border-2 border-dashed border-blue-300 flex items-center justify-center gap-2"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                              Add Another Item
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>

                    {/* GST Details */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        GST Details
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Choose either <strong>CGST + SGST</strong> (for
                        intra-state) or <strong>IGST</strong> (for inter-state)
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* CGST */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CGST Percentage
                          </label>
                          <Field
                            type="number"
                            name="cgst_percentage"
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="e.g., 9"
                          />
                        </div>

                        {/* SGST */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            SGST Percentage
                          </label>
                          <Field
                            type="number"
                            name="sgst_percentage"
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="e.g., 9"
                          />
                        </div>

                        {/* IGST */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            IGST Percentage
                          </label>
                          <Field
                            type="number"
                            name="igst_percentage"
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="e.g., 18"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Calculation Summary */}
                    {subtotal > 0 && (
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Calculation Summary
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-semibold text-gray-800">
                              ₹{subtotal.toLocaleString("en-IN")}
                            </span>
                          </div>
                          {cgst > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">
                                CGST @ {values.cgst_percentage}%
                              </span>
                              <span className="font-semibold text-gray-800">
                                ₹{cgst.toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}
                          {sgst > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">
                                SGST @ {values.sgst_percentage}%
                              </span>
                              <span className="font-semibold text-gray-800">
                                ₹{sgst.toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}
                          {igst > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">
                                IGST @ {values.igst_percentage}%
                              </span>
                              <span className="font-semibold text-gray-800">
                                ₹{igst.toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}
                          <div className="border-t pt-3 mt-3 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-800">
                              Total Amount
                            </span>
                            <span className="text-2xl font-bold text-blue-600">
                              ₹{total.toLocaleString("en-IN")}
                            </span>
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
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="animate-spin h-5 w-5"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Creating Receipt...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download PDF
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Receipt
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 min-w-[200px] bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
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
}
