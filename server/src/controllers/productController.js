import { Product } from "../models/productModel.js";
import mongoose from "mongoose";

export const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getProduct = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send("ID is required");
  }
  try {
    const product = Product.findById(id);
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
export const addProduct = async (req, res) => {
  const product = req.body;
  let gstOk;
  if (!product) {
    return res.status(400).send("Product is required");
  }
  if(product.name === "" || product.rate === "" || product.mrp === "" || product.gst===""){
    return res.status(400).json({error: "Name, rate, MRP and GST are required"});
  }
  //trim the name
  if(product && product.name){
    product.name = product.name.trim();
  }
  if (product.rate <= 0 || product.mrp <= 0) {
    return res.status(400).json({error: "Rate and MRP must be greater than 0"});
  }
  if (product.rate > product.mrp) {
    return res.status(400).json({ error: "Rate cannot be greater than MRP" });
  }
  if(product.gst == 18 || product.gst == 28){
     gstOk = true;
  } else {
     gstOk = false;
  }
  if(!gstOk){
    return res.status(400).json({error: "GST can be only 18 or 28"})
  } 
  try {
    // Check if product already exists
    const oldProduct = await Product.find();
    if (oldProduct.length > 0) {
      const isProductPresent = oldProduct.some(
        (p) => product.name.toLowerCase() === p.name.toLowerCase()
      );
      if (isProductPresent) {
        return res.status(400).json({ error: "Product already exists" });
      }
    }
    const newProduct = new Product(product);
    await newProduct.save();
    const products = await Product.find();
    return res.status(201).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
export const updateProduct = async (req, res) => {
  let product = req.body;
  product = {...product, gstPercentage: product.gst}
  const { id } = req.params;
  let gstOk;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  if (!product.name || !product.rate || !product.mrp || !product.gst) {
    return res.status(400).json({ error: "Name, rate, MRP and GST are required" });
  }
  //trim the name
  if(product.name){
    product.name = product.name.trim();
  }
  if(product.rate <= 0 || product.mrp <= 0){
    return res.status(400).json({error: "Rate and MRP must be greater than 0"});
  }
  if(product.rate > product.mrp){
    return res.status(400).json({error: "Rate cannot be greater than MRP" });
  }
  if(product.gst == 18 || product.gst == 28){
    gstOk = true;
 } else {
    gstOk = false;
 }
 if(!gstOk){
   return res.status(400).json({error: "GST can be only 18 or 28"})
 } 
  try {
    //check if exist
    const products = await Product.find();
    if(products.length > 0){
        const isProductPresent = products.some((p) => p.name.toLowerCase() === product.name.toLowerCase() && p._id.toString() !== id);
        if(isProductPresent){
            return res.status(400).json({error: "Product already exists"});
        }
    }
    const updatedProduct = product;
    const updateResponse = await Product.findByIdAndUpdate(id, updatedProduct, {
      new: true,
    });
    if (!updateResponse) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(updateResponse);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
      return res.status(200).send("Product deleted");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
