import { useParams, Link } from "react-router-dom";
import { useGetProductByIdQuery } from "../slices/productsApiSlice";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaMinus,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Message from "../components/Message";

const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: product, error, isLoading } = useGetProductByIdQuery(id);

  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product && product.isAvailable && quantity > 0) {
      dispatch(addToCart({ ...product, quantity }));
      setQuantity(1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 800);
    }
  };

  if (isLoading) return <p className="text-center py-10 text-gray-500">Loading product...</p>;
  if (error) return <Message type="error">{error?.data?.message || "Product not found"}</Message>;

  return (
    <div className="container mx-auto px-6">
      <Link to="/shop" className="inline-block mb-6 text-sm text-purple-600 hover:underline">← Back to Shop</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="rounded overflow-hidden border mb-4">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} className="w-full h-[480px] object-cover" />
            ) : (
              <div className="w-full h-[480px] flex items-center justify-center bg-gray-100 text-gray-500">
                No image available
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border ${selectedImage === img ? "border-purple-500" : "border-gray-300"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500">
            Category: {product.category?.name || "N/A"}
          </p>

          <div className="flex items-center gap-2">
            {product.isAvailable ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <FaCheckCircle /> In Stock
              </span>
            ) : (
              <span className="text-red-600 font-medium flex items-center gap-1">
                <FaTimesCircle /> Out of Stock
              </span>
            )}
          </div>

          <p className="text-2xl font-semibold text-purple-600">
            {product.price?.toFixed(2)} AED
          </p>

          {product.description && (
            <p className="text-gray-700">{product.description}</p>
          )}

          {/* Specs */}
          <div className="text-sm text-gray-800 bg-gray-100 rounded p-4 space-y-2">
            <h3 className="font-semibold mb-1">Product Specs:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Size: {product.size}</li>
              <li>Color: {product.color}</li>
              <li>Code: {product.code}</li>
              <li>Origin: {product.origin}</li>
              <li>MOQ: {product.moq}</li>
              <li>Stock: {product.stock}</li>
              <li>Storage: {product.storageLocation}</li>
              <li>Unit: {product.unit}</li>
            </ul>
          </div>

          {/* Quantity and Cart */}
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 border px-4 py-2 rounded">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity === 1}
                className="text-gray-500 hover:text-purple-600"
              >
                <FaMinus />
              </button>
              <span className="font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="text-gray-500 hover:text-purple-600"
              >
                <FaPlus />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable || isAdded}
              className={`px-5 py-2 rounded font-medium transition ${
                !product.isAvailable
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isAdded
                  ? "bg-green-500 text-white"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isAdded ? "✔ Added" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
