import { Product } from "../models/productModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const fetchProducts = async (req, res) => {
  const userId = req.user.userId;
  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).send("User ID is required");
  }
  try {
    const existingProductsWithUserId = await Product.findOne({ userId: userId });
    if (existingProductsWithUserId && existingProductsWithUserId?.productDetails.length > 0) {
      return res.status(200).json(existingProductsWithUserId.productDetails);
    }
    return res.status(404).json("No products found");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getProduct = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.userId;
  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).send("User ID is required");
  }
  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).send("Product ID is required");
  }
  try {
    const response = await Product.findOne({ userId: userId }, {
      productDetails: {
        $elemMatch: { _id: id }
      }
    });
    if (!response) {
      return res.status(404).json({ error: "User not found" });
    }
    if (response.productDetails.length > 0) {
      return res.status(200).json(response.productDetails[0]);
    }
    return res.status(200).json("product not found");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
export const addProduct = async (req, res) => {
  const product = req.body;
  const userId = req.user.userId;
  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).send("User ID is required");
  }
  console.log("product", product);
  let gstOk;
  if (!product) {
    return res.status(400).send("Product is required");
  }
  if (product.name === "" || product.rate === "" || product.mrp === "" || product.gst === "") {
    return res.status(400).json({ error: "Name, rate, MRP and GST are required" });
  }
  //trim the name
  if (product && product.name) {
    product.name = product.name.trim();
  }
  if (product.rate <= 0 || product.mrp <= 0) {
    return res.status(400).json({ error: "Rate and MRP must be greater than 0" });
  }
  if (product.rate > product.mrp) {
    return res.status(400).json({ error: "Rate cannot be greater than MRP" });
  }
  if (product.gst && (product.gst == 18 || product.gst == 28)) {
    gstOk = true;
    product.gstPercentage = product.gst;
  } else {
    gstOk = false;
  }
  console.log(product.gst);
  if (!gstOk) {
    return res.status(400).json({ error: "GST can be only 18 or 28" })
  }
  try {
    //user things
    const existingProductsWithUserId = await Product.findOne({ userId: userId });

    // Check if product already exists
    if (!existingProductsWithUserId) {
      const newProduct = new Product({
        userId: userId, productDetails: [product]
      });
      await newProduct.save();
      const products = await Product.find();
      return res.status(201).json(products);
    } else {
      const isProductPresent = existingProductsWithUserId.productDetails.some(
        (p) => product.name.toLowerCase() === p.name.toLowerCase()
      );
      if (isProductPresent) {
        return res.status(400).json({ error: "Product already exists" });
      }
      existingProductsWithUserId.productDetails.push(product);
      const savedUserProducts = await existingProductsWithUserId.save();
      return res.status(201).json(savedUserProducts.productDetails);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
export const updateProduct = async (req, res) => {
  let userId = req.user.userId;
  if(!userId || !ObjectId.isValid(userId)){
    return res.status(400).send("User ID is required");
  }
  let product = req.body;
  product = { ...product, gstPercentage: product.gst }
  const { id } = req.params;
  let gstOk;
  if(id === undefined || id === null || id === "" || id ===":id") {
    return res.status(400).json({ error: "Product ID is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  if (!product.name || !product.rate || !product.mrp || !product.gst) {
    return res.status(400).json({ error: "Name, rate, MRP and GST are required" });
  }
  //trim the name
  if (product.name) {
    product.name = product.name.trim();
  }
  if (product.rate <= 0 || product.mrp <= 0) {
    return res.status(400).json({ error: "Rate and MRP must be greater than 0" });
  }
  if (product.rate > product.mrp) {
    return res.status(400).json({ error: "Rate cannot be greater than MRP" });
  }
  if (product.gst == 18 || product.gst == 28) {
    gstOk = true;
  } else {
    gstOk = false;
  }
  if (!gstOk) {
    return res.status(400).json({ error: "GST can be only 18 or 28" })
  }
  try {
    //check if exist
    const existingProductsWithUserId = await Product.findOne({ userId: userId });
    if(!existingProductsWithUserId) {
      return res.status(200).json("User not found");
    }
    if(!existingProductsWithUserId.productDetails || existingProductsWithUserId.productDetails.length === 0) {
      return res.status(200).json("No products found");
    }
    const prodIndex = existingProductsWithUserId.productDetails.findIndex(
      (product) => product._id.equals(id)
    )
    if(prodIndex === -1) {
      return res.status(400).json({ error: "Product not found" });
    }
      const isProductPresent = existingProductsWithUserId.productDetails.some((p) => p.name.toLowerCase() === product.name.toLowerCase() && !p._id.equals(id));
      if (isProductPresent) {
        return res.status(400).json({ error: "Product already exists" });
      }
      existingProductsWithUserId.productDetails[prodIndex] = {...product, _id: id };

    const updateResponse = await existingProductsWithUserId.save();
    return res.status(200).json(updateResponse.productDetails);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).send("User ID is required");
  }
  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).send("Product ID is required");
  }
  try {
    const response = await Product.findOne({ userId: userId });
    if (!response || response?.productDetails.length === 0) {
      return res.status(400).json({ error: "No products found" });
    }

    const productIndex = response.productDetails.findIndex(
      (product) => product._id.equals(id)
    );
    if(productIndex === -1) {
      return res.status(400).json({ error: "Product not found" });
    }
    response.productDetails.splice(productIndex, 1);
    const deleteRes = await response.save();
    return res.status(200).json(deleteRes.productDetails);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
