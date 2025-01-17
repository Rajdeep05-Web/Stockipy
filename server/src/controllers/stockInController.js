import { StockIn } from "../models/stockInModel.js";
import { Vendor } from "../models/vendorModel.js";
import { Product } from "../models/productModel.js";
import mongoose from "mongoose";

export const addStockIn = async (req, res) => {
    // console.log(req.body);
    const {vendor, invNo, date, description, time, products, totalAmount} = req.body;//destructuring the request body
    if(!vendor || !invNo || !date || !products || !totalAmount){
        return res.status(400).json({error: "All fields are required"});
    }
    //no invalid vendor id
    if(!mongoose.Types.ObjectId.isValid(vendor)){
        return res.status(400).json({error: "Invalid Vendor ID"});
    }
    if(date === ""){
        return res.status(400).json({error: "Date is required"});
    }
    //Important
    const invoiceNo = (invNo).replace(/\s+/g, '').toUpperCase();//remove white spaces
    const utcDate = new Date(date);
    //no dupplicate invoice no
    const invoiceExists = await StockIn.findOne({invoiceNo});
    if(invoiceExists){
        return res.status(400).json({error: "Invoice No already exists"});
    }
    //no neggative or 0 quantity
    //no invalid product id
    if(products.length === 0){
        return res.status(400).json({error: "Products are required"});
    }
    if(products.length > 0 && products.some(item => !item.product || !item.quantity)){
        return res.status(400).json({error: "Product or Quantity not provided"});
    }
    if(products.length > 0 && products.some(item => !mongoose.Types.ObjectId.isValid(item.product))){
        return res.status(400).json({error: "Invalid Product ID"});
    }
    if(products.length > 0 && products.some(item => item.quantity <= 0)){
        return res.status(400).json({error: "Quantity must be greater than 0"});
    }
    if(products.length > 0 && products.some(item => item.productPurchaseRate==="")){
        return res.status(400).json({error: "Purchase Price not provided"});
    }
    if(totalAmount && totalAmount <= 0){
        return res.status(400).json({error: "Total Amount must be greater than 0"});
    }
    if(products && products.some(item => item.productPurchaseRate <= 0)){
        return res.status(400).json({error: "Purchase Price must be greater than 0"});
    }
    //no invalid date


    try {
        const newStockIn= new StockIn({
            vendor,
            invoiceNo,
            date : utcDate,
            description,
            time,
            products,
            totalAmount,
        })
        await newStockIn.save();

        //update product quantity, purchase rate and quantity
        for(const item of products){
            const product = await Product.findById(item.product);
            if(product){
                product.quantity += parseInt(item.quantity); // update quantity
                product.productPurchaseRate = parseInt(item.productPurchaseRate); // update purchase rate
                product.mrp = (item.mrp === -1 ? product.mrp : item.mrp ); // update mrp
                product.productStockIns.push(newStockIn._id); // add stockin id to product
                await product.save();
            }
        }

        //add the stockin details to the vendor
        const vendorFromDB = await Vendor.findById(vendor);
        if(vendorFromDB){
            vendorFromDB.stockIns.push(newStockIn._id);
            await vendorFromDB.save();
        }

        return res.status(201).json(newStockIn);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
        
    }
}

export const getStockIns = async (req, res) => {
    try {
    const stockIns = await StockIn.find().populate("vendor").populate("products.product", "name")//populate the vendor and product fields
    return res.status(200).json(stockIns);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

export const getStockInById = async (req, res) => {

}

export const updateStockIn = async (req, res) => {

}

export const deleteStockIn = async (req, res) => {

}