import mongoose from "mongoose";

const taxRateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    hsnCode: {
        type: Number,
        required: true,
        trim: true,
        min: [1, 'HSN code cannot be less than 1'],
        max: [9999999999, 'HSN code max 10 digits possible']
    },
    taxComponentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TaxComponent"
    },
    taxRatePercentage: {
        type: Number,
        required: true,
        min: [0, 'Percentage cannot be less than 0%'],
        max: [100, 'Percentage cannot be greater than 100%'],
    },
    effectiveFrom: {
        type: Date,
        required: true,
    },
    effectiveTill: {
        type: Date,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

taxRateSchema.index({userId: 1, hsnCode: 1, taxComponentId: 1}, {unique: true});

export const TaxRate = mongoose.model("TaxRate", taxRateSchema);