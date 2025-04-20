import { FaPlus, FaMinus } from "react-icons/fa";

const QuantityControl = ({ quantity, setQuantity }) => {
  const handleChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setQuantity(""); // Allow clearing input
    } else {
      const parsed = parseInt(val);
      setQuantity(isNaN(parsed) ? "" : Math.max(parsed, 1));
    }
  };

  const handleBlur = () => {
    if (quantity === "" || isNaN(quantity)) {
      setQuantity(1); // Reset to 1 if empty or invalid
    }
  };

  const decrement = () => {
    const current = parseInt(quantity) || 1;
    setQuantity(Math.max(1, current - 1));
  };

  const increment = () => {
    const current = parseInt(quantity) || 1;
    setQuantity(current + 1);
  };

  return (
    <div className="flex w-fit rounded-lg border border-gray-300 overflow-hidden h-full">
      <button
        onClick={decrement}
        disabled={parseInt(quantity) <= 1}
        aria-label="Decrease quantity"
        title="Decrease quantity"
        className="bg-[#eeeeee] px-3 text-gray-500 hover:text-purple-600 hover:bg-[#e5e5e5] cursor-pointer disabled:opacity-30"
      >
        <FaMinus size={12} />
      </button>

      <input
        type="number"
        min={1}
        value={quantity}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label="Product quantity"
        title="Product quantity"
        className="no-spinner w-12 text-center text-sm font-semibold bg-white h-full py-1 focus:outline-none"
      />

      <button
        onClick={increment}
        aria-label="Increase quantity"
        title="Increase quantity"
        className="bg-[#eeeeee] px-3 text-gray-500 hover:text-purple-600 hover:bg-[#e5e5e5] cursor-pointer"
      >
        <FaPlus size={12} />
      </button>
    </div>
  );
};

export default QuantityControl;
