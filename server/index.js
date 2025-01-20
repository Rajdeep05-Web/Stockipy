import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cloudinary from "cloudinary";
import multer from "multer";
import fs from "fs";

import connectDB from "./src/DB/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

import productRouter from "./src/routes/productRouter.js";
import customerRouter from "./src/routes/customerRouter.js";
import vendorRouter from "./src/routes/vendorRouter.js";
import stockInRouter from "./src/routes/stockInRouter.js";

// MongoDB Connection
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Stockipy API");
});

//for products routing
app.use("/api", productRouter);
app.get("/v1/products", productRouter);
app.get("/v1/products/:id", productRouter);
app.post("/v1/products", productRouter);
app.put("/v1/products/:id", productRouter);
app.delete("/v1/products/:id", productRouter);

//vendor routing
app.use("/api", vendorRouter);
app.get("/v1/vendors", vendorRouter);
app.get("/v1/vendors/:id", vendorRouter);
app.post("/v1/vendors", vendorRouter);
app.put("/v1/vendors/:id", vendorRouter);
app.delete("/v1/vendors/:id", vendorRouter);

//customer routing
app.use("/api", customerRouter);
app.get("/v1/customers", customerRouter);
app.get("/v1/customers/:id", customerRouter);
app.post("/v1/customers", customerRouter);
app.put("/v1/customers/:id", customerRouter);
app.delete("/v1/customers/:id", customerRouter);

//stock In routing
app.use("/api", stockInRouter);
app.get("/v1/stock-ins", stockInRouter);
app.get("/v1/stock-ins/:id", stockInRouter);
app.post("/v1/stock-ins", stockInRouter);
app.put("/v1/stock-ins/:id", stockInRouter);
app.delete("/v1/stock-ins/:id", stockInRouter);

//cloudnary
const upload = multer({ dest: "uploads/" });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const fileType = req.file.mimetype.startsWith("image") ? "image" : "raw";
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: fileType,
    });
    fs.unlinkSync(req.file.path); // Delete the file from local storage after upload
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image upload failed" });
  }
});

// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
