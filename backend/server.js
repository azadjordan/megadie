import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js"; 

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// ✅ Initialize and connect to DB
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Fix CORS to allow cookies
const allowedOrigins = ["http://localhost:5173"]; // Change for production
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Middleware for JSON, form data & cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Log every request
app.use((req, res, next) => {
  console.log(`PATH: [${req.path}]      METHOD: [${req.method}]`);
  next();
});

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/quotes", quoteRoutes);

// ✅ Error Handling
app.use(notFound);
app.use(errorHandler);

// ✅ Start server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
