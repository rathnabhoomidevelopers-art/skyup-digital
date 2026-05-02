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

  const BORDER = "1px solid #2b2b2b";
  const cell = { border: BORDER, padding: "8px 6px" };

  const taxRows = [
    { label: "Total", value: data.subtotal, show: true },
    { label: data.cgstLabel || "CGST @ 9%", value: data.cgst, show: data.cgst > 0 },
    { label: data.sgstLabel || "SGST @ 9%", value: data.sgst, show: data.sgst > 0 },
    { label: data.igstLabel || "IGST @ 18%", value: data.igst, show: data.igst > 0 },
  ].filter((r) => r.show);

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

      {/* Table Section */}
      <div className="mb-5 px-4 sm:px-6 lg:px-8 h-[400px] flex items-center justify-center">
        <div style={{ width: "100%", position: "relative" }}>

          {/* ── Main items table ── */}
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              tableLayout: "fixed",
              textAlign: "center",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#fed7aa" }}>
                <th style={{ ...cell, width: "8%" }}>SL.No.</th>
                <th style={{ ...cell, width: "40%" }}>Description</th>
                <th style={{ ...cell, width: "12%" }}>Tax Rate</th>
                <th style={{ ...cell, width: "10%" }}>Qty</th>
                <th style={{ ...cell, width: "15%" }}>Rate</th>
                <th style={{ ...cell, width: "15%" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items &&
                data.items.map((item, index) => (
                  <tr key={index}>
                    <td style={{ ...cell, borderTop: "none" }}>{index + 1}</td>
                    <td style={{ ...cell, borderTop: "none", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {item.description}
                    </td>
                    <td style={{ ...cell, borderTop: "none" }}>18%</td>
                    <td style={{ ...cell, borderTop: "none" }}>{item.qty}</td>
                    <td style={{ ...cell, borderTop: "none" }}>{item.rate}</td>
                    <td style={{ ...cell, borderTop: "none" }}>{item.amount}</td>
                  </tr>
                ))}

              {/* Spacer rows so the table has height for tax rows beside it */}
              {taxRows.map((_, i) => (
                <tr key={`spacer-${i}`}>
                  <td style={{ border: "none", padding: "8px 6px", color: "transparent" }}>-</td>
                  <td style={{ border: "none", padding: "8px 6px" }}></td>
                  <td style={{ border: "none", padding: "8px 6px" }}></td>
                  <td style={{ border: "none", padding: "8px 6px" }}></td>
                  <td style={{ border: "none", padding: "8px 6px" }}></td>
                  <td style={{ border: "none", padding: "8px 6px" }}></td>
                </tr>
              ))}

              {/* Grand Total Row */}
              <tr style={{ backgroundColor: "#2563eb" }}>
                <td colSpan="4" style={{ border: "1px solid #1e40af", padding: "8px 6px", fontSize: "14px", color: "white" }}>
                  {data.amount_in_words}
                </td>
                <td style={{ border: "1px solid #1e40af", padding: "8px 6px", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                  TOTAL
                </td>
                <td style={{ border: "1px solid #1e40af", padding: "8px 6px", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                  {data.total}
                </td>
              </tr>
            </tbody>
          </table>

          {/* ── Tax rows overlay — separate div positioned over the right 30% ── */}
          <div
            style={{
              position: "absolute",
              right: 0,
              /* sits just below the last item row: header(~37px) + items rows */
              top: `${37 + (data.items?.length || 1) * 37}px`,
              width: "30%",
            }}
          >
            {taxRows.map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  borderLeft: BORDER,
                  borderRight: BORDER,
                  borderBottom: BORDER,
                  borderTop: i === 0 ? BORDER : "none",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    padding: "8px 6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    textAlign: "center",
                    borderRight: BORDER,
                  }}
                >
                  {row.label}
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "8px 6px",
                    fontSize: "14px",
                    color: "#374151",
                    textAlign: "center",
                  }}
                >
                  {row.value}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bank Details and Thank You Section */}
      <div className="flex justify-between">
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
        <div className="pt-6">
          <img src="/images/signature.webp" className="w-[325px]" alt="Thank You" />
        </div>
      </div>
    </div>
  );
}
