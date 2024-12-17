import mongoose from "mongoose";

const vendorSchema = mongoose.Schema({
      name:{
        type: String,
        required: true
      },
        email:{
            type: String,
        },
        phone:{
            type: Number,
        },
        address:{
            type: String,
        },
        gstNo:{
            type: String,
        },
        stockIns: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "StockIn",
            },
        ],

})

export const Vendor = mongoose.model('Vendor', vendorSchema);