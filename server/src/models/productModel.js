import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    // rate without gst
    rate: {
        type: Number,
        required: true,
        default: 0
    },
    // purchase rate from vendor
    productPurchaseRate:{
        type: Number,
        default: 0
    },
    //product mrp
    mrp: {
        type: Number,
        required: true,
        default: 0
    },
    productStockIns:[
        { 
            type : mongoose.Schema.Types.ObjectId,
            ref: 'StockIn',
            required: true
        }
    ],
    description: {
        type: String,
        default: ""
      
    },
    gstPercentage: {
       type: Number,
       required: true,
       default: 18
    },
    imageUrl: {
        type: String,
     
    },
});

export const Product = mongoose.model('Product', productSchema);