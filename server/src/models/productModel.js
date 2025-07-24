import mongoose from "mongoose";
//productSchema to productDetailsSchema
// const productDetailsSchema = mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     quantity: {
//         type: Number,
//         default: 0
//     },
//     // rate without gst
//     rate: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     // purchase rate from vendor
//     productPurchaseRate: {
//         type: Number,
//         default: 0
//     },
//     prevProductPurchaseRate: [
//         {
//             type: Object,
//             date: {
//                 type: Date,
//                 default: new Date()
//             },
//             productPurchaseRate: {
//                 type: Number,
//                 default: 0
//             }
//         }
//     ],
//     //product mrp
//     mrp: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     prevMrp: [
//         {
//             type: Object,
//             date: {
//                 type: Date,
//                 default: new Date()
//             },
//             productPurchaseRate: {
//                 type: Number,
//                 default: 0
//             }
//         }
//     ],
//     productStockIns: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'StockIn',
//             required: true
//         }
//     ],
//     description: {
//         type: String,
//         default: ""

//     },
//     gstPercentage: {
//         type: Number,
//         required: true,
//         default: 18
//     },
//     imageUrl: {
//         type: String,

//     },

// });

const productSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    // productDetails: [productDetailsSchema],
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
    productPurchaseRate: {
        type: Number,
        default: 0
    },
    prevProductPurchaseRate: [
        {
            type: Object,
            date: {
                type: Date,
                default: new Date()
            },
            productPurchaseRate: {
                type: Number,
                default: 0
            }
        }
    ],
    //product mrp
    mrp: {
        type: Number,
        required: true,
        default: 0
    },
    prevMrp: [
        {
            type: Object,
            date: {
                type: Date,
                default: new Date()
            },
            productPurchaseRate: {
                type: Number,
                default: 0
            }
        }
    ],
    productStockIns: [
        {
            type: mongoose.Schema.Types.ObjectId,
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

    }
}, { timestamps: true });

//index for faster search
productSchema.index({ userId: 1, name: 1 }, { unique: true }); // Ensure unique product names for each user
productSchema.index({ userId: 1, _id: 1 }); // Index for userId and product ID

export const Product = mongoose.model('Product', productSchema);