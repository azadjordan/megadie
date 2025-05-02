import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetQuoteByIdQuery,
  useUpdateQuoteMutation,
} from "../slices/quotesApiSlice";
import { useGetUsersQuery } from "../slices/usersApiSlice"; // ✅ Import users query
import Message from "../components/Message";
import { toast } from "react-toastify";

const QuoteUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: quote, isLoading, error } = useGetQuoteByIdQuery(id);
  const { data: users = [] } = useGetUsersQuery(); // ✅ Fetch users
  const [updateQuote, { isLoading: isUpdating }] = useUpdateQuoteMutation();

  const [form, setForm] = useState({
    user: "",
    status: "",
    deliveryCharge: 0,
    extraFee: 0,
    totalPrice: 0,
    adminToAdminNote: "",
    AdminToClientNote: "",
    requestedItems: [],
  });

  useEffect(() => {
    if (quote) {
      setForm({
        user: quote.user?._id || "", // ✅ Set initial user ID
        status: quote.status || "",
        deliveryCharge: quote.deliveryCharge || 0,
        extraFee: quote.extraFee || 0,
        adminToAdminNote: quote.adminToAdminNote || "",
        AdminToClientNote: quote.AdminToClientNote || "",
        requestedItems: quote.requestedItems.map((item) => ({
          product: item.product,
          qty: item.qty,
          unitPrice: item.unitPrice,
          qtyPrice: item.unitPrice * item.qty,
        })),
        totalPrice: quote.totalPrice || 0,
      });
    }
  }, [quote]);

  useEffect(() => {
    const itemsTotal = form.requestedItems.reduce(
      (sum, item) => sum + item.qtyPrice,
      0
    );
    setForm((prev) => ({
      ...prev,
      totalPrice:
        itemsTotal + Number(prev.deliveryCharge) + Number(prev.extraFee),
    }));
  }, [form.requestedItems, form.deliveryCharge, form.extraFee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "deliveryCharge" || name === "extraFee"
          ? Number(value)
          : value,
    }));
  };

  const handlePriceChange = (index, newPrice) => {
    const updatedItems = [...form.requestedItems];
    const unitPrice = parseFloat(newPrice) || 0;
    const qty = updatedItems[index].qty;
    updatedItems[index].unitPrice = unitPrice;
    updatedItems[index].qtyPrice = unitPrice * qty;

    setForm((prev) => ({
      ...prev,
      requestedItems: updatedItems,
    }));
  };

  const handleQtyChange = (index, newQty) => {
    const updatedItems = [...form.requestedItems];
    const qty = parseInt(newQty) || 0;
    const unitPrice = updatedItems[index].unitPrice;
    updatedItems[index].qty = qty;
    updatedItems[index].qtyPrice = unitPrice * qty;

    setForm((prev) => ({
      ...prev,
      requestedItems: updatedItems,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateQuote({ id, ...form }).unwrap();
      toast.success("Quote updated successfully!");
      navigate("/admin/quotes", { state: { refetch: true } });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quote.");
    }
  };

  if (isLoading)
    return <p className="p-4 text-sm text-gray-500">Loading quote...</p>;
  if (error) return <Message type="error">Failed to load quote.</Message>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">
        Update Quote
      </h2>

      {/* 🔹 Select User */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">User</label>
        <select
          name="user"
          value={form.user}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Order Created / Order ID */}
      <div className="mb-6 text-sm text-gray-700 space-y-1">
        <div>
          <strong>Order Created:</strong>{" "}
          {quote.isOrderCreated ? (
            <span className="text-green-600 font-medium">Yes</span>
          ) : (
            <span className="text-gray-500">No</span>
          )}
        </div>
        {quote.createdOrderId && (
          <div>
            <strong>Order ID:</strong>{" "}
            <span className="text-blue-600">{quote.createdOrderId}</span>
          </div>
        )}
      </div>

      {/* 🔹 Requested Items Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Unit Price (AED)</th>
              <th className="px-4 py-2">Qty Price</th>
            </tr>
          </thead>
          <tbody>
            {form.requestedItems.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{item.product?.name}</td>
                <td className="px-4 py-2">{item.product?.code || "-"}</td>
                <td className="px-4 py-2">{item.product?.size}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleQtyChange(idx, e.target.value)}
                    className="w-16 border rounded px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handlePriceChange(idx, e.target.value)}
                    className="w-24 border rounded px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-4 py-2">{item.qtyPrice.toFixed(2)}</td>
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
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {["deliveryCharge", "extraFee"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              name={field}
              type="number"
              step="0.01"
              value={form[field]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Price (Auto)
          </label>
          <input
            type="number"
            value={form.totalPrice.toFixed(2)}
            disabled
            className="w-full bg-gray-100 border rounded px-3 py-2 text-sm"
          />
        </div>

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
