import mongoose from "mongoose";

const stockInSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
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
    fileCloudUrl:{
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
            mrp:{
                type: Number,
                required: true,
            }
        },
    ],
}, { timestamps: true });

// Index for faster search
stockInSchema.index({ userId: 1, _id: 1 }); // Index for userId and stock-in ID

export const StockIn = mongoose.model("StockIn", stockInSchema);