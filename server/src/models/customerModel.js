import mongoose from "mongoose";


const customerDetailSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    gstNo: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    stockOuts : [{ type: mongoose.Schema.Types.ObjectId, ref: "StockOut" }],
});

const customerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    customerDetails: [customerDetailSchema],
}, { timestamps: true });

// Indexes for customer schema
customerSchema.index({ userId: 1 }); 
customerSchema.index({ "customerDetails.name": 1 });
customerSchema.index({ "customerDetails.status": 1 }, {
  partialFilterExpression: { "customerDetails.status": "active" } 
});
customerSchema.index({
    //full-text search field for the user to search by name/gst.
  "customerDetails.name": "text",
  "customerDetails.gstNo": "text",
});


export const Customer = mongoose.model('Customer', customerSchema);


