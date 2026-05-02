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

  const cellStyle = {
    border: "1px solid #2b2b2b",
    padding: "8px 6px",
    textAlign: "center",
  };

  const headerCellStyle = {
    border: "1px solid #2b2b2b",
    padding: "8px 6px",
    textAlign: "center",
    fontWeight: "bold",
  };

  const taxCellStyle = {
    border: "1px solid #2b2b2b",
    padding: "6px 8px",
    textAlign: "center",
    fontWeight: "500",
    fontSize: "13px",
    color: "#374151",
  };

  const taxValueStyle = {
    border: "1px solid #2b2b2b",
    padding: "6px 8px",
    textAlign: "center",
    fontSize: "13px",
    color: "#374151",
  };

  const emptyColStyle = {
    padding: "6px",
    border: "none",
  };

  const totalRowStyle = {
    border: "1px solid #1e40af",
    padding: "8px 6px",
    color: "white",
    textAlign: "center",
    fontSize: "13px",
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

      {/* Table Section — all borders via inline styles for PDF compatibility */}
      <div className="mb-5 px-[60px]">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            border: "1px solid #2b2b2b",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#fed7aa" }}>
              <th style={{ ...headerCellStyle, width: "8%" }}>SL.No.</th>
              <th style={{ ...headerCellStyle, width: "40%" }}>Description</th>
              <th style={{ ...headerCellStyle, width: "12%" }}>Tax Rate</th>
              <th style={{ ...headerCellStyle, width: "10%" }}>Qty</th>
              <th style={{ ...headerCellStyle, width: "15%" }}>Rate</th>
              <th style={{ ...headerCellStyle, width: "15%" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* Line Items */}
            {data.items &&
              data.items.map((item, index) => (
                <tr key={index}>
                  <td style={cellStyle}>{index + 1}</td>
                  <td
                    style={{
                      ...cellStyle,
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {item.description}
                  </td>
                  <td style={cellStyle}>18%</td>
                  <td style={cellStyle}>{item.qty}</td>
                  <td style={cellStyle}>{item.rate}</td>
                  <td style={cellStyle}>{item.amount}</td>
                </tr>
              ))}

            {/* Subtotal Row */}
            <tr>
              <td colSpan="4" style={emptyColStyle}></td>
              <td style={taxCellStyle}>Total</td>
              <td style={taxValueStyle}>{data.subtotal}</td>
            </tr>

            {/* CGST Row */}
            {data.cgst > 0 && (
              <tr>
                <td colSpan="4" style={emptyColStyle}></td>
                <td style={taxCellStyle}>{data.cgstLabel || "CGST @ 9%"}</td>
                <td style={taxValueStyle}>{data.cgst}</td>
              </tr>
            )}

            {/* SGST Row */}
            {data.sgst > 0 && (
              <tr>
                <td colSpan="4" style={emptyColStyle}></td>
                <td style={taxCellStyle}>{data.sgstLabel || "SGST @ 9%"}</td>
                <td style={taxValueStyle}>{data.sgst}</td>
              </tr>
            )}

            {/* IGST Row */}
            {data.igst > 0 && (
              <tr>
                <td colSpan="4" style={emptyColStyle}></td>
                <td style={taxCellStyle}>{data.igstLabel || "IGST @ 18%"}</td>
                <td style={taxValueStyle}>{data.igst}</td>
              </tr>
            )}

            {/* Grand Total Row */}
            <tr style={{ backgroundColor: "#2563eb" }}>
              <td
                colSpan="4"
                style={{ ...totalRowStyle, textAlign: "center" }}
              >
                {data.amount_in_words}
              </td>
              <td
                style={{
                  ...totalRowStyle,
                  fontWeight: "bold",
                }}
              >
                TOTAL
              </td>
              <td
                style={{
                  ...totalRowStyle,
                  fontWeight: "bold",
                }}
              >
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

        {/* Signature / Thank You */}
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
