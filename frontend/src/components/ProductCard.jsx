import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg flex flex-col h-full">
      {/* ✅ Product Image */}
      <Link to={`/product/${product._id}`} className="block">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
      </Link>

      {/* ✅ Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-500 transition">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* ✅ Price & Button at Bottom */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-purple-600">
            ${product.price.toFixed(2)}
          </span>
          <Link
            to={`/product/${product._id}`}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
