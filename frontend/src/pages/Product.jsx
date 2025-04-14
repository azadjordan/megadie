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
  FaCheck,
} from "react-icons/fa";
import Message from "../components/Message";

const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: product, error, isLoading } = useGetProductByIdQuery(id);

  const [isAdded, setIsAdded] = useState(false);
  // State to manage selected quantity
  const [quantity, setQuantity] = useState(1);
  // State to manage selected product image
  const [selectedImage, setSelectedImage] = useState("");

  // ✅ Set the first available image when the product loads
  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  // ✅ Ensure `isAvailable` is checked before adding to cart
  const handleAddToCart = () => {
    if (product && product.isAvailable && quantity > 0) {
      dispatch(addToCart({ ...product, quantity }));
      setQuantity(1);

      // ✅ Show "Added" state for 2 seconds
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 800);
    }
  };

  // ✅ Handle loading state
  if (isLoading) {
    return (
      <h2 className="text-2xl text-gray-500 text-center py-10">
        Loading product...
      </h2>
    );
  }

  // ✅ Handle error state
  if (error) {
    return (
      <Message type="error">
        {error?.data?.message || "Product not found!"}
      </Message>
    );
  }

  // ✅ Format Dimensional & Text Attributes
  const sizeAttributes = [
    product?.attributes?.d1,
    product?.attributes?.d2,
    product?.attributes?.d3,
  ]
    .filter(Boolean)
    .join(" x ");
  const textAttributes = [
    product?.attributes?.t1,
    product?.attributes?.t2,
    product?.attributes?.t3,
  ].filter(Boolean);

  return (
    <div className="container mx-auto px-6 ">
      {/* ✅ Back to Shop Button */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition mb-6"
      >
        ← Back to Shop
      </Link>

      {/* ✅ Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ✅ Product Images Section */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="relative rounded-lg overflow-hidden">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[480px] object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-[480px] flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                No Image Available
              </div>
            )}
          </div>

          {/* Thumbnails (if more images exist) */}
          {product?.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} - ${index + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer border ${
                    selectedImage === img
                      ? "border-purple-500"
                      : "border-gray-300"
                  } hover:border-purple-500 transition`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ✅ Product Info */}
        <div className="space-y-6">
          {/* ✅ Product Name, Category, and Stock Status */}
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-bold text-gray-900">
              {product?.name}
            </h1>
            <p className="text-md text-gray-500">{product?.category}</p>

            {/* ✅ Stock Indicator */}
            <div className="mt-2 flex items-center gap-2">
              {product?.isAvailable ? (
                <span className="flex items-center gap-2 px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-md">
                  <FaCheckCircle size={14} />
                  In Stock
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-md">
                  <FaTimesCircle size={14} />
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* ✅ Product Price */}
          <p className="text-3xl font-semibold text-purple-600">
            ${product?.price ? product.price.toFixed(2) : "N/A"}
          </p>

          {/* ✅ Product Description */}
          <p className="text-gray-700 text-md leading-relaxed">
            {product?.description}
          </p>

          {/* ✅ Product Attributes */}
          {(sizeAttributes || textAttributes.length > 0) && (
            <div className="text-gray-700 w-fit p-2 rounded bg-gray-100 space-y-2">
              <h3 className="text-md font-medium text-gray-800">
                Product Specifications:
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                {/* ✅ Size Attributes */}
                {sizeAttributes && (
                  <span className="text-md">{sizeAttributes}</span>
                )}

                {/* ✅ Text Attributes as Minimalist Tags */}
                {textAttributes.map((attr, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 px-3 py-1 text-sm font-medium rounded-md"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Quantity Controls */}
          <div className="flex items-center gap-4 bg-gray-100 w-fit px-4 py-2 rounded-lg border border-gray-300">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity === 1}
              className="p-3 text-gray-500 hover:text-purple-500 disabled:opacity-50 cursor-pointer"
            >
              <FaMinus size={20} />
            </button>
            <span className="text-xl font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="p-3 text-gray-500 hover:text-purple-500 cursor-pointer"
            >
              <FaPlus size={20} />
            </button>
          </div>

          {/* ✅ Add to Cart Button (Disabled if isAvailable is false) */}
          <button
            onClick={handleAddToCart}
            disabled={!product?.isAvailable || isAdded}
            className={`w-full text-lg py-3 rounded-lg font-semibold transition ${
              product?.isAvailable
                ? isAdded
                  ? "bg-green-500 text-white" // ✅ Change color when added
                  : "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            {isAdded ? (
              <span className="flex items-center justify-center gap-2 rounded-md">
                <FaCheckCircle size={20} />
                Added
              </span>
            ) : product?.isAvailable ? (
              "Add to Cart"
            ) : (
              "Out of Stock"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
