import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Product from "./models/productModel.js";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const categories = {
    "Ribbon": {
        materials: ["Polyester", "Satin", "Grosgrain"],
        sizes: ["0.5-inch", "1-inch", "2-inch"],
        colors: ["Red", "Blue", "Green", "Yellow", "Black", "White"]
    },
    "Die Ejection Rubber": {
        materials: ["Rubber"],
        sizes: ["3mm", "5mm", "8mm"],
        colors: ["Red", "Blue", "Black"]
    },
    "Creasing Matrix": {
        materials: ["Plastic", "Steel", "Aluminum"],
        sizes: ["2mm", "3mm", "4mm"],
        colors: ["Gray", "Black"]
    },
    "Magnet": {
        materials: ["Neodymium"],
        sizes: ["5mm", "10mm", "15mm"],
        colors: ["Silver", "Black"]
    },
    "Lamination Film": {
        materials: ["PET Metallized", "Matte", "Gloss"],
        sizes: ["0.7x2000m", "0.69x2000m", "0.64x120m"],
        colors: ["Transparent"]
    }
};

// ✅ Generate a random product
const generateRandomProduct = () => {
    const category = Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)];
    const specs = categories[category];

    return {
        name: `${category} ${Math.floor(100 + Math.random() * 900)}`,
        category,
        material: specs.materials[Math.floor(Math.random() * specs.materials.length)],
        size: specs.sizes[Math.floor(Math.random() * specs.sizes.length)],
        color: specs.colors[Math.floor(Math.random() * specs.colors.length)],
        description: `High-quality ${category.toLowerCase()} for industrial use.`,
        price: (Math.random() * (100 - 5) + 5).toFixed(2),
        stock: Math.floor(Math.random() * 50) + 1,
        isAvailable: true,
        image: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`
    };
};

// ✅ Seed Products Function
const seedProducts = async () => {
    try {
        console.log("⚡ Connecting to MongoDB...");
        await connectDB(); // ✅ Ensure connection is established

        // ✅ Log the actual MongoDB host
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);

        console.log("🗑 Deleting existing products...");
        await Product.deleteMany();
        console.log("✅ All products deleted.");

        const numberOfProducts = Math.floor(Math.random() * (40 - 30 + 1)) + 30;
        const sampleProducts = Array.from({ length: numberOfProducts }, generateRandomProduct);

        console.log(`🛒 Seeding ${numberOfProducts} new products...`);
        await Product.insertMany(sampleProducts);
        console.log("🎉 Products successfully seeded!");

        mongoose.connection.close(); // ✅ Close connection after operation
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

// Run the script
seedProducts();
