import mongoose from "mongoose";

const vendorDetailsSchema = mongoose.Schema({
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
        createdAt:{
          type: Date,
          default: new Date()
      }

})

const vendorSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    vendorsDetails: [vendorDetailsSchema],
}, { timestamps: true });

export const Vendor = mongoose.model('Vendor', vendorSchema);