import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetInvoiceByIdQuery } from "../slices/invoicesApiSlice";
import { useAddPaymentFromInvoiceMutation } from "../slices/paymentsApiSlice";
import { toast } from "react-toastify";

const PaymentAdd = () => {
  const { id: invoiceId } = useParams();
  const navigate = useNavigate();

  const { data: invoice, isLoading, error } = useGetInvoiceByIdQuery(invoiceId);
  const [addPayment, { isLoading: isSubmitting }] = useAddPaymentFromInvoiceMutation();

  const [formState, setFormState] = useState({
    amount: "",
    paymentMethod: "Cash",
    paymentDate: new Date().toISOString().split("T")[0],
    note: "",
    paidTo: "", // ✅ Add to form state
  });

  useEffect(() => {
    if (invoice) {
      const remaining = Math.max(invoice.amountDue - invoice.amountPaid, 0);
      setFormState((prev) => ({
        ...prev,
        amount: remaining.toFixed(2),
      }));
    }
  }, [invoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const paymentAmount = parseFloat(formState.amount);

    if (!paymentAmount || paymentAmount <= 0) {
      toast.warn("Please enter a valid payment amount.");
      return;
    }

    if (!formState.paidTo || formState.paidTo.trim() === "") {
      toast.warn("Please enter who received the payment (paidTo).");
      return;
    }

    try {
      await addPayment({
        invoiceId,
        amount: paymentAmount,
        paymentMethod: formState.paymentMethod,
        note: formState.note,
        paymentDate: formState.paymentDate,
        paidTo: formState.paidTo,
      }).unwrap();

      toast.success("Payment recorded and invoice updated.");
      navigate("/admin/invoices", { state: { refetch: true } });
    } catch (err) {
      console.error("❌ Failed to add payment:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-purple-700 mb-4">
        Add Payment to Invoice
      </h1>

      {isLoading ? (
        <p>Loading invoice...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load invoice details.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 border p-4 rounded">
            <p><strong>Invoice:</strong> {invoice.invoiceNumber}</p>
            <p><strong>User:</strong> {invoice.user?.name}</p>
            <p><strong>Due:</strong> {invoice.amountDue.toFixed(2)} AED</p>
            <p><strong>Paid:</strong> {invoice.amountPaid.toFixed(2)} AED</p>
            <p><strong>Status:</strong> {invoice.status}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formState.amount}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={formState.paymentMethod}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Credit Card</option>
              <option>Cheque</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Date</label>
            <input
              type="date"
              name="paymentDate"
              value={formState.paymentDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Paid To</label>
            <input
              type="text"
              name="paidTo"
              value={formState.paidTo}
              onChange={handleChange}
              placeholder="e.g. Ali, Front Desk, Accountant"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Note (optional)</label>
            <textarea
              name="note"
              value={formState.note}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={2}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Payment"}
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentAdd;
