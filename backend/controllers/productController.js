import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("category", "name").sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category", "name");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    productType,
    category,
    size,
    color,
    code,
    displaySpecs,
    stock,
    moq,
    isAvailable,
    origin,
    storageLocation,
    price,
    unit,
    images,
    description,
  } = req.body;

  // Validate required fields
  if (!name || !productType || !category || !size || !origin || price === undefined) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  // Validate category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    res.status(400);
    throw new Error("Invalid category");
  }

  const newProduct = new Product({
    name,
    productType,
    category,
    size,
    color,
    code,
    displaySpecs,
    stock: stock ?? 0,
    moq: moq ?? 1,
    isAvailable: isAvailable ?? true,
    origin,
    storageLocation: storageLocation || "Warehouse A - Shelf 1",
    price,
    unit: unit || "roll",
    images: images || [],
    description: description || "",
  });

  const createdProduct = await newProduct.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    productType,
    category,
    size,
    color,
    code,
    displaySpecs,
    stock,
    moq,
    isAvailable,
    origin,
    storageLocation,
    price,
    unit,
    images,
    description,
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(400);
      throw new Error("Invalid category");
    }
  }

  // Update fields
  product.name = name ?? product.name;
  product.productType = productType ?? product.productType;
  product.category = category ?? product.category;
  product.size = size ?? product.size;
  product.color = color ?? product.color;
  product.code = code ?? product.code;
  product.displaySpecs = displaySpecs ?? product.displaySpecs;
  product.stock = stock ?? product.stock;
  product.moq = moq ?? product.moq;
  product.isAvailable = isAvailable ?? product.isAvailable;
  product.origin = origin ?? product.origin;
  product.storageLocation = storageLocation ?? product.storageLocation;
  product.price = price ?? product.price;
  product.unit = unit ?? product.unit;
  product.images = images ?? product.images;
  product.description = description ?? product.description;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product deleted successfully" });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
