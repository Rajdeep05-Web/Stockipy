import mongoose from "mongoose";

const stockInSchema = mongoose.Schema({
    vendor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
    },
    invoiceNo:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true,
        default: Date.now,
    },
    time:{
        type: String,
        default: "00:00",
    },
    totalAmount:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        default: "",
    },
    imgUrl:{
        type: String,
        default: "",
    },
    products: [
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",//reference to the Product model
                required: true,
            },
            quantity:{
                type: Number,
                required: true,
            },
            productPurchaseRate:{
                type: Number,
                required: true,
            },
        },
    ],
});

export const StockIn = mongoose.model("StockIn", stockInSchema);