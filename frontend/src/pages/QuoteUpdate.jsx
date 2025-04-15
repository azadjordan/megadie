import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetQuoteByIdQuery,
  useUpdateQuoteMutation,
} from "../slices/quotesApiSlice";
import Message from "../components/Message";

const QuoteUpdate = () => {
  const { id } = useParams();
  const { data: quote, isLoading, error } = useGetQuoteByIdQuery(id);
  const [updateQuote, { isLoading: isUpdating }] = useUpdateQuoteMutation();

  const [form, setForm] = useState({
    status: "",
    deliveryCharge: 0,
    extraFee: 0,
    totalPrice: 0,
    adminToAdminNote: "",
    AdminToClientNote: "",
  });

  useEffect(() => {
    if (quote) {
      setForm({
        status: quote.status || "Requested",
        deliveryCharge: quote.deliveryCharge || 0,
        extraFee: quote.extraFee || 0,
        totalPrice: quote.totalPrice || 0,
        adminToAdminNote: quote.adminToAdminNote || "",
        AdminToClientNote: quote.AdminToClientNote || "",
      });
    }
  }, [quote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "totalPrice" || name.includes("Charge") ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateQuote({ id, ...form }).unwrap();
      alert("Quote updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <p className="p-4 text-sm text-gray-500">Loading quote...</p>;
  if (error) return <Message type="error">Failed to load quote.</Message>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Update Quote</h2>

      <p className="text-sm text-gray-600 mb-4">
        <strong>User:</strong> {quote.user?.name} ({quote.user?.email})
      </p>

      {/* 🔹 Requested Items Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Unit Price</th>
              <th className="px-4 py-2">Qty Price</th>
            </tr>
          </thead>
          <tbody>
            {quote.requestedItems.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{item.product?.name}</td>
                <td className="px-4 py-2">{item.product?.code || "-"}</td>
                <td className="px-4 py-2">{item.product?.size}</td>
                <td className="px-4 py-2">{item.qty}</td>
                <td className="px-4 py-2">{item.unitPrice?.toFixed(2)}</td>
                <td className="px-4 py-2">{item.qtyPrice?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Update Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            {["Requested", "Quoted", "Confirmed", "Rejected"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {["deliveryCharge", "extraFee", "totalPrice"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              name={field}
              type="number"
              value={form[field]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Admin-to-Admin Note
          </label>
          <textarea
            name="adminToAdminNote"
            value={form.adminToAdminNote}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Admin-to-Client Note
          </label>
          <textarea
            name="AdminToClientNote"
            value={form.AdminToClientNote}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            rows={2}
          />
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update Quote"}
        </button>
      </form>
    </div>
  );
};

export default QuoteUpdate;
