import mongoose from "mongoose";

const taxCountrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    countryName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
        uppercase: true,
    },
    countryAlpha3Code: { // 3-letter country code
        type: String,
        required: true,
        trim: true,
        maxlength: 3,
        minlength: 3,
        uppercase: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {timestamps: true});


taxCountrySchema.index(
  { userId: 1, countryName: 1, countryAlpha3Code: 1},
  { unique: true }
);

export const TaxCountry = mongoose.model("TaxCountry", taxCountrySchema);