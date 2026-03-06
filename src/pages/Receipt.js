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
  const [showReceiptList, setShowReceiptList] = useState(false);
  const receiptRef = useRef();

  const companyDetails = {
    name: "Skyup Digital Solutions LLP",
    address: "Parinidhi #23, E Block,\n14A Main Road, 2nd Floor,\nSahakaranagar,\nBangalore - 560092",
    gstNo: "29AFUFS6710E1ZJ",
    bankDetails: {
      bankName: "Kotak Mahindra Bank", accountName: "SKYUP DIGITAL SOLUTIONS LLP",
      accountNo: "1019032325", ifscCode: "KKBK0008045", branch: "Sahakara Nagar",
    },
  };

  useEffect(() => { if (token) fetchLastInvoiceNumber(); }, [token]);

  const fetchLastInvoiceNumber = async () => {
    try {
      const res = await fetch(`${API_URL}/api/last-invoice`, { headers: { Authorization:`Bearer ${token}` } });
      const data = await res.json();
      if (data.lastSerial) setNextInvoiceSerial(data.lastSerial + 1);
    } catch {
      const last = localStorage.getItem("lastInvoiceSerial");
      if (last) setNextInvoiceSerial(parseInt(last) + 1);
    }
  };

  const getCurrentFinancialYear = () => {
    const today = new Date(); const y = today.getFullYear(); const m = today.getMonth()+1;
    return m>=4 ? `${y}-${(y+1).toString().slice(-2)}` : `${y-1}-${y.toString().slice(-2)}`;
  };
  const generateInvoiceNumber = (serial) => `SDS/${serial.toString().padStart(3,"0")}/${getCurrentFinancialYear()}`;

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

  const autoCalc = (amount, pct) => Math.round(amount*(pct/100));

  const numberToWords = (num) => {
    const ones=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"];
    const tens=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
    const teens=["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
    if(num===0) return "Zero rupees only";
    const cvt=(n)=>{let s="";if(n>99){s+=ones[Math.floor(n/100)]+" hundred ";n%=100;}if(n>19){s+=tens[Math.floor(n/10)]+" ";n%=10;}else if(n>=10){return s+teens[n-10]+" ";}if(n>0)s+=ones[n]+" ";return s;};
    let w="";
    if(num>=10000000){w+=cvt(Math.floor(num/10000000))+"crore ";num%=10000000;}
    if(num>=100000){w+=cvt(Math.floor(num/100000))+"lakh ";num%=100000;}
    if(num>=1000){w+=cvt(Math.floor(num/1000))+"thousand ";num%=1000;}
    w+=cvt(num);
    return(w.trim().charAt(0).toUpperCase()+w.trim().slice(1)+" rupees only").replace(/\s+/g," ");
  };

  const calculateTotals = (items,cP,sP,iP,manual,cM,sM,iM) => {
    if(!items||!Array.isArray(items)) return {subtotal:0,cgst:0,sgst:0,igst:0,total:0};
    const subtotal = items.reduce((s,i)=>s+(i.qty||0)*(i.rate||0),0);
    let cgst,sgst,igst;
    if(manual){cgst=parseFloat(cM)||0;sgst=parseFloat(sM)||0;igst=parseFloat(iM)||0;}
    else{cgst=cP?autoCalc(subtotal,cP):0;sgst=sP?autoCalc(subtotal,sP):0;igst=iP?autoCalc(subtotal,iP):0;}
    return {subtotal,cgst,sgst,igst,total:subtotal+cgst+sgst+igst};
  };

  const handleSubmit = async (values,{setSubmitting,resetForm}) => {
    const {subtotal,cgst,sgst,igst,total} = calculateTotals(
      values.items,values.cgst_percentage,values.sgst_percentage,
      values.igst_percentage,values.use_manual_gst,
      values.cgst_manual,values.sgst_manual,values.igst_manual
    );
    const invoiceNumber = generateInvoiceNumber(nextInvoiceSerial);
    const formData = {
      to:values.to, client_gst:values.client_gst||"URD", invoice_no:invoiceNumber,
      date:values.date, invoice_due:values.invoice_due||null, hsn_no:values.hsn_no||"",
      items:values.items.map(i=>({description:i.description,qty:parseInt(i.qty),rate:parseInt(i.rate),amount:parseInt(i.qty)*parseInt(i.rate)})),
      subtotal,cgst,sgst,igst,
      cgst_percentage:values.use_manual_gst?0:values.cgst_percentage||0,
      sgst_percentage:values.use_manual_gst?0:values.sgst_percentage||0,
      igst_percentage:values.use_manual_gst?0:values.igst_percentage||0,
      total, amount_in_words:numberToWords(total),
    };
    try {
      const receiptFullData = {
        ...formData, ...companyDetails,
        cgstLabel:cgst>0?(values.use_manual_gst?"CGST":`CGST @ ${values.cgst_percentage||9}%`):"",
        sgstLabel:sgst>0?(values.use_manual_gst?"SGST":`SGST @ ${values.sgst_percentage||9}%`):"",
        igstLabel:igst>0?(values.use_manual_gst?"IGST":`IGST @ ${values.igst_percentage||18}%`):"",
      };
      setReceiptData(receiptFullData); setShowPreview(true);
      setTimeout(async()=>{
        await generatePDF(receiptRef.current, invoiceNumber);
        const res = await fetch(`${API_URL}/receipt`,{
          method:"POST",
          headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
          body:JSON.stringify(formData),
        });
        const result = await res.json();
        if(res.ok){
          alert("Receipt created and downloaded successfully!");
          setNextInvoiceSerial(nextInvoiceSerial+1);
          localStorage.setItem("lastInvoiceSerial",nextInvoiceSerial.toString());
          resetForm(); setShowPreview(false);
        } else { alert("Failed to save receipt: "+result.message); }
        setSubmitting(false);
      },500);
    } catch(err){ alert("Error: "+err.message); setSubmitting(false); }
  };

  const handlePrint = () => {
    const pw = window.open("","_blank");
    pw.document.write(`<!DOCTYPE html><html><head><title>Invoice ${receiptData?.invoice_no}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>@media print{body{margin:0;padding:0;}@page{size:A4;margin:0;}}</style>
      </head><body>${receiptRef.current.innerHTML}</body></html>`);
    pw.document.close();
    setTimeout(()=>{pw.print();},250);
  };

  const ic = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 font-poppins">
      <ReceiptListModal isOpen={showReceiptList} onClose={()=>setShowReceiptList(false)} token={token} />

      <div className="max-w-5xl mx-auto">
        {!showPreview ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Header */}
            <div className="mb-8 border-b pb-6 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Receipt</h1>
                <p className="text-gray-600">Generate professional invoice for your client</p>
              </div>
              <button onClick={()=>setShowReceiptList(true)}
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
                to:"", client_gst:"",
                date:new Date().toISOString().split("T")[0],
                invoice_due:"", hsn_no:"",
                items:[{description:"",qty:"",rate:""}],
                cgst_percentage:9, sgst_percentage:9, igst_percentage:18,
                cgst_manual:"", sgst_manual:"", igst_manual:"",
                use_manual_gst:false,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({values,errors,touched,isSubmitting})=>{
                const {subtotal,cgst,sgst,igst,total} = calculateTotals(
                  values.items||[],values.cgst_percentage,values.sgst_percentage,
                  values.igst_percentage,values.use_manual_gst,
                  values.cgst_manual,values.sgst_manual,values.igst_manual
                );
                return (
                  <Form className="space-y-6">
                    {/* Invoice Number */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">Next Invoice Number</p>
                      <p className="text-2xl font-bold text-blue-600">{generateInvoiceNumber(nextInvoiceSerial)}</p>
                    </div>

                    {/* Client */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name & Address <span className="text-red-500">*</span></label>
                      <Field as="textarea" name="to" rows="3" className={`${ic} resize-none`} placeholder="Enter client name and complete address" />
                      {errors.to&&touched.to&&<p className="text-red-600 text-sm mt-1">⚠ {errors.to}</p>}
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
                        {errors.date&&touched.date&&<p className="text-red-600 text-sm mt-1">⚠ {errors.date}</p>}
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

                    {/* Items */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Line Items</h3>
                      <FieldArray name="items">
                        {({push,remove})=>(
                          <div className="space-y-6">
                            {values.items.map((item,index)=>(
                              <div key={index} className="bg-white border border-gray-300 rounded-lg p-6 relative">
                                {values.items.length>1&&(
                                  <button type="button" onClick={()=>remove(index)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-full transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Item {index+1}</span>
                                <div className="space-y-4 mt-2">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                                    <Field as="textarea" name={`items.${index}.description`} rows="3" className={`${ic} resize-none`} placeholder="Enter service or product description" />
                                    {errors.items?.[index]?.description&&touched.items?.[index]?.description&&<p className="text-red-600 text-sm mt-1">⚠ {errors.items[index].description}</p>}
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
                                        ₹{((item.qty||0)*(item.rate||0)).toLocaleString("en-IN")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button type="button" onClick={()=>push({description:"",qty:"",rate:""})}
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

                    {/* GST */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">GST Details</h3>
                      <label className="flex items-center gap-3 cursor-pointer mb-4">
                        <Field type="checkbox" name="use_manual_gst" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="text-sm font-medium text-gray-700">Enter GST amounts manually</span>
                      </label>
                      {!values.use_manual_gst ? (
                        <div className="grid grid-cols-3 gap-6">
                          {[["cgst_percentage","CGST %"],["sgst_percentage","SGST %"],["igst_percentage","IGST %"]].map(([n,l])=>(
                            <div key={n}><label className="block text-sm font-semibold text-gray-700 mb-2">{l}</label><Field type="number" name={n} min="0" max="100" step="0.01" className={ic} /></div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-6">
                          {[["cgst_manual","CGST (₹)"],["sgst_manual","SGST (₹)"],["igst_manual","IGST (₹)"]].map(([n,l])=>(
                            <div key={n}><label className="block text-sm font-semibold text-gray-700 mb-2">{l}</label><Field type="number" name={n} min="0" step="0.01" className={ic} placeholder="0" /></div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    {subtotal>0&&(
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Calculation Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span></div>
                          {cgst>0&&<div className="flex justify-between"><span className="text-gray-600">{values.use_manual_gst?"CGST":`CGST @ ${values.cgst_percentage}%`}</span><span className="font-semibold">₹{cgst.toLocaleString("en-IN")}</span></div>}
                          {sgst>0&&<div className="flex justify-between"><span className="text-gray-600">{values.use_manual_gst?"SGST":`SGST @ ${values.sgst_percentage}%`}</span><span className="font-semibold">₹{sgst.toLocaleString("en-IN")}</span></div>}
                          {igst>0&&<div className="flex justify-between"><span className="text-gray-600">{values.use_manual_gst?"IGST":`IGST @ ${values.igst_percentage}%`}</span><span className="font-semibold">₹{igst.toLocaleString("en-IN")}</span></div>}
                          <div className="border-t pt-3 flex justify-between">
                            <span className="text-lg font-bold text-gray-800">Total Amount</span>
                            <span className="text-2xl font-bold text-blue-600">₹{total.toLocaleString("en-IN")}</span>
                          </div>
                          <p className="text-sm text-gray-600 italic">In words: {numberToWords(total)}</p>
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <div className="pt-6">
                      <button type="submit" disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition disabled:opacity-50 shadow-md hover:shadow-lg flex items-center gap-2">
                        {isSubmitting ? <><IconSpinner/> Creating Receipt…</> : (
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
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-wrap gap-4 print:hidden">
              <button onClick={()=>generatePDF(receiptRef.current,receiptData.invoice_no)}
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
              <button onClick={()=>setShowPreview(false)}
                className="flex-1 min-w-[200px] bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Create New Receipt
              </button>
            </div>
            <div ref={receiptRef}><ReceiptTemplate data={receiptData} /></div>
          </div>
        )}
      </div>
    </div>
  );
}