
import { Vendor } from "../models/vendorModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const fetchVendors = async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
        const exist = await Vendor.findOne({userId : userId});
        if (!exist) {
            return res.status(404).json({ error: 'User not found' });
        }
        const vendors = await Vendor.findOne({ userId: userId });
        if (!vendors?.vendorsDetails || vendors?.vendorsDetails.length === 0) {
            return res.status(404).json({ error: 'No vendors found' });
        }
        return res.status(201).json(vendors);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
};
export const fetchVendor = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    if (!userId || !ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    if (id === ":Id") {
        return res.status(400).json({ error: 'ID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid vendor ID' });
    }
    try {
        const {vendorsDetails} = await Vendor.findOne({ userId: userId, 'vendorsDetails._id': id }, { 'vendorsDetails.$': 1 });
        return res.status(200).json(vendorsDetails[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
export const addVendor = async (req, res) => {
    const userId = req.user.userId;
    const {vendor} = req.body;
    if (!userId || !ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    if (!vendor) {
        return res.status(400).json({ error: 'Vendor details is required' });
    }
    // Trim the vendor name before all checks
    if (vendor && vendor.name) {
        vendor.name = vendor.name.trim();
    }
    if (!vendor.name || !vendor.address) {
        return res.status(400).json({ error: 'Name and address is required' });
    }
    if (vendor.phone && parseInt(vendor.phone) < 0) {
        return res.status(400).json({ error: 'Phone number must be greater than 0 and 10 digits' });
    }
    if (vendor.phone && vendor.phone.length !== 10) {
        return res.status(400).json({ error: 'Phone number must be 10 digits' });
    }
    try {
        // Check if vendor already exists
        const existingVendorWithUserId = await Vendor.findOne({ userId: userId });
        if (!existingVendorWithUserId) {
            const newVendor = new Vendor({ userId, vendorsDetails: [vendor] });

            const response = await newVendor.save();
            return res.status(200).json(response);
        } else {
            const isVendorPresent = existingVendorWithUserId.vendorsDetails.some((v) =>
                vendor.name.toLowerCase() === v.name.toLowerCase()
            )
            if (isVendorPresent) {
                return res.status(400).json({ error: 'Vendor already exists' });
            }
            //check if gst is given then check if gst already exists
            const isGstPresent = existingVendorWithUserId.vendorsDetails.some((v) => vendor.gstNo && vendor.gstNo.toLowerCase() === v.gstNo.toLowerCase())
            if (isGstPresent) {
                return res.status(400).json({ error: 'Vendor GST number already exists' });
            }
            //check if phne is given then check if phone already exists
            const isPhonePresent = existingVendorWithUserId.vendorsDetails.some((v) => vendor.phone && vendor.phone.toLowerCase() === v.phone.toLowerCase())
            if (isPhonePresent) {
                return res.status(400).json({ error: 'Vendor phone number already exists' });
            }
            //check email if given
            const isEmailPresent = existingVendorWithUserId.vendorsDetails.some((v) => vendor.email && vendor.email.toLowerCase() === v.email.toLowerCase())
            if (isEmailPresent) {
                return res.status(400).json({ error: 'Customer email already exists' });
            }
            existingVendorWithUserId.vendorsDetails.push(vendor);
            const response = await existingVendorWithUserId.save();
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
export const updateVendor = async (req, res) => {
    const { id } = req.params;
    const vendor = req.body;
    if (!id || !vendor) {
        return res.status(400).json({ error: 'ID or Vendor details is required' });
    }
    // Trim the vendor name before all checks
    if (vendor && vendor.name) {
        vendor.name = vendor.name.trim();
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid vendor ID' });
    }
    if (!vendor.name || !vendor.address) {
        return res.status(400).json({ error: 'Atleast name and address is required' });
    }
    if (vendor.phone && parseInt(vendor.phone) < 0) {
        return res.status(400).json({ error: 'Phone number must be greater than 0 and 10 digits' });
    }
    //phone no from DB is number and from req is string
    if (vendor.phone && vendor.phone.toString().length !== 10) {
        return res.status(400).json({ error: 'Phone number must be 10 digits' });
    }
    try {
        const existingVendors = await Vendor.find();
        if (existingVendors.length > 0) {
            const isVendorPresent = existingVendors.some((v) =>
                vendor.name.toLowerCase() === v.name.toLowerCase() && v._id.toString() !== id
            )
            if (isVendorPresent) {
                return res.status(400).json({ error: 'Vendor already exists' });
            }
        }
        const updateVendor = await Vendor.findByIdAndUpdate(
            id,
            vendor,
            { new: true }
        );
        if (!updateVendor) {
            return res.status(404).json({ message: 'Vendor not found to update' });
        }
        return res.status(200).json(updateVendor);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
export const deleteVendor = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid vendor ID' });
    }
    try {
        await Vendor.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });

    }
};