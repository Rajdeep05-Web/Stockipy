import mongoose from "mongoose";

const taxComponentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    taxName: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    taxShortCode: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    countryCode: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TaxCountry"
    },
    taxCategory: {
        type: String,
        default: 'Consumption',
        trim: true,
    }
}, {timestamps: true});

taxComponentSchema.index(
  { userId: 1, taxShortCode: 1, countryCode: 1 },
  { unique: true }
);

export const TaxComponent = mongoose.model("TaxComponent", taxComponentSchema);