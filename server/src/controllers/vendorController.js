
import { Vendor } from "../models/vendorModel.js";
import mongoose from "mongoose";

export const fetchVendors = async (req, res) => { 
    try {
        const vendors = await Vendor.find();
        return res.status(201).json(vendors);
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: error.message});
    }
};
export const fetchVendor = async (req, res) => {
    const {id} = req.params;
    if(!id){
        return res.status(400).json({error: 'ID is required'});
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid vendor ID' });
    }
    try {
        const vendor = await Vendor.findById(id);
        return res.status(200).json(vendor);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
 };
export const addVendor = async (req, res) => {
    const vendor = req.body;
    if(!vendor){
        return res.status(400).json({error: 'Vendor details is required'});
    }
      // Trim the vendor name before all checks
  if (vendor && vendor.name) {
    vendor.name = vendor.name.trim();
  }
    if(!vendor.name || !vendor.address){
        return res.status(400).json({error: 'Name and address is required'});
    }
    if(vendor.phone && parseInt(vendor.phone) < 0){
        return res.status(400).json({error: 'Phone number must be greater than 0 and 10 digits'});
    }
    if(vendor.phone && vendor.phone.length !== 10){
        return res.status(400).json({error: 'Phone number must be 10 digits'});
    }
    try {
        // Check if vendor already exists
        const existingVendors = await Vendor.find()
        if(existingVendors.length > 0){
            const isVendorPresent = existingVendors.some((v) =>
                vendor.name.toLowerCase() === v.name.toLowerCase()
            )
            if(isVendorPresent){
                return res.status(400).json({error: 'Vendor already exists'});
            }
        }
        const newVendor = new Vendor(vendor);
        await newVendor.save();
        const vendors = await Vendor.find();
        return res.status(201).json(vendors);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
 };
export const updateVendor = async (req, res) => { 
    const {id} = req.params;
    const vendor = req.body;
    if(!id || !vendor){
        return res.status(400).json({error: 'ID or Vendor details is required'});
    }
    // Trim the vendor name before all checks
    if(vendor && vendor.name){
        vendor.name = vendor.name.trim();
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid vendor ID'});
    }
    if(!vendor.name || !vendor.address){
        return res.status(400).json({error: 'Atleast name and address is required'});
    }
    if(vendor.phone && parseInt(vendor.phone) < 0){
        return res.status(400).json({error: 'Phone number must be greater than 0 and 10 digits'});
    }
    //phone no from DB is number and from req is string
    if(vendor.phone && vendor.phone.toString().length !== 10){
        return res.status(400).json({error: 'Phone number must be 10 digits'});
    }
    try {
        const existingVendors = await Vendor.find();
        if(existingVendors.length > 0){
            const isVendorPresent = existingVendors.some((v) =>
                vendor.name.toLowerCase() === v.name.toLowerCase() && v._id.toString() !== id
            )
            if(isVendorPresent){
                return res.status(400).json({error: 'Vendor already exists'});
            }
        }
        const updateVendor = await Vendor.findByIdAndUpdate(
            id,
            vendor,
            {new: true}
        );
        if (!updateVendor) {
            return res.status(404).json({ message: 'Vendor not found to update' });
          }
        return res.status(200).json(updateVendor);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
};
export const deleteVendor = async (req, res) => { 
    const {id} = req.params;
    if(!id){
        return res.status(400).json({error: 'ID is required'});
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid vendor ID'});
    }
    try {
        await Vendor.findByIdAndDelete(id);
        return res.status(200).json({message: 'Vendor deleted successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
        
    }
};