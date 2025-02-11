import { StockIn } from "../models/stockInModel.js";
import { Vendor } from "../models/vendorModel.js";
import { Product } from "../models/productModel.js";
import mongoose from "mongoose";

export const addStockIn = async (req, res) => {
    const {vendor, invNo, date, description, time, products, totalAmount, fileCloudUrl} = req.body;//destructuring the request body
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
            fileCloudUrl
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
    const stockIns = await StockIn.find().populate("vendor").populate("products.product");//populate the vendor and product fields
    return res.status(200).json(stockIns);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

export const getStockInById = async (req, res) => {

}

export const updateStockIn = async (req, res) => {
    const id = req.params.id;
    const {vendor, invNo, date, description, products, totalAmount, fileCloudUrl, isFileUpdated} = req.body;
    // console.log(vendor, invNo, date, description, products, totalAmount, fileCloudUrl);
    if(!vendor || !invNo || !date || !products || !totalAmount){
        return res.status(400).json({error: "All fields are required"});
    }
    //no invalid vendor id
    if(!mongoose.Types.ObjectId.isValid(vendor)){
        return res.status(400).json({error: "Invalid Vendor ID"});
    }
    if(!date){
        return res.status(400).json({error: "Date is required"});
    }
    //Important
    const invoiceNo = (invNo).replace(/\s+/g, '').toUpperCase();//remove white spaces
    const utcDate = new Date(date);

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

    try {
        const newStockInDataToSave = {};

        //check if the stockin is present or not in the db
        const stockInDataFromDB = await StockIn.findById(id);
        //if not present send error
        if(!stockInDataFromDB){
            return res.status(404).json({error : "Stock In not found to update"});
        }

        //compare the old and new data and update the old data with new data
        //invoce 
        if(stockInDataFromDB.invoiceNo !== invoiceNo){
           // checking if the invNo present in db with other id
           const invExists = await StockIn.findOne({invoiceNo});
           if(invExists){
            //if present send error
            return res.status(400).json({error: "Invoice No already exists"});
           } else {
            //if not present update the invoice no
            newStockInDataToSave.invoiceNo = invoiceNo;
           }
        } else {
            //if invoice no is same, no need to update
            newStockInDataToSave.invoiceNo = invoiceNo;
        }
        //date
        newStockInDataToSave.date = utcDate;
        //description
        newStockInDataToSave.description = description;
        //vendor
        newStockInDataToSave.vendor = vendor;
        //products
        newStockInDataToSave.products = products;
        //totalAmount
        if(totalAmount){

            //checking if the total amount is correct or not
            let totalAmountCalculated = 0;
            products.forEach(element => {
                totalAmountCalculated += element.quantity * element.productPurchaseRate;
            });
            if(totalAmountCalculated !== totalAmount){
                return res.status(400).json({error: "Total Amount is incorrect"});
            }
            //if total amount is changed update the total amount
            newStockInDataToSave.totalAmount = totalAmount;
        }
        //fileCloudUrl
        if((stockInDataFromDB.fileCloudUrl != fileCloudUrl) && isFileUpdated){
            //when isFileUpdated is true, update the fileCloudUrl
            newStockInDataToSave.fileCloudUrl = fileCloudUrl;
        } else {
            newStockInDataToSave.fileCloudUrl = stockInDataFromDB.fileCloudUrl;
        }

    // console.log(newStockInDataToSave);
       
    //saving the updated data
       const savedStockInData = await StockIn.findByIdAndUpdate(id, newStockInDataToSave, {
        new: true,
       });
    //    console.log(savedStockInData);

       //update vendor stock in details if vendor is changed
       if(stockInDataFromDB.vendor != vendor){
        const oldVendor = await Vendor.findById(stockInDataFromDB.vendor);
        //if the vendor is updated then delete the stockin id from old vendor stockin data
        oldVendor.stockIns = oldVendor.stockIns.filter(item => item != id);
        await oldVendor.save();
        //add the stockin id to the new vendor
        const newVendor = await Vendor.findById(vendor);
        newVendor.stockIns.push(id);
        await newVendor.save();
       }

       //update product quantity, purchase rate and quantity if they are changed
       //first check if the products are changed or not
    const oldDBproducts = JSON.stringify(stockInDataFromDB.products.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        productPurchaseRate: item.productPurchaseRate,
        mrp: item.mrp,
       })));
    const newProducts = JSON.stringify(products);
       //if producs are changed then update the product details
    if(oldDBproducts !== newProducts){
        for(const newProduct of products){
            //old product find and update
            const oldProduct = stockInDataFromDB.products.find((item)=> 
            item.product == newProduct.product);

                //if old product -> update the quanty , purchase rate and MRP in product
                const product = await Product.findById(newProduct.product);
                    //update the quantity
                    product.quantity = product.quantity - parseInt(oldProduct?.quantity ? oldProduct.quantity : 0) + parseInt(newProduct.quantity);
                    // console.log("Old Prod qntity is updated");
                    //update the purchase rate
                    product.productPurchaseRate = newProduct.productPurchaseRate;
                    // console.log("Old Prod productPurchaseRate is updated");
                    //update the mrp
                    if(newProduct.mrp != -1){
                       //update the mrp if it changed
                       product.mrp = newProduct.mrp;
                    //    console.log("Old Prod MRP is updated");
                    }
                    if(!oldProduct){
                        //if not a old product -> means new product -> add the stockin id to product stockIn array
                        product.productStockIns.push(id);
                    }
                //save the product
                await product.save();
                // console.log(product);
        }
        //check if any product is deleted in the update -> update the quantity in product
        for(const oldProduct of stockInDataFromDB.products){
            const productFound = products.find((item)=> item.product == oldProduct.product);
            if(!productFound){
                //if the old product is not found in new products -> means deleted in update ( update the quantity in product )
                const product = await Product.findById(oldProduct.product);
                product.quantity = product.quantity - parseInt(oldProduct.quantity);
                //delete from stockin array
                product.productStockIns = product.productStockIns.filter(item => item != id);
                //save the product
                await product.save();
                // console.log(product);
            }
        }

    }
    return res.status(200).json(savedStockInData);


    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
}

}

export const deleteStockIn = async (req, res) => {

}