import { useParams, Link } from "react-router-dom";
import { useGetProductByIdQuery } from "../slices/productsApiSlice";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import QuantityControl from "../components/QuantityControl";
import Message from "../components/Message";

const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: product, error, isLoading } = useGetProductByIdQuery(id);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product && product.isAvailable && quantity > 0) {
      dispatch(addToCart({ ...product, quantity }));
      setQuantity(product.moq || 1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 800);
    }
  };

  if (isLoading)
    return <p className="text-center py-10 text-gray-500">Loading product...</p>;
  if (error)
    return (
      <Message type="error">
        {error?.data?.message || "Product not found"}
      </Message>
    );

  const image = selectedImage || "/placeholder.jpg";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link
        to="/shop"
        className="inline-block mb-6 text-sm text-purple-600 hover:underline"
      >
        ← Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Images */}
        <div>
          <div className="rounded overflow-hidden border mb-4">
            <img
              src={image}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 flex-wrap">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border transition ${
                    selectedImage === img
                      ? "border-purple-500 ring-2 ring-purple-200"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="bg-white p-2 rounded-xl  space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Category:</span> {product.category?.name || "N/A"}
            </p>
            <div>
              {product.isAvailable ? (
                <span className="inline-block text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  In Stock
                </span>
              ) : (
                <span className="inline-block text-xs font-semibold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                  Currently Unavailable
                </span>
              )}
            </div>
          </div>

          {product.displaySpecs && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Features</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {product.displaySpecs.split("\n").map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {product.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="bg-yellow-100 rounded px-2 w-fit">
            <p className="text-sm text-gray-700">
              <span className="font-medium text-gray-800">MOQ:</span> {product.moq} units
            </p>
          </div>

          <div className="pt-2">
            <div className="flex flex-row gap-4">
            <QuantityControl quantity={quantity} setQuantity={setQuantity} />
            <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable || isAdded}
                className={` px-6 py-3 text-md font-semibold rounded-md transition ${
                  !product.isAvailable
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isAdded
                    ? "bg-green-500 text-white"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {isAdded ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaCheck /> Added to Cart
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FaShoppingCart /> Add to Cart
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;