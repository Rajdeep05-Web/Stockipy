import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  name: { type: String, required: true },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  gstNo: { type: String, default: "" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  stockOuts: [{ type: mongoose.Schema.Types.ObjectId, ref: "StockOut" }],
}, { timestamps: true });

// Indexes for customer schema
customerSchema.index({ userId: 1 }); 
customerSchema.index({ name: 1 }); 
customerSchema.index({ _id: 1, userId: 1 });


export const Customer = mongoose.model('Customer', customerSchema);



