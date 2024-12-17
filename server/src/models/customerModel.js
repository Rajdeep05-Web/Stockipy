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
    }
})

export const Customer = mongoose.model('Customer', customerSchema);


