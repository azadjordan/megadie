import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; // ✅ Import cookie parser

dotenv.config();
import connectDB from "./config/db.js";
const port = process.env.PORT;
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ Import user routes
import orderRoutes from "./routes/orderRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

connectDB(); // Connect to MongoDB

const app = express();

// ✅ Fix CORS to allow cookies
const allowedOrigins = ["http://localhost:5173"]; // Adjust this for production
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ✅ Allow cookies to be sent
  })
);

// ✅ Middleware for parsing JSON & Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ✅ Ensure backend can read cookies

// Log every request
app.use((req, res, next) => {
  console.log(`PATH: [${req.path}]      METHOD: [${req.method}]`);
  next();
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes); // ✅ Add User Routes
app.use("/api/orders", orderRoutes);


// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
