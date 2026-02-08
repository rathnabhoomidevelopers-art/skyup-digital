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
      className="font-poppins"
      style={{
        backgroundColor: "white",
        width: "210mm", // A4 width
        minHeight: "297mm", // A4 height
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        padding: 0, // Remove padding
        margin: 0, // Remove margin
        display: "block", // Ensures the element behaves as block to prevent inline content issues
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pt-16 pb-10 px-[60px]">
        <div>
          <h1 className="text-5xl font-extrabold text-black mb-4">INVOICE</h1>
        </div>
        <div className="text-right">
          {/* Logo */}
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
      <div className="flex justify-between mb-10 px-[60px]">
        <div className="flex-1">
          <div className="font-bold text-sm mb-2">TO:</div>
          <div className="font-bold text-sm">{data.to.split("\n")[0]}</div>
          <div className="text-sm whitespace-pre-line">
            {data.to.split("\n").slice(1).join("\n")}
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

      {/* Single Table with Items and Totals */}
      <div className="mb-6 px-4 sm:px-6 lg:px-8">
        <table className="w-full overflow-hidde2 rounded-lg ">
          <thead>
            <tr className="bg-[#fcd5ad] border-24 ">
              {/* TOP-LEFT radius */}
              <th className="rounded-tl-lg border-r-2 border-[#ffc890] px-4 py-3 text-left text-md font-semibold text-dark">
                S.No.
              </th>
              <th className="border-r-2 border-[#ffc890] px-4 py-3 text-left text-md font-semibold text-dark">
                Description
              </th>
              <th className="border-r-2 border-[#ffc890] px-4 py-3 text-center text-md font-semibold text-dark">
                Tax Rate
              </th>
              <th className="border-r-2 border-[#ffc890] px-4 py-3 text-center text-md font-semibold text-dark">
                Qty
              </th>
              <th className="border-r-2 border-[#ffc890] px-4 py-3 text-right text-md font-semibold text-dark">
                Rate
              </th>
              <th className="px-4 py-3 text-right text-md font-semibold text-dark">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Item Row */}
            <tr className="hover:bg-gray-50">
              <td className="border-r-2 border-gray-300 px-4 py-3 text-sm align-top">
                01
              </td>
              <td className="border-r-2 border-gray-300 px-4 py-3 text-sm align-top">
                {data.description}
              </td>
              <td className="border-r-2 border-gray-300 px-4 py-3 text-sm text-center align-top">
                18.00%
              </td>
              <td className="border-r-2 border-gray-300 px-4 py-3 text-sm text-center align-top">
                {data.qty}
              </td>
              <td className="border-r-2 border-gray-300 px-4 py-3 text-sm text-right align-top">
                {data.rate}
              </td>
              <td className="px-4 py-3 text-sm text-right align-top">
                {data.amount}
              </td>
            </tr>

            {/* Totals within the same table */}
            <tr className="border-t-2 border-gray-300">
              <td colSpan="4" className="px-4 py-2"></td>
              <td className="border-r-2 border-gray-300 px-4 py-2 text-sm font-medium text-right text-gray-700">
                Total
              </td>
              <td className="px-4 py-2 text-sm text-right text-gray-700">
                {data.amount}
              </td>
            </tr>
            <tr>
              <td colSpan="4" className="px-4 py-2"></td>
              <td className="border-r-2 border-gray-300 px-4 py-2 text-sm font-medium text-right text-gray-700">
                {data.cgstLabel || "CGST @ 9%"}
              </td>
              <td className="px-4 py-2 text-sm text-right text-gray-700">
                {data.cgst}
              </td>
            </tr>
            <tr>
              <td colSpan="4" className="px-4 py-2"></td>
              <td className="border-r-2 border-gray-300 px-4 py-2 text-sm font-medium text-right text-gray-700">
                {data.sgstLabel || "SGST @ 9%"}
              </td>
              <td className="px-4 py-2 text-sm text-right text-gray-700">
                {data.sgst}
              </td>
            </tr>
            <tr>
              <td colSpan="4" className="px-4 py-2"></td>
              <td className="border-r-2 border-gray-300 px-4 py-2 text-sm font-medium text-right text-gray-700">
                Round off
              </td>
              <td className="px-4 py-2 text-sm text-right text-gray-700">
                0.00
              </td>
            </tr>
            <tr className="bg-blue-600 text-white">
              <td colSpan="4" className="px-4 py-3"></td>
              <td className="border-r-2 border-blue-700 px-4 py-3 text-sm font-bold text-right">
                TOTAL
              </td>
              <td className="px-4 py-3 text-sm font-bold text-right">
                {data.total}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bank Details and Thank You Section */}
      <div className="flex justify-between items-end relative ">
        <div className="flex-1 py-10 px-[60px]">
          <div className="font-bold text-sm mb-3">BANK DETAILS</div>
          <div className="text-sm space-y-1">
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
          </div>
        </div>

        {/* Thank You with Geometric Design */}
        <div>
          <img
            src="/images/thankyou_1.webp"
            className="w-[310px]"
            alt="Thank You"
          />
        </div>
      </div>
    </div>
  );
}
