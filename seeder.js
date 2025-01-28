import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./backend/models/productModel.js";
import User from "./backend/models/userModel.js";
import products from "./backend/data/products.js";
import users from "./backend/data/users.js";
import connectDB from "./backend/config/db.js"; // Assuming you have a separate db.js for database connection

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Insert users and get the admin user ID
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers.find(user => user.isAdmin)._id;

    // Assign the admin user ID to the products
    const sampleProducts = products.map(product => ({
      ...product,
      user: adminUser,
      image: "/images/sample.jpg", // Add a default image
      qty: product.quantity, // Adjust to match your schema
    }));

    await Product.insertMany(sampleProducts);

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  seedData();
}
