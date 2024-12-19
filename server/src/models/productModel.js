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
    rate: {
        type: Number,
        required: true,
        default: 0
    },
    // productPurchaseRate:{
    //     type: Number,
    //     default: 0
    // },
    mrp: {
        type: Number,
        required: true,
        default: 0
    },
    description: {
        type: String,
        default: ""
      
    },
    imageUrl: {
        type: String,
     
    },
});

export const Product = mongoose.model('Product', productSchema);