export default function ReceiptTemplate({ data }) {
  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className="font-poppins bg-white"
      style={{
        backgroundImage: "url('/images/watermark.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        padding: 0,
        margin: 0,
        display: "block",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pt-4 pb-3 px-[60px]">
        <div>
          <h1 className="text-5xl font-extrabold text-black mb-4">INVOICE</h1>
        </div>
        <div className="text-right">
          <img src="/images/rbd-logo.webp" className="h-16" alt="Logo" />
        </div>
      </div>

      {/* From and GST Section */}
      <div className="flex justify-between mb-6 px-[60px]">
        <div>
          <div className="font-bold text-sm mb-2">FROM:</div>
          <div className="font-bold text-sm">{data.name}</div>
          <div className="text-sm whitespace-pre-line">{data.address}</div>
        </div>
        <div className="text-right">
          <div className="text-sm">
            <span className="font-bold">GST No:</span> {data.gstNo}
          </div>
        </div>
      </div>

      {/* To and Invoice Details Section */}
      <div className="flex justify-between mb-10 h-[110px] px-[60px]">
        <div className="flex-1">
          <div className="font-bold text-sm mb-2">TO:</div>
          {(() => {
            const lines = data.to.split("\n").filter((line) => line.trim());
            return (
              <>
                {lines.length > 0 && (
                  <div className="font-bold text-sm">{lines[0]}</div>
                )}
                {lines.length > 1 && (
                  <div className="text-sm whitespace-pre-line">
                    {lines.slice(1).join("\n")}
                  </div>
                )}
              </>
            );
          })()}
          <div className="text-sm mt-2">
            <span className="font-bold text-sm mb-2">GST No: </span>
            {data.client_gst}
          </div>
        </div>
        <div className="rounded-lg text-right min-w-[250px]">
          <div className="text-sm mb-2">
            <span className="font-semibold">Invoice No:</span> {data.invoice_no}
          </div>
          <div className="text-sm mb-2">
            <span className="font-semibold">HSN/SAN Number:</span> {data.hsn_no}
          </div>
          <div className="text-sm mb-2">
            <span className="font-semibold">Date:</span> {formatDate(data.date)}
          </div>
          {data.invoice_due && (
            <div className="text-sm">
              <span className="font-semibold">Invoice Due:</span>{" "}
              {formatDate(data.invoice_due)}
            </div>
          )}
        </div>
      </div>

      {/* New Table Layout with Borders */}
      <div className="mb-5 px-4 sm:px-6 lg:px-8 h-[400px] flex items-center justify-center">
        <table className="min-w-full table-fixed border-[#2b2b2b] table-bordered text-center align-middle">
          <thead>
            <tr style={{ backgroundColor: "#fed7aa" }}>
              <th className="px-2 pb-3 w-[8%]">SL.No.</th>
              <th className="px-2 pb-3 w-[40%]">Description</th>
              <th className="px-2 pb-3 w-[12%]">Tax Rate</th>
              <th className="px-2 pb-3 w-[10%]">Qty</th>
              <th className="px-2 pb-3 w-[15%]">Rate</th>
              <th className="px-2 pb-3 w-[15%]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* Dynamic Items Rows */}
            {data.items &&
              data.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 pb-3">{index + 1}</td>
                  <td className="px-4 pb-3 whitespace-pre-wrap break-words">
                    {item.description}
                  </td>
                  <td className="px-4 pb-3">18%</td>
                  <td className="px-4 pb-3">{item.qty}</td>
                  <td className="px-4 pb-3">{item.rate}</td>
                  <td className="px-4 pb-3">{item.amount}</td>
                </tr>
              ))}

            {/* Subtotal Row */}
            <tr>
              <td colSpan="4" className="no-border px-2 pb-3 text-sm"></td>
              <td className="px-2 pb-3 text-sm font-medium text-gray-700">
                Total
              </td>
              <td className="px-2 pb-3 text-sm text-gray-700">
                {data.subtotal}
              </td>
            </tr>

            {/* Tax Rows (CGST, SGST, IGST) - only show if amount > 0 */}
            {data.cgst > 0 && (
              <tr>
                <td colSpan="4" className="no-border px-2 pb-3"></td>
                <td className="px-2 pb-3 text-sm font-medium text-gray-700">
                  {data.cgstLabel || "CGST @ 9%"}
                </td>
                <td className="px-2 pb-3 text-sm text-gray-700">{data.cgst}</td>
              </tr>
            )}

            {data.sgst > 0 && (
              <tr>
                <td colSpan="4" className="no-border px-2 pb-3"></td>
                <td className="px-2 pb-3 text-sm font-medium text-gray-700">
                  {data.sgstLabel || "SGST @ 9%"}
                </td>
                <td className="px-2 pb-3 text-sm text-gray-700">{data.sgst}</td>
              </tr>
            )}

            {data.igst > 0 && (
              <tr>
                <td colSpan="4" className="no-border px-2 pb-3"></td>
                <td className="px-2 pb-3 text-sm font-medium text-gray-700">
                  {data.igstLabel || "IGST @ 18%"}
                </td>
                <td className="px-2 pb-3 text-sm text-gray-700">{data.igst}</td>
              </tr>
            )}

            {/* Total Amount In Words */}
            <tr style={{ backgroundColor: "#2563eb" }}>
              <td colSpan="4" className="text-sm px-2 pb-3 text-white">
                {data.amount_in_words}
              </td>
              <td className="px-2 pb-3 text-sm font-bold text-white">TOTAL</td>
              <td className="px-2 pb-3 text-sm font-bold text-white">
                {data.total}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bank Details and Thank You Section */}
      <div className="flex justify-between">
        {/* Bank Details */}
        <div className="flex-1 py-2 px-[60px]">
          {" "}
          {/* Added mt-4 to push it up */}
          <div className="font-bold text-sm mb-1">BANK DETAILS</div>
          <div className="text-sm">
            <div>
              <span className="font-bold">{data.bankDetails.bankName}</span>
            </div>
            <div>
              <span className="font-semibold">Account Name:</span>{" "}
              {data.bankDetails.accountName}
            </div>
            <div>
              <span className="font-semibold">Account No:</span>{" "}
              {data.bankDetails.accountNo}
            </div>
            <div>
              <span className="font-semibold">IFSC Code:</span>{" "}
              {data.bankDetails.ifscCode}
            </div>
            <div>
              <span className="font-semibold">Branch:</span>{" "}
              {data.bankDetails.branch}
            </div>
            <div className="text-[13px]">
              <span className="font-semibold text-sm">Note:</span> Payment
              Beyond 30 Days Will Attract 18% Interest
            </div>
          </div>
        </div>

        {/* Thank You with Geometric Design */}
        <div className="pt-6">
          <img
            src="/images/signature.webp"
            className="w-[325px]"
            alt="Thank You"
          />
        </div>
      </div>
    </div>
  );
}
