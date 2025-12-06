import mongoose from "mongoose";

const taxRuleSchema = new mongoose.Schema({
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
    originZoneId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TaxSubZone"
    },
    destZoneId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TaxSubZone"
    },
    tax1ComponentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TaxComponent"
    },
    tax2ComponentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "TaxComponent"
    },
    tax3ComponentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "TaxComponent"
    },
    applicationType: { //INTRA_STATE or INTER_STATE or LOCAL or EXPORT
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {timestamps: true});

taxRuleSchema.index(
  { userId: 1, originZoneId: 1, destZoneId: 1 },
  { unique: true }
);

export const TaxRule = mongoose.model("TaxRule", taxRuleSchema);