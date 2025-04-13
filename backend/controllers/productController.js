import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

// @desc    Fetch all products (with filters)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { productType, categories, attributes } = req.query;
  console.log("Query received:", req.query);

  let query = {};

  if (productType) {
    query.productType = productType;
  }

  // Convert category names to ObjectIds
  if (categories) {
    let categoryNames = [];

    if (typeof categories === "string") {
      categoryNames = [categories];
    } else if (Array.isArray(categories)) {
      categoryNames = categories;
    }

    try {
      const categoryObjects = await Category.find({ name: { $in: categoryNames } }).select("_id");
      const categoryIds = categoryObjects.map((cat) => cat._id);
      query.category = { $in: categoryIds };
    } catch (error) {
      console.error("Error processing categories:", error);
      return res.status(500).json({ message: "Error processing categories" });
    }
  }

  // Handle attributes
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (typeof value === "string") {
        query[`attributes.${key}`] = value;
      } else if (Array.isArray(value)) {
        query[`attributes.${key}`] = { $in: value };
      }
    });
  }

  try {
    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    productType,
    category,
    stock,
    moq,
    isAvailable,
    origin,
    storageLocation,
    price,
    unit,
    images,
    description,
    size,
    color,
    code,
    displaySpecs
  } = req.body;

  // Validation
  if (!name || !productType || !origin || price === undefined || !category) {
    res.status(400);
    throw new Error("Missing required fields.");
  }

  // Validate category ID
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    res.status(400);
    throw new Error("Invalid category.");
  }

  const product = new Product({
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

  const createdProduct = await product.save();
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
    stock,
    moq,
    isAvailable,
    origin,
    storageLocation,
    price,
    unit,
    images,
    description,
    size,
    color,
    code,
    displaySpecs
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(400);
      throw new Error("Invalid category.");
    }
  }

  product.name = name || product.name;
  product.productType = productType || product.productType;
  product.category = category || product.category;
  product.size = size || product.size;
  product.color = color || product.color;
  product.code = code ?? product.code;
  product.displaySpecs = displaySpecs || product.displaySpecs;
  product.stock = stock ?? product.stock;
  product.moq = moq ?? product.moq;
  product.isAvailable = isAvailable ?? product.isAvailable;
  product.origin = origin || product.origin;
  product.storageLocation = storageLocation || product.storageLocation;
  product.price = price ?? product.price;
  product.unit = unit || product.unit;
  product.images = images || product.images;
  product.description = description || product.description;

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
    throw new Error("Product not found.");
  }

  await product.deleteOne();
  res.json({ message: "Product removed successfully." });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
