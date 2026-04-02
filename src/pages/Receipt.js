import { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import ReceiptTemplate from "./ReceiptTemplate";
import { generatePDF } from "./utils/pdfGenerator";
import API_URL from "../config/api";
import { useAuth } from "../context/AuthContext";

// ─────────────────────────────────────────────
// Tiny icon helpers
// ─────────────────────────────────────────────
const IconEdit = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IconDelete = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const IconDownload = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IconSpinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

// ─────────────────────────────────────────────
// Shared company details
// ─────────────────────────────────────────────
const COMPANY_DETAILS = {
  name: "Skyup Digital Solutions LLP",
  address: "Parinidhi #23, E Block,\n14A Main Road, 2nd Floor,\nSahakaranagar,\nBangalore - 560092",
  gstNo: "29AFUFS6710E1ZJ",
  bankDetails: {
    bankName: "Kotak Mahindra Bank",
    accountName: "SKYUP DIGITAL SOLUTIONS LLP",
    accountNo: "1019032325",
    ifscCode: "KKBK0008045",
    branch: "Sahakara Nagar",
  },
};

function buildTemplateData(receipt) {
  return {
    ...receipt,
    ...COMPANY_DETAILS,
    cgstLabel: receipt.cgst > 0 ? (receipt.cgst_percentage > 0 ? `CGST @ ${receipt.cgst_percentage}%` : "CGST") : "",
    sgstLabel: receipt.sgst > 0 ? (receipt.sgst_percentage > 0 ? `SGST @ ${receipt.sgst_percentage}%` : "SGST") : "",
    igstLabel: receipt.igst > 0 ? (receipt.igst_percentage > 0 ? `IGST @ ${receipt.igst_percentage}%` : "IGST") : "",
  };
}

// ─────────────────────────────────────────────
// Delete Confirm Dialog
// ─────────────────────────────────────────────
function DeleteConfirmDialog({ receipt, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(3px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Delete Receipt?</h3>
        <p className="text-sm text-gray-500 mb-1">
          Invoice <span className="font-mono font-semibold text-gray-700">{receipt.invoice_no}</span>
        </p>
        <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><IconSpinner /> Deleting…</> : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Edit Receipt Modal
// ─────────────────────────────────────────────
function EditReceiptModal({ receipt, token, onClose, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const autoCalc = (amount, pct) => Math.round(amount * (pct / 100));

  const calcTotals = (items, cP, sP, iP, manual, cM, sM, iM) => {
    const subtotal = (items || []).reduce((s, i) => s + (i.qty || 0) * (i.rate || 0), 0);
    let cgst, sgst, igst;
    if (manual) { cgst = parseFloat(cM)||0; sgst = parseFloat(sM)||0; igst = parseFloat(iM)||0; }
    else { cgst = cP ? autoCalc(subtotal, cP) : 0; sgst = sP ? autoCalc(subtotal, sP) : 0; igst = iP ? autoCalc(subtotal, iP) : 0; }
    return { subtotal, cgst, sgst, igst, total: subtotal + cgst + sgst + igst };
  };

  const numberToWords = (num) => {
    const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"];
    const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
    const teens = ["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
    if (num === 0) return "Zero rupees only";
    const cvt = (n) => { let s = ""; if (n > 99) { s += ones[Math.floor(n/100)] + " hundred "; n %= 100; } if (n > 19) { s += tens[Math.floor(n/10)] + " "; n %= 10; } else if (n >= 10) { return s + teens[n-10] + " "; } if (n > 0) s += ones[n] + " "; return s; };
    let w = "";
    if (num >= 10000000) { w += cvt(Math.floor(num/10000000)) + "crore "; num %= 10000000; }
    if (num >= 100000) { w += cvt(Math.floor(num/100000)) + "lakh "; num %= 100000; }
    if (num >= 1000) { w += cvt(Math.floor(num/1000)) + "thousand "; num %= 1000; }
    w += cvt(num);
    return (w.trim().charAt(0).toUpperCase() + w.trim().slice(1) + " rupees only").replace(/\s+/g, " ");
  };

  const toDateInput = (val) => { try { return val ? new Date(val).toISOString().split("T")[0] : ""; } catch { return ""; } };

  const validationSchema = Yup.object({
    to: Yup.string().required("Required"),
    date: Yup.date().required("Required"),
    items: Yup.array().of(Yup.object({
      description: Yup.string().required("Required"),
      qty: Yup.number().positive().required("Required"),
      rate: Yup.number().positive().required("Required"),
    })).min(1),
    cgst_percentage: Yup.number().min(0).max(100),
    sgst_percentage: Yup.number().min(0).max(100),
    igst_percentage: Yup.number().min(0).max(100),
    cgst_manual: Yup.number().min(0),
    sgst_manual: Yup.number().min(0),
    igst_manual: Yup.number().min(0),
  });

  const isManual = receipt.cgst_percentage === 0 && receipt.cgst > 0;

  const initialValues = {
    to: receipt.to || "",
    client_gst: receipt.client_gst === "URD" ? "" : (receipt.client_gst || ""),
    date: toDateInput(receipt.date),
    invoice_due: toDateInput(receipt.invoice_due),
    hsn_no: receipt.hsn_no || "",
    items: receipt.items?.length
      ? receipt.items.map(i => ({ description: i.description||"", qty: i.qty||"", rate: i.rate||"" }))
      : [{ description: "", qty: "", rate: "" }],
    cgst_percentage: receipt.cgst_percentage || 9,
    sgst_percentage: receipt.sgst_percentage || 9,
    igst_percentage: receipt.igst_percentage || 18,
    cgst_manual: isManual ? receipt.cgst : "",
    sgst_manual: isManual ? receipt.sgst : "",
    igst_manual: isManual ? receipt.igst : "",
    use_manual_gst: isManual,
  };

  const handleSave = async (values) => {
    setSaving(true); setError(null);
    const { subtotal, cgst, sgst, igst, total } = calcTotals(
      values.items, values.cgst_percentage, values.sgst_percentage,
      values.igst_percentage, values.use_manual_gst,
      values.cgst_manual, values.sgst_manual, values.igst_manual
    );
    const payload = {
      to: values.to, client_gst: values.client_gst || "URD",
      date: values.date, invoice_due: values.invoice_due || null, hsn_no: values.hsn_no || "",
      items: values.items.map(i => ({ description: i.description, qty: parseInt(i.qty), rate: parseInt(i.rate), amount: parseInt(i.qty) * parseInt(i.rate) })),
      subtotal, cgst, sgst, igst,
      cgst_percentage: values.use_manual_gst ? 0 : values.cgst_percentage || 0,
      sgst_percentage: values.use_manual_gst ? 0 : values.sgst_percentage || 0,
      igst_percentage: values.use_manual_gst ? 0 : values.igst_percentage || 0,
      total, amount_in_words: numberToWords(total),
    };
    try {
      const res = await fetch(`${API_URL}/receipt/${receipt._id.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) { onSaved({ ...receipt, ...payload }); }
      else { setError(result.message || "Failed to update receipt"); }
    } catch (err) { setError("Error: " + err.message); }
    finally { setSaving(false); }
  };

  const ic = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(3px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ width: "min(96vw, 780px)", maxHeight: "92vh" }}>

        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Edit Receipt</h2>
            <p className="text-sm text-blue-600 font-mono mt-0.5">{receipt.invoice_no}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-7 py-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSave}>
            {({ values, errors, touched }) => {
              const { subtotal, cgst, sgst, igst, total } = calcTotals(
                values.items || [], values.cgst_percentage, values.sgst_percentage,
                values.igst_percentage, values.use_manual_gst,
                values.cgst_manual, values.sgst_manual, values.igst_manual
              );
              return (
                <Form className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Client Name & Address *</label>
                    <Field as="textarea" name="to" rows="3" className={`${ic} resize-none`} placeholder="Client name and address" />
                    {errors.to && touched.to && <p className="text-red-600 text-xs mt-1">⚠ {errors.to}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Client GST <span className="text-gray-400 text-xs">(blank = URD)</span></label>
                    <Field type="text" name="client_gst" className={ic} placeholder="GST number or leave blank" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Invoice Date *</label>
                      <Field type="date" name="date" className={ic} />
                      {errors.date && touched.date && <p className="text-red-600 text-xs mt-1">⚠ {errors.date}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Due Date</label>
                      <Field type="date" name="invoice_due" className={ic} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">HSN/SAC Number</label>
                    <Field type="text" name="hsn_no" className={ic} placeholder="HSN/SAC code" />
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-3">Line Items</h4>
                    <FieldArray name="items">
                      {({ push, remove }) => (
                        <div className="space-y-3">
                          {values.items.map((item, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                              {values.items.length > 1 && (
                                <button type="button" onClick={() => remove(index)}
                                  className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-full transition">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-3 inline-block">Item {index + 1}</span>
                              <div className="mb-3 mt-1">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
                                <Field as="textarea" name={`items.${index}.description`} rows="2" className={`${ic} resize-none`} placeholder="Service or product description" />
                                {errors.items?.[index]?.description && touched.items?.[index]?.description && (
                                  <p className="text-red-600 text-xs mt-1">⚠ {errors.items[index].description}</p>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Qty *</label>
                                  <Field type="number" name={`items.${index}.qty`} min="1" className={ic} placeholder="Qty" />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Rate (₹) *</label>
                                  <Field type="number" name={`items.${index}.rate`} min="0" step="0.01" className={ic} placeholder="Rate" />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Amount</label>
                                  <div className="px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">
                                    ₹{((item.qty || 0) * (item.rate || 0)).toLocaleString("en-IN")}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button type="button" onClick={() => push({ description: "", qty: "", rate: "" })}
                            className="w-full py-2.5 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 text-sm font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Item
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-3">GST Details</h4>
                    <label className="flex items-center gap-2 mb-3 cursor-pointer text-sm text-gray-700">
                      <Field type="checkbox" name="use_manual_gst" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                      Enter GST amounts manually
                    </label>
                    {!values.use_manual_gst ? (
                      <div className="grid grid-cols-3 gap-3">
                        {[["cgst_percentage","CGST %"],["sgst_percentage","SGST %"],["igst_percentage","IGST %"]].map(([n, l]) => (
                          <div key={n}>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">{l}</label>
                            <Field type="number" name={n} min="0" max="100" step="0.01" className={ic} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        {[["cgst_manual","CGST (₹)"],["sgst_manual","SGST (₹)"],["igst_manual","IGST (₹)"]].map(([n, l]) => (
                          <div key={n}>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">{l}</label>
                            <Field type="number" name={n} min="0" step="0.01" className={ic} placeholder="0" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {subtotal > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                      <h4 className="text-sm font-bold text-gray-700 mb-2">Summary</h4>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span></div>
                      {cgst > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">CGST</span><span>₹{cgst.toLocaleString("en-IN")}</span></div>}
                      {sgst > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">SGST</span><span>₹{sgst.toLocaleString("en-IN")}</span></div>}
                      {igst > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">IGST</span><span>₹{igst.toLocaleString("en-IN")}</span></div>}
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span className="text-gray-800">Total</span>
                        <span className="text-blue-700 text-lg">₹{total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2 pb-1">
                    <button type="button" onClick={onClose}
                      className="flex-1 py-3 border border-gray-200 rounded-lg text-gray-600 font-semibold text-sm hover:bg-gray-50 transition">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60">
                      {saving ? <><IconSpinner /> Saving…</> : "Save Changes"}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Per-receipt Action Buttons
// ─────────────────────────────────────────────
function ReceiptActions({ receipt, token, onDeleted, onEdit, onDownload, downloadingId }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isDownloading = downloadingId === receipt._id.toString();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/receipt/${receipt._id.toString()}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { setShowConfirm(false); onDeleted(receipt._id.toString()); }
      else { const d = await res.json(); alert("Failed to delete: " + (d.message || "Unknown error")); setDeleting(false); }
    } catch (err) { alert("Error: " + err.message); setDeleting(false); }
  };

  return (
    <>
      {showConfirm && (
        <DeleteConfirmDialog receipt={receipt} onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} loading={deleting} />
      )}
      <div className="flex items-center gap-1.5">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(receipt); }}
          title="Edit receipt"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition whitespace-nowrap"
        >
          <IconEdit /><span>Edit</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
          title="Delete receipt"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition whitespace-nowrap"
        >
          <IconDelete /><span>Delete</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDownload(receipt); }}
          title="Download PDF"
          disabled={!!downloadingId}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? <IconSpinner /> : <IconDownload />}
          <span>{isDownloading ? "…" : "PDF"}</span>
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Receipt List Modal
// onDownloadPdf(templateData) — provided by parent Receipt,
// loads receiptData + showPreview then calls generatePDF on receiptRef
// ─────────────────────────────────────────────
function ReceiptListModal({ isOpen, onClose, token, onDownloadPdf, downloadingId }) {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [editingReceipt, setEditingReceipt] = useState(null);

  useEffect(() => { if (isOpen) fetchReceipts(); }, [isOpen]);

  const fetchReceipts = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_URL}/receipts`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setReceipts([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      else setError("Failed to fetch receipts");
    } catch (err) { setError("Error: " + err.message); }
    finally { setLoading(false); }
  };

  const handleDeleted = (id) => {
    setReceipts(prev => prev.filter(r => r._id.toString() !== id.toString()));
    if (selectedReceipt?._id?.toString() === id.toString()) setSelectedReceipt(null);
  };

  const handleSaved = (updated) => {
    setReceipts(prev => prev.map(r => r._id.toString() === updated._id.toString() ? { ...r, ...updated } : r));
    if (selectedReceipt?._id?.toString() === updated._id?.toString()) setSelectedReceipt({ ...selectedReceipt, ...updated });
    setEditingReceipt(null);
  };

  const fd = (d) => { if (!d) return "—"; return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); };
  const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  const filtered = receipts.filter(r =>
    r.invoice_no?.toLowerCase().includes(search.toLowerCase()) ||
    r.to?.toLowerCase().includes(search.toLowerCase()) ||
    r.client_gst?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {editingReceipt && (
        <EditReceiptModal receipt={editingReceipt} token={token} onClose={() => setEditingReceipt(null)} onSaved={handleSaved} />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}>
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col"
          style={{ width: "min(96vw, 1040px)", maxHeight: "90vh" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">All Receipts</h2>
              <p className="text-sm text-gray-500 mt-0.5">{receipts.length} invoice{receipts.length !== 1 ? "s" : ""} generated</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500 hover:text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="px-7 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="relative">
              <svg className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by invoice no, client name, or GST…"
                className="w-[350px] pl-7 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* List */}
            <div className="overflow-y-auto" style={{ width: selectedReceipt ? "48%" : "100%", transition: "width 0.2s" }}>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <IconSpinner /><span className="text-gray-500 text-sm">Loading receipts…</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                  <button onClick={fetchReceipts} className="text-sm text-blue-600 hover:underline">Try again</button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48">
                  <p className="text-gray-500 text-sm">{search ? "No receipts match your search" : "No receipts generated yet"}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filtered.map((receipt) => (
                    <div
                      key={receipt._id}
                      className={`px-5 py-4 hover:bg-blue-50/40 transition cursor-pointer ${
                        selectedReceipt?._id?.toString() === receipt._id?.toString()
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : "border-l-4 border-transparent"
                      }`}
                      onClick={() => setSelectedReceipt(
                        selectedReceipt?._id?.toString() === receipt._id?.toString() ? null : receipt
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-blue-700 text-sm font-mono">{receipt.invoice_no}</span>
                            <span className="text-xs text-gray-400">{fd(receipt.date || receipt.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-800 font-medium truncate">{receipt.to?.split("\n")[0] || "—"}</p>
                          <p className="text-xs text-gray-400 mt-0.5">GST: {receipt.client_gst || "URD"}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="text-base font-bold text-gray-800">{fmt(receipt.total)}</span>
                          <ReceiptActions
                            receipt={receipt}
                            token={token}
                            onDeleted={handleDeleted}
                            onEdit={r => setEditingReceipt(r)}
                            onDownload={r => onDownloadPdf(buildTemplateData(r))}
                            downloadingId={downloadingId}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selectedReceipt && (
              <div className="border-l border-gray-100 overflow-y-auto bg-gray-50/40 flex-1">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 text-lg">Invoice Details</h3>
                    <button onClick={() => setSelectedReceipt(null)} className="text-gray-400 hover:text-gray-700 p-1 rounded transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex gap-2 mb-5">
                    <button onClick={() => setEditingReceipt(selectedReceipt)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition">
                      <IconEdit /> Edit
                    </button>
                    <button
                      onClick={() => onDownloadPdf(buildTemplateData(selectedReceipt))}
                      disabled={!!downloadingId}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingId === selectedReceipt._id.toString()
                        ? <><IconSpinner /> Generating…</>
                        : <><IconDownload /> Download</>
                      }
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Invoice No</span><span className="font-mono font-bold text-blue-700">{selectedReceipt.invoice_no}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Date</span><span>{fd(selectedReceipt.date)}</span></div>
                    {selectedReceipt.invoice_due && <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Due Date</span><span>{fd(selectedReceipt.invoice_due)}</span></div>}
                    {selectedReceipt.hsn_no && <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">HSN/SAC</span><span>{selectedReceipt.hsn_no}</span></div>}
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Client</p>
                    <p className="text-sm text-gray-800 whitespace-pre-line font-medium">{selectedReceipt.to}</p>
                    <p className="text-xs text-gray-500 mt-1">GST: {selectedReceipt.client_gst || "URD"}</p>
                  </div>

                  {selectedReceipt.items?.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">Line Items</p>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-y border-gray-100">
                            <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold">Description</th>
                            <th className="text-center px-2 py-2 text-xs text-gray-500 font-semibold">Qty</th>
                            <th className="text-right px-4 py-2 text-xs text-gray-500 font-semibold">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {selectedReceipt.items.map((item, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2 text-gray-700 text-xs whitespace-pre-line">{item.description}</td>
                              <td className="px-2 py-2 text-center text-gray-600 text-xs">{item.qty}</td>
                              <td className="px-4 py-2 text-right text-gray-800 font-medium text-xs">{fmt(item.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium">{fmt(selectedReceipt.subtotal)}</span></div>
                    {selectedReceipt.cgst > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">CGST{selectedReceipt.cgst_percentage > 0 ? ` @ ${selectedReceipt.cgst_percentage}%` : ""}</span><span>{fmt(selectedReceipt.cgst)}</span></div>}
                    {selectedReceipt.sgst > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">SGST{selectedReceipt.sgst_percentage > 0 ? ` @ ${selectedReceipt.sgst_percentage}%` : ""}</span><span>{fmt(selectedReceipt.sgst)}</span></div>}
                    {selectedReceipt.igst > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">IGST{selectedReceipt.igst_percentage > 0 ? ` @ ${selectedReceipt.igst_percentage}%` : ""}</span><span>{fmt(selectedReceipt.igst)}</span></div>}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span className="text-gray-800">Total</span>
                      <span className="text-blue-700 text-base">{fmt(selectedReceipt.total)}</span>
                    </div>
                    {selectedReceipt.amount_in_words && <p className="text-xs text-gray-400 italic">{selectedReceipt.amount_in_words}</p>}
                  </div>

                  {selectedReceipt.createdBy && (
                    <p className="text-xs text-gray-400 text-center mt-4">Created by {selectedReceipt.createdBy}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-7 py-4 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between rounded-b-2xl">
            <p className="text-xs text-gray-400">{filtered.length} of {receipts.length} receipts shown</p>
            <button onClick={fetchReceipts} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Main Receipt Component
// ─────────────────────────────────────────────
export function Receipt() {
  const { token } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [nextInvoiceSerial, setNextInvoiceSerial] = useState(1);
  const [showReceiptList, setShowReceiptList] = useState(false);
  const [listDownloadingId, setListDownloadingId] = useState(null);
  const receiptRef = useRef();

  useEffect(() => { if (token) fetchLastInvoiceNumber(); }, [token]);

  const fetchLastInvoiceNumber = async () => {
  try {
    const res = await fetch(`${API_URL}/receipts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && Array.isArray(data)) {
      const currentFY = getCurrentFinancialYear(); // e.g. "2026-27"

      // Filter only receipts belonging to the current financial year
      const currentYearReceipts = data.filter(r =>
        r.invoice_no?.includes(currentFY)
      );

      if (currentYearReceipts.length === 0) {
        // New financial year — reset to 1
        setNextInvoiceSerial(1);
      } else {
        // Extract serial numbers and find the max
        const serials = currentYearReceipts.map(r => {
          const match = r.invoice_no?.match(/SDS\/(\d+)\//);
          return match ? parseInt(match[1]) : 0;
        });
        setNextInvoiceSerial(Math.max(...serials) + 1);
      }
    }
  } catch {
    // Fallback to localStorage (also reset if FY changed)
    const savedFY = localStorage.getItem("invoiceFY");
    const currentFY = getCurrentFinancialYear();
    if (savedFY !== currentFY) {
      // New year — reset
      localStorage.setItem("invoiceFY", currentFY);
      localStorage.setItem("lastInvoiceSerial", "0");
      setNextInvoiceSerial(1);
    } else {
      const last = localStorage.getItem("lastInvoiceSerial");
      if (last) setNextInvoiceSerial(parseInt(last) + 1);
    }
  }
};

 const getCurrentFinancialYear = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  return m >= 4
    ? `${y}-${(y + 1).toString().slice(-2)}`
    : `${y - 1}-${y.toString().slice(-2)}`;
};
  const generateInvoiceNumber = (serial) => `SDS/${serial.toString().padStart(3, "0")}/${getCurrentFinancialYear()}`;

  // ── Called by ReceiptListModal when a PDF button is clicked ──────────────
  // 1. Load templateData into receiptData state (mounts <ReceiptTemplate> at receiptRef)
  // 2. Wait one tick for the DOM to paint
  // 3. Call generatePDF on receiptRef.current — exactly the same ref the form uses
  // 4. Tear down the preview state
  const handleListDownloadPdf = async (templateData) => {
    if (listDownloadingId) return;
    setListDownloadingId(templateData._id.toString());
    setReceiptData(templateData);
    setShowPreview(true);
    // Give React one animation frame to paint ReceiptTemplate into receiptRef
    await new Promise(resolve => setTimeout(resolve, 300));
    try {
      await generatePDF(receiptRef.current, templateData.invoice_no);
    } finally {
      setShowPreview(false);
      setReceiptData(null);
      setListDownloadingId(null);
    }
  };

  const validationSchema = Yup.object({
    to: Yup.string().required("Client name/address is required"),
    client_gst: Yup.string(),
    date: Yup.date().required("Invoice date is required"),
    invoice_due: Yup.date().nullable(),
    hsn_no: Yup.string(),
    items: Yup.array().of(Yup.object({
      description: Yup.string().required("Description is required"),
      qty: Yup.number().positive("Quantity must be positive").required("Quantity is required"),
      rate: Yup.number().positive("Rate must be positive").required("Rate is required"),
    })).min(1),
    cgst_percentage: Yup.number().min(0).max(100),
    sgst_percentage: Yup.number().min(0).max(100),
    igst_percentage: Yup.number().min(0).max(100),
    cgst_manual: Yup.number().min(0),
    sgst_manual: Yup.number().min(0),
    igst_manual: Yup.number().min(0),
  });

  const autoCalc = (amount, pct) => Math.round(amount * (pct / 100));

  const numberToWords = (num) => {
    const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"];
    const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
    const teens = ["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
    if (num === 0) return "Zero rupees only";
    const cvt = (n) => { let s = ""; if (n > 99) { s += ones[Math.floor(n/100)] + " hundred "; n %= 100; } if (n > 19) { s += tens[Math.floor(n/10)] + " "; n %= 10; } else if (n >= 10) { return s + teens[n-10] + " "; } if (n > 0) s += ones[n] + " "; return s; };
    let w = "";
    if (num >= 10000000) { w += cvt(Math.floor(num/10000000)) + "crore "; num %= 10000000; }
    if (num >= 100000) { w += cvt(Math.floor(num/100000)) + "lakh "; num %= 100000; }
    if (num >= 1000) { w += cvt(Math.floor(num/1000)) + "thousand "; num %= 1000; }
    w += cvt(num);
    return (w.trim().charAt(0).toUpperCase() + w.trim().slice(1) + " rupees only").replace(/\s+/g, " ");
  };

  const calculateTotals = (items, cP, sP, iP, manual, cM, sM, iM) => {
    if (!items || !Array.isArray(items)) return { subtotal: 0, cgst: 0, sgst: 0, igst: 0, total: 0 };
    const subtotal = items.reduce((s, i) => s + (i.qty || 0) * (i.rate || 0), 0);
    let cgst, sgst, igst;
    if (manual) { cgst = parseFloat(cM)||0; sgst = parseFloat(sM)||0; igst = parseFloat(iM)||0; }
    else { cgst = cP ? autoCalc(subtotal, cP) : 0; sgst = sP ? autoCalc(subtotal, sP) : 0; igst = iP ? autoCalc(subtotal, iP) : 0; }
    return { subtotal, cgst, sgst, igst, total: subtotal + cgst + sgst + igst };
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const { subtotal, cgst, sgst, igst, total } = calculateTotals(
      values.items, values.cgst_percentage, values.sgst_percentage,
      values.igst_percentage, values.use_manual_gst,
      values.cgst_manual, values.sgst_manual, values.igst_manual
    );
    const invoiceNumber = generateInvoiceNumber(nextInvoiceSerial);
    const formData = {
      to: values.to, client_gst: values.client_gst || "URD", invoice_no: invoiceNumber,
      date: values.date, invoice_due: values.invoice_due || null, hsn_no: values.hsn_no || "",
      items: values.items.map(i => ({ description: i.description, qty: parseInt(i.qty), rate: parseInt(i.rate), amount: parseInt(i.qty) * parseInt(i.rate) })),
      subtotal, cgst, sgst, igst,
      cgst_percentage: values.use_manual_gst ? 0 : values.cgst_percentage || 0,
      sgst_percentage: values.use_manual_gst ? 0 : values.sgst_percentage || 0,
      igst_percentage: values.use_manual_gst ? 0 : values.igst_percentage || 0,
      total, amount_in_words: numberToWords(total),
    };
    try {
      const receiptFullData = {
        ...formData,
        ...COMPANY_DETAILS,
        cgstLabel: cgst > 0 ? (values.use_manual_gst ? "CGST" : `CGST @ ${values.cgst_percentage || 9}%`) : "",
        sgstLabel: sgst > 0 ? (values.use_manual_gst ? "SGST" : `SGST @ ${values.sgst_percentage || 9}%`) : "",
        igstLabel: igst > 0 ? (values.use_manual_gst ? "IGST" : `IGST @ ${values.igst_percentage || 18}%`) : "",
      };
      setReceiptData(receiptFullData);
      setShowPreview(true);
      setTimeout(async () => {
        await generatePDF(receiptRef.current, invoiceNumber);
        const res = await fetch(`${API_URL}/receipt`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (res.ok) {
          alert("Receipt created and downloaded successfully!");
          setNextInvoiceSerial(nextInvoiceSerial + 1);
          localStorage.setItem("lastInvoiceSerial", nextInvoiceSerial.toString());
          resetForm();
          setShowPreview(false);
        } else { alert("Failed to save receipt: " + result.message); }
        setSubmitting(false);
      }, 500);
    } catch (err) { alert("Error: " + err.message); setSubmitting(false); }
  };

  const handlePrint = () => {
    const pw = window.open("", "_blank");
    pw.document.write(`<!DOCTYPE html><html><head><title>Invoice ${receiptData?.invoice_no}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>@media print{body{margin:0;padding:0;}@page{size:A4;margin:0;}}</style>
      </head><body>${receiptRef.current.innerHTML}</body></html>`);
    pw.document.close();
    setTimeout(() => { pw.print(); }, 250);
  };

  const ic = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 font-poppins">
      <ReceiptListModal
        isOpen={showReceiptList}
        onClose={() => setShowReceiptList(false)}
        token={token}
        onDownloadPdf={handleListDownloadPdf}
        downloadingId={listDownloadingId}
      />

      <div className="max-w-5xl mx-auto">
        {!showPreview ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Header */}
            <div className="mb-8 border-b pb-6 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Receipt</h1>
                <p className="text-gray-600">Generate professional invoice for your client</p>
              </div>
              <button onClick={() => setShowReceiptList(true)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 px-5 rounded-lg transition shadow-sm hover:shadow-md text-sm flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Receipt List
              </button>
            </div>

            <Formik
              initialValues={{
                to: "", client_gst: "",
                date: new Date().toISOString().split("T")[0],
                invoice_due: "", hsn_no: "",
                items: [{ description: "", qty: "", rate: "" }],
                cgst_percentage: 9, sgst_percentage: 9, igst_percentage: 18,
                cgst_manual: "", sgst_manual: "", igst_manual: "",
                use_manual_gst: false,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isSubmitting }) => {
                const { subtotal, cgst, sgst, igst, total } = calculateTotals(
                  values.items || [], values.cgst_percentage, values.sgst_percentage,
                  values.igst_percentage, values.use_manual_gst,
                  values.cgst_manual, values.sgst_manual, values.igst_manual
                );
                return (
                  <Form className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">Next Invoice Number</p>
                      <p className="text-2xl font-bold text-blue-600">{generateInvoiceNumber(nextInvoiceSerial)}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name & Address <span className="text-red-500">*</span></label>
                      <Field as="textarea" name="to" rows="3" className={`${ic} resize-none`} placeholder="Enter client name and complete address" />
                      {errors.to && touched.to && <p className="text-red-600 text-sm mt-1">⚠ {errors.to}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Client GST Number <span className="text-gray-400 text-xs">(Optional - Defaults to URD)</span></label>
                      <Field type="text" name="client_gst" className={ic} placeholder="Enter client GST number or leave blank for URD" />
                      <p className="text-xs text-gray-500 mt-1">Enter any GST format or leave blank for "URD"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Date <span className="text-red-500">*</span></label>
                        <Field type="date" name="date" className={ic} />
                        {errors.date && touched.date && <p className="text-red-600 text-sm mt-1">⚠ {errors.date}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Due Date <span className="text-gray-400 text-xs">(Optional)</span></label>
                        <Field type="date" name="invoice_due" className={ic} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">HSN/SAC Number <span className="text-gray-400 text-xs">(Optional)</span></label>
                      <Field type="text" name="hsn_no" className={ic} placeholder="Enter HSN/SAC code" />
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Line Items</h3>
                      <FieldArray name="items">
                        {({ push, remove }) => (
                          <div className="space-y-6">
                            {values.items.map((item, index) => (
                              <div key={index} className="bg-white border border-gray-300 rounded-lg p-6 relative">
                                {values.items.length > 1 && (
                                  <button type="button" onClick={() => remove(index)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-full transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Item {index + 1}</span>
                                <div className="space-y-4 mt-2">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                                    <Field as="textarea" name={`items.${index}.description`} rows="3" className={`${ic} resize-none`} placeholder="Enter service or product description" />
                                    {errors.items?.[index]?.description && touched.items?.[index]?.description && <p className="text-red-600 text-sm mt-1">⚠ {errors.items[index].description}</p>}
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                                      <Field type="number" name={`items.${index}.qty`} min="1" className={ic} placeholder="Qty" />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">Rate (₹) *</label>
                                      <Field type="number" name={`items.${index}.rate`} min="0" step="0.01" className={ic} placeholder="Rate" />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                                      <div className={`${ic} bg-gray-100 border-gray-200 font-semibold text-gray-700`}>
                                        ₹{((item.qty || 0) * (item.rate || 0)).toLocaleString("en-IN")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button type="button" onClick={() => push({ description: "", qty: "", rate: "" })}
                              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-3 px-6 rounded-lg transition border-2 border-dashed border-blue-300 flex items-center justify-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Add Another Item
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">GST Details</h3>
                      <label className="flex items-center gap-3 cursor-pointer mb-4">
                        <Field type="checkbox" name="use_manual_gst" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="text-sm font-medium text-gray-700">Enter GST amounts manually</span>
                      </label>
                      {!values.use_manual_gst ? (
                        <div className="grid grid-cols-3 gap-6">
                          {[["cgst_percentage","CGST %"],["sgst_percentage","SGST %"],["igst_percentage","IGST %"]].map(([n, l]) => (
                            <div key={n}><label className="block text-sm font-semibold text-gray-700 mb-2">{l}</label><Field type="number" name={n} min="0" max="100" step="0.01" className={ic} /></div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-6">
                          {[["cgst_manual","CGST (₹)"],["sgst_manual","SGST (₹)"],["igst_manual","IGST (₹)"]].map(([n, l]) => (
                            <div key={n}><label className="block text-sm font-semibold text-gray-700 mb-2">{l}</label><Field type="number" name={n} min="0" step="0.01" className={ic} placeholder="0" /></div>
                          ))}
                        </div>
                      )}
                    </div>

                    {subtotal > 0 && (
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Calculation Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span></div>
                          {cgst > 0 && <div className="flex justify-between"><span className="text-gray-600">{values.use_manual_gst ? "CGST" : `CGST @ ${values.cgst_percentage}%`}</span><span className="font-semibold">₹{cgst.toLocaleString("en-IN")}</span></div>}
                          {sgst > 0 && <div className="flex justify-between"><span className="text-gray-600">{values.use_manual_gst ? "SGST" : `SGST @ ${values.sgst_percentage}%`}</span><span className="font-semibold">₹{sgst.toLocaleString("en-IN")}</span></div>}
                          {igst > 0 && <div className="flex justify-between"><span className="text-gray-600">{values.use_manual_gst ? "IGST" : `IGST @ ${values.igst_percentage}%`}</span><span className="font-semibold">₹{igst.toLocaleString("en-IN")}</span></div>}
                          <div className="border-t pt-3 flex justify-between">
                            <span className="text-lg font-bold text-gray-800">Total Amount</span>
                            <span className="text-2xl font-bold text-blue-600">₹{total.toLocaleString("en-IN")}</span>
                          </div>
                          <p className="text-sm text-gray-600 italic">In words: {numberToWords(total)}</p>
                        </div>
                      </div>
                    )}

                    <div className="pt-6">
                      <button type="submit" disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition disabled:opacity-50 shadow-md hover:shadow-lg flex items-center gap-2">
                        {isSubmitting ? <><IconSpinner /> Creating Receipt…</> : (
                          <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg> Create & Download Receipt</>
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
            {/* Only show action bar when NOT doing a silent list download */}
            {!listDownloadingId && (
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-wrap gap-4 print:hidden">
                <button onClick={() => generatePDF(receiptRef.current, receiptData.invoice_no)}
                  className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md flex items-center justify-center gap-2">
                  <IconDownload /> Download PDF
                </button>
                <button onClick={handlePrint}
                  className="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Receipt
                </button>
                <button onClick={() => setShowPreview(false)}
                  className="flex-1 min-w-[200px] bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Create New Receipt
                </button>
              </div>
            )}
            <div ref={receiptRef}><ReceiptTemplate data={receiptData} /></div>
          </div>
        )}
      </div>
    </div>
  );
}
