import mongoose from "mongoose";

const taxSubZoneTypeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TaxCountry"
    },
    zoneTypeName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
        uppercase: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {timestamps: true});

//user and country unique
taxSubZoneTypeSchema.index({ userId: 1, countryId: 1 }, { unique: true });
taxSubZoneTypeSchema.index({ userId: 1, countryId: 1, zoneTypeName: 1 }, { unique: true });

export const TaxSubZoneType = mongoose.model("TaxSubZoneType", taxSubZoneTypeSchema);