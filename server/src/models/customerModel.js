import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ""
    },
    phone: {
        type: Number,
        default: null
    },
    address: {
        type: String,
        default: ""
    },
    gstNo:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: new Date()
    }
})

export const Customer = mongoose.model('Customer', customerSchema);


