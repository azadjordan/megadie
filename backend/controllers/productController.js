import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Get filtered products for admin view
// @route   GET /api/products/admin
// @access  Private/Admin
const getProductsAdmin = async (req, res) => {
  const { productType, categoryIds } = req.query;
  const filter = {};

  if (productType) {
    filter.productType = productType;
  }

  if (categoryIds) {
    filter.category = Array.isArray(categoryIds)
      ? { $in: categoryIds }
      : { $in: [categoryIds] };
  }

  if (req.query.attributes) {
    for (const key in req.query.attributes) {
      const values = req.query.attributes[key];
      filter[key] = {
        $in: Array.isArray(values) ? values : [values],
      };
    }
  }
  
  const products = await Product.find(filter)
    .populate("category", "name displayName productType") // ✅ helpful for admin UI
    .sort({ createdAt: -1 });

  res.json(products);
};

// @desc    Get filtered products (public-facing shop view)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { productType, categoryIds } = req.query;
  const filter = {};

  if (productType) filter.productType = productType;

  if (categoryIds) {
    filter.category = Array.isArray(categoryIds)
      ? { $in: categoryIds }
      : { $in: [categoryIds] };
  }

  if (req.query.attributes) {
    for (const key in req.query.attributes) {
      const values = req.query.attributes[key];
      filter[key] = {
        $in: Array.isArray(values) ? values : [values],
      };
    }
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category", "name displayName");

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const sample = new Product({
    name: "Sample Product",
    productType: "Ribbon",
    category: req.body.category || null,
    size: "1-inch",
    color: "Red",
    code: Date.now(), // just to ensure uniqueness
    displaySpecs: "Red | 1-inch | Made in Japan",
    origin: "Japan",
    stock: 100,
    moq: 1,
    price: 10.0,
    unit: "roll",
    images: [],
    description: "This is a sample product.",
  });

  const created = await sample.save();
  res.status(201).json(created);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.keys(req.body).forEach((key) => {
    product[key] = req.body[key] ?? product[key];
  });

  const updated = await product.save();
  res.json(updated);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product removed" });
});

export {
  getProductsAdmin,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
