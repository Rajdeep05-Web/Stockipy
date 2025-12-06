import mongoose from "mongoose";

const taxSubZoneSchema = new mongoose.Schema({
    //_id is zone id
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
    subZoneTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TaxSubZoneType"
    },
    subZoneCode: {
        type: String,
        required: true,
        trim: true, 
        uppercase: true,
        maxlength: 2,
        minlength: 2,
    },
    isGstVatZone: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {timestamps: true});

taxSubZoneSchema.index(
  { userId: 1, countryId: 1, subZoneCode: 1},
  { unique: true }
);

export const TaxSubZone = mongoose.model("TaxSubZone", taxSubZoneSchema);