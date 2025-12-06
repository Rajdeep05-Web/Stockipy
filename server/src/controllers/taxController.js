import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import { TaxCountry } from "../models/tax/taxCountryModel.js";
import { TaxSubZone } from "../models/tax/taxZoneModel.js";
import { TaxSubZoneType } from "../models/tax/taxZoneTypeModel.js";
import { TaxComponent } from "../models/tax/taxComponentModel.js";
import { TaxRate } from "../models/tax/taxRateModel.js";
import { TaxRule } from "../models/tax/taxRuleModel.js";

//country code controllers ------------------------------------
export const addCountryAndCode = async (req, res) => {
  const { userId } = req.params;
  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const { countryName, countryAlpha3Code } = req.body;

  //name and code validity check
  if (
    !countryAlpha3Code ||
    !countryName ||
    countryName.trim().length === 0 ||
    countryAlpha3Code.trim().length === 0
  ) {
    return res.status(400).json({ error: "Country name or code is missing" });
  }

  if (countryAlpha3Code.length != 3 || countryName.length > 20) {
    return res.status(400).json({ error: "Country name or code is too long" });
  }

  if (/[^a-zA-Z\s]/.test(countryName) || /[^a-zA-Z]/.test(countryAlpha3Code)) {
    return res
      .status(400)
      .json({ error: "Country name or code contains invalid characters" });
  }

  try {
    //w can check for any one of them as both are unique
    const countryCountByName = await TaxCountry.findOne({
      userId: userId,
      countryName: countryName,
    });
    if (countryCountByName) {
      //we found a country with same name, so we dont check for country code
      return res
        .status(400)
        .json({ error: "Country name or code already exists" });
    } else {
      //we didnt find by name, so check by code
      const countryCountByCode = await TaxCountry.findOne({
        userId: userId,
        countryAlpha3Code: countryAlpha3Code,
      });
      if (countryCountByCode) {
        return res
          .status(400)
          .json({ error: "Country name or code already exists" });
      }
    }

    //no country found with same name or code, we can add new
    const newCountryData = new TaxCountry({
      userId: userId,
      countryAlpha3Code: countryAlpha3Code,
      countryName: countryName,
    });
    await newCountryData.save();

    return res
      .status(201)
      .json({ message: "Country saved successfully", data: newCountryData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while adding new country: ${error.message}` });
  }
};

export const getAllCountriesAndCodes = async (req, res) => {
  const { userId } = req.params;
  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "User ID is required" });
  }
  //find all countries for the user
  try {
    const allCountries = (await TaxCountry.find({ userId: userId })).sort(
      (a, b) => a.countryName.localeCompare(b.countryName)
    ); //sort alphabetically by country name

    if (allCountries.length === 0) {
      return res.status(404).json({ error: "No countries found" });
    }
    return res
      .status(200)
      .json({ meassage: "Countries fetched successfully", data: allCountries });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while fetching countries: ${error.message}` });
  }
};

export const updateCountryAndCode = async (req, res) => {
  const { userId, countryId } = req.params;
  if (
    !userId ||
    !ObjectId.isValid(userId) ||
    !countryId ||
    !ObjectId.isValid(countryId)
  ) {
    return res
      .status(400)
      .json({ error: "User ID and Country ID are required" });
  }
  const { countryName, countryAlpha3Code, isActive } = req.body;

  //update only the fields that are passed
  const updateData = {};

  if (countryName && countryName.trim().length > 0) {
    if (/[^a-zA-Z\s]/.test(countryName)) {
      return res
        .status(400)
        .json({ error: "Country name contains invalid characters" });
    }
    const countryCountByName = await TaxCountry.findOne({
      //findOne is better here as we just need to know if it exists
      userId: userId,
      countryName: countryName.toUpperCase(),
    });
    if (countryCountByName) {
      //we found a country with same name, so we dont check for country code
      return res.status(400).json({ error: "Country name already exists" });
    }
    updateData.countryName = countryName.toUpperCase();
  }

  if (countryAlpha3Code && countryAlpha3Code.trim().length == 3) {
    if (/[^a-zA-Z]/.test(countryAlpha3Code)) {
      return res
        .status(400)
        .json({ error: "Country code contains invalid characters" });
    }
    const countryCountByCode = await TaxCountry.findOne({
      userId: userId,
      countryAlpha3Code: countryAlpha3Code.toUpperCase(),
    });
    if (countryCountByCode) {
      return res.status(400).json({ error: "Country code already exists" });
    }
    updateData.countryAlpha3Code = countryAlpha3Code.toUpperCase();
  } else if (countryAlpha3Code && countryAlpha3Code.trim().length != 3) {
    return res
      .status(400)
      .json({ error: "Country code must be exactly 3 characters long" });
  }

  if (isActive && typeof isActive === "boolean") {
    updateData.isActive = isActive;
  } else if (isActive && typeof isActive !== "boolean") {
    return res.status(400).json({ error: "isActive must be a boolean value" });
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  try {
    const updatedCountry = await TaxCountry.findOneAndUpdate(
      { _id: countryId, userId: userId },
      { $set: updateData },
      { new: true } // return the updated document
    );
    if (!updatedCountry) {
      return res.status(404).json({ error: "Country not found" });
    }
    return res
      .status(200)
      .json({ message: "Country updated successfully", data: updatedCountry });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while updating country: ${error.message}` });
  }
};

export const deleteCountryAndCode = async (req, res) => {
  //to be implemented later if needed - dangerous operation
};

//tax zone type controllers ------------------------------------
export const addTaxSubZoneType = async (req, res) => {
  const { userId } = req.params;
  const { countryId, zoneTypeName } = req.body;

  //sample data
  // countryId = "64b8f2f5e1d3c2a5f4b6c7d8"; - country ObjectId
  // zoneTypeName = "STATE"; - state / region / province etc.

  //validations
  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "User ID is required" });
  }
  if (!countryId || !ObjectId.isValid(countryId)) {
    return res.status(400).json({ error: "Country ID is required" });
  }
  if (!zoneTypeName || zoneTypeName.trim().length === 0) {
    return res.status(400).json({ error: "Zone type name is required" });
  }
  if (zoneTypeName.length > 15) {
    return res.status(400).json({ error: "Zone type name is too long" });
  }

  try {
    //data dupplicity and reference check
    //check country exists for the user
    const isCountryValid = await TaxCountry.findOne({
      userId: userId,
      _id: countryId,
    });
    if (!isCountryValid) {
      return res.status(400).json({ error: "Invalid country ID" });
    }

    //checked it though schema index will take care of it
    //check same zone type exists for the user and country
    //    const isUserAndCountryExist = await TaxSubZoneType.findOne({
    //         userId: userId,
    //         countryId: countryId,
    //     });
    //     if(isUserAndCountryExist) {
    //         return res.status(400).json({ error: "Only one zone type allowed per country" });
    //     }

    //check zone type name uniqueness for the user and country
    // const isZoneTypeExistForCountry = await TaxSubZoneType.findOne({
    //     userId: userId,
    //     countryId: countryId,
    //     zoneTypeName: zoneTypeName.toUpperCase(),
    // })
    // if (isZoneTypeExistForCountry) {
    //     return res.status(400).json({ error: "Zone type name already exists for the given country" });
    // }

    const newZoneTypeData = new TaxSubZoneType({
      userId: userId,
      countryId: countryId,
      zoneTypeName: zoneTypeName.toUpperCase(),
    });
    await newZoneTypeData.save();

    return res
      .status(201)
      .json({
        message: "Tax zone type saved successfully",
        data: newZoneTypeData,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        error: `Error while adding new tax zone type: ${error.message}`,
      });
  }
};

export const getAllTaxZoneTypes = async (req, res) => {
  const { userId } = req.params;
  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "User ID is required" });
  }
  //find all zone types for the user
  try {
    const allZoneTypes = await TaxSubZoneType.find({ userId: userId }).populate(
      "countryId",
      "countryName countryAlpha3Code -_id"
    ); //populate country details

    if (allZoneTypes.length === 0) {
      return res.status(404).json({ error: "No tax zone types found" });
    }
    return res
      .status(200)
      .json({
        meassage: "Tax zone types fetched successfully",
        data: allZoneTypes,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while fetching tax zone types: ${error.message}` });
  }
};

export const updateTaxZoneType = async (req, res) => {
  //to be implemented later if needed
};

export const deleteTaxZoneType = async (req, res) => {
  //to be implemented later if needed - dangerous operation
};

//tax zone controllers ------------------------------------
export const addTaxZone = async (req, res) => {
  const { userId } = req.params;
  const { countryId, subZoneTypeId, subZoneCode, isGstVatZone } = req.body;

  //example data
  // countryId = "64b8f2f5e1d3c2a5f4b6c7d8"; - country ObjectId
  // subZoneTypeId = "64b8f2f5e1d3c2a5f4b6c7d9"; - populate by state / region / province etc.
  // subZoneCode = "CA"; - 2-letter code for the sub zone
  // isGstVatZone = true; - boolean(optional)

  //validations
  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "User ID is required" });
  }
  if (!countryId || !ObjectId.isValid(countryId)) {
    return res.status(400).json({ error: "Country ID is required" });
  }
  if (!subZoneTypeId || !ObjectId.isValid(subZoneTypeId)) {
    return res.status(400).json({ error: "Sub zone type ID is required" });
  }
  if (!subZoneCode || subZoneCode.trim().length === 0) {
    return res.status(400).json({ error: "Sub zone code is required" });
  }
  if (subZoneCode.length != 2) {
    return res
      .status(400)
      .json({
        error:
          "Sub zone code must be exactly 2 characters long for any country",
      });
  }
  if (/[^a-zA-Z\s]/.test(subZoneCode)) {
    return res
      .status(400)
      .json({ error: "Sub zone code contains invalid characters" });
  }
  if (isGstVatZone && typeof isGstVatZone !== "boolean") {
    return res
      .status(400)
      .json({ error: "isGstVatZone must be a boolean value" });
  }

  try {
    //data dupplicity and reference check
    //check country exists for the user
    const countryValid = await TaxCountry.findOne({
      userId: userId,
      _id: countryId,
    });
    if (!countryValid) {
      return res.status(400).json({ error: "Invalid country ID" });
    }
    //check the zone type exists for the user and country
    const subZoneTypewithCountryValid = await TaxSubZoneType.findOne({
      userId: userId,
      countryId: countryId,
      _id: subZoneTypeId,
    });
    if (!subZoneTypewithCountryValid) {
      return res
        .status(400)
        .json({ error: "Invalid sub zone type ID for the given country" });
    }
    //unique index in schema will take care of dupplicity
    //check sub zone code uniqueness for the user - some countries may have same sub zone codes
    // const zoneCodeExist = await TaxSubZone.findOne({
    //     userId: userId,
    //     subZoneCode: subZoneCode.toUpperCase(),
    //     countryId: countryId,
    //     subZoneTypeId: subZoneTypeId,
    // });
    // if (zoneCodeExist) {
    //     return res.status(400).json({ error: "Sub zone code already exists for the given country and zone type" });
    // }

    const newZoneData = new TaxSubZone({
      userId: userId,
      countryId: countryId,
      subZoneTypeId: subZoneTypeId,
      subZoneCode: subZoneCode.toUpperCase(),
      isGstVatZone: isGstVatZone || false,
    });
    await newZoneData.save();

    return res
      .status(201)
      .json({ message: "Tax zone saved successfully", data: newZoneData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while adding new tax zone: ${error.message}` });
  }
};

export const getAllTaxZonesPerCountry = async (req, res) => {
  const { userId, countryId } = req.params;
  if (
    !userId ||
    !ObjectId.isValid(userId) ||
    !countryId ||
    !ObjectId.isValid(countryId)
  ) {
    return res.status(400).json({ error: "Invalid user id or country id" });
  }

  try {
    const taxZonePerCountryData = await TaxSubZone.find({
      userId: userId,
      countryId: countryId,
    })
      .populate("countryId", "countryName -_id")
      .populate("subZoneTypeId", "zoneTypeName -_id");
    return res
      .status(201)
      .json({
        message: "Tax zones fetched successfully",
        data: taxZonePerCountryData,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while fetching tax zones: ${error.message}` });
  }
};

export const updateTaxZone = async (req, res) => {};

export const deleteTaxZone = async (req, res) => {};

//tax component controllers
export const addTaxComponent = async (req, res) => {
  const { userId } = req.params;
  const { taxName, countryId, taxShortCode, taxCategory } = req.body;

  if (
    !userId ||
    !countryId ||
    !ObjectId.isValid(userId) ||
    !ObjectId.isValid(countryId)
  ) {
    return res.status(400).json({ error: "Invalid User id or country id" });
  }
  if (!taxName || taxName.trim().length === 0) {
    return res.status(400).json({ error: "Complete tax name is required" });
  }
  if (!taxShortCode || taxShortCode.trim().length === 0) {
    return res.status(400).json({ error: "Tax short code is required" });
  }
  if (/[^a-zA-Z]/.test(taxShortCode)) {
    //false if contains only (a-z, A-Z)
    return res
      .status(400)
      .json({ error: "Tax short code contains invalid characters" });
  }
  if (taxShortCode.trim().length > 6) {
    return res.status(400).json({ error: "Tax short code is too long" });
  }
  if (taxShortCode.trim().length <= 2) {
    return res.status(400).json({ error: "Tax short code is too short" });
  }
  if (taxName.trim().length > 50) {
    return res.status(400).json({ error: "Tax name is too long" });
  }

  try {
    //check country should exist for user
    const country = await TaxCountry.findOne({
      userId: userId,
      _id: countryId,
    });
    if (!country) {
      return res.status(404).json({ error: "No resource found" });
    }
    //check tax exist, no dupplicate allowed
    const taxExist = await TaxComponent.findOne({
      userId: userId,
      countryCode: countryId,
      taxShortCode: taxShortCode.toUpperCase(),
    });
    if (taxExist) {
      return res
        .status(404)
        .json({ error: "Tax already exists for given country" });
    }

    const newTaxComp = new TaxComponent({
      userId: userId,
      taxName: taxName.toUpperCase(),
      taxShortCode: taxShortCode.toUpperCase(),
      countryCode: countryId,
      taxCategory: taxCategory || "Consumption",
    });
    await newTaxComp.save();

    return res
      .status(201)
      .json({ message: "Tax component saved successfully.", data: newTaxComp });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        error: `Error while adding new tax component: ${error.message}`,
      });
  }
};

export const getTaxComponents = async (req, res) => {
  const { userId, countryId } = req.params;
  if (
    !userId ||
    !countryId ||
    !ObjectId.isValid(userId) ||
    !ObjectId.isValid(countryId)
  ) {
    return res.status(400).json({ error: "Invalid user id or country id" });
  }

  try {
    const taxComps = await TaxComponent.find({
      userId: userId,
      countryCode: countryId,
    }).populate("countryCode", "countryAlpha3Code");

    if (taxComps.length === 0) {
      return res.status(400).json({ error: "No resource found" });
    }

    return res
      .status(200)
      .json({ message: "Tax components fetched successfully", data: taxComps });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while adding new tax zone: ${error.message}` });
  }
};

export const updateTaxComp = async (req, res) => {
  const { userId, taxComponentId } = req.params;
  const { taxName, taxShortCode, taxCategory } = req.body;

  if (
    !userId ||
    !taxComponentId ||
    !ObjectId.isValid(userId) ||
    !ObjectId.isValid(taxComponentId)
  ) {
    return res.status(400).json({ error: "Invalid User id or country id" });
  }

  const updateData = {};

  if (taxName && taxName.trim().length === 0) {
    return res.status(400).json({ error: "Complete tax name is required" });
  } else if (taxName && taxName.trim().length > 50) {
    return res.status(400).json({ error: "Tax name is too long" });
  } else if (taxName) {
    updateData.taxName = taxName;
  }

  if (taxShortCode) {
    if (taxShortCode.trim().length === 0 || /[^a-zA-Z]/.test(taxShortCode)) {
      return res
        .status(400)
        .json({ error: "Tax short code contains invalid characters" });
    }
    if (taxShortCode.trim().length > 6) {
      return res.status(400).json({ error: "Tax short code is too long" });
    }
    if (taxShortCode.trim().length <= 2) {
      return res.status(400).json({ error: "Tax short code is too short" });
    }
    updateData.taxShortCode = taxShortCode.toUpperCase();
  }

  if (taxCategory) {
    if (taxCategory.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Tax category contains invalid characters" });
    }
    updateData.taxCategory = taxCategory;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  try {
    //dupplicate tax code not allowed per country - checked by schema

    const newTaxComp = await TaxComponent.findOneAndUpdate(
      { userId: userId, _id: taxComponentId },
      { $set: updateData },
      { new: true }
    );
    if (!newTaxComp) {
      return res.status(404).json({ error: "No data found to update" });
    }

    return res
      .status(200)
      .json({
        message: "Tax component updated successfully.",
        data: newTaxComp,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        error: `Error while adding new tax component: ${error.message}`,
      });
  }
};

export const deleteTaxComp = async (req, res) => {
  const { userId, taxComponentId } = req.params;

  if (
    !userId ||
    !taxComponentId ||
    !ObjectId.isValid(userId) ||
    !ObjectId.isValid(taxComponentId)
  ) {
    return res.status(400).json({ error: "Invalid User id or country id" });
  }

  try {
    const deleteData = await TaxComponent.findOneAndDelete({
      userId: userId,
      _id: taxComponentId,
    });
    if (!deleteData) {
      return res.status(404).json({ error: "No resource found to delete" });
    }

    return res
      .status(200)
      .json({ message: "Tax component deleted sucessfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while deleting tax component: ${error.message}` });
  }
};

//tax rate controllers ------------------------------------
export const addTaxRateAndHSN = async (req, res) => {
  const userId = req.user.userId;
  const {
    taxComponentId,
    hsnCode,
    taxRatePercentage,
    effectiveFrom,
    effectiveTill,
  } = req.body;

  if (
    !userId ||
    !taxComponentId ||
    !ObjectId.isValid(userId) ||
    !ObjectId.isValid(taxComponentId)
  ) {
    return res
      .status(400)
      .json({ error: "Invalid User id or tax component id" });
  }

  if (!hsnCode) {
    return res.status(400).json({ error: "HSN code required" });
  }
  //we are accepting hsn as string or number, and saving as number at end
  if (typeof hsnCode === "string") {
    if (hsnCode.trim().length === 0)
      return res.status(400).json({ error: "HSN code required" });
    else if (hsnCode.length > 10)
      return res
        .status(400)
        .json({ error: "Hsn code max size 10" }); //max limit 10 for string
    else if (/[^0-9]/.test(hsnCode))
      return res.status(400).json({ error: "Invalid hsn code" });
  } else if (typeof hsnCode !== "number") {
    return res.status(400).json({ error: "Hsn code must be number type" });
  } else {
    //hsn is number case
    if (hsnCode > 9999999999)
      return res.status(400).json({ error: "Hsn code max digit limit 10" }); //max digin timit 10 for type number
  }

  //we are accepting tax rate as string or number, and saving as number at end
  if (!taxRatePercentage) {
    return res.status(400).json({ error: "Tax rate required" });
  }
  if (typeof taxRatePercentage === "string") {
    //string and number allowed
    if (taxRatePercentage.trim().length === 0)
      return res.status(400).json({ error: "Tax rate required" });
    else if (taxRatePercentage.length > 3)
      return res.status(400).json({ error: "Tax rate max size 3" });
    else if (/[^0-9]/.test(taxRatePercentage))
      return res.status(400).json({ error: "Invalid tax rate" });
  } else if (typeof taxRatePercentage !== "number") {
    return res.status(400).json({ error: "Tax rate must be number type" });
  }

  if (!effectiveFrom) {
    return res
      .status(400)
      .json({ error: "Tax rate effective from date needed" });
  }

  try {
    //validate if the tax comp valid or not
    const isUserWithTaxCompExists = await TaxComponent.findOne({
      userId: userId,
      _id: taxComponentId,
    });
    if (!isUserWithTaxCompExists) {
      return res
        .status(403)
        .json({ error: "User or tax component does not exists" });
    }

    //for a hsn code, total tax rate docs allowed are - total no of tax comp for the user for specific country
    //ex: (3 tax comps(cgst,igst,sgst) * 1 hsn code) = 3 tax rates -> for a single country
    //no dupplicate tax rate doc allowed for a hsn no of a counry
    const isUserWithTaxCompAndHsnExists = await TaxRate.findOne({
      userId: userId,
      taxComponentId: taxComponentId,
      hsnCode: hsnCode,
    });
    if (isUserWithTaxCompAndHsnExists) {
      return res
        .status(403)
        .json({ error: "Tax rate with hsn code and component already exists" });
    }

    //as the tax rate doc with comp and hsn is unique for the user, save
    const newTaxRate = new TaxRate({
      userId: userId,
      taxComponentId: taxComponentId,
      hsnCode: new Number(hsnCode),
      taxRatePercentage: Number(taxRatePercentage),
      effectiveFrom: new Date(effectiveFrom),
      effectiveTill: effectiveTill ? new Date(effectiveTill) : null,
    });

    await newTaxRate.save();
    const populatedDataOfTaxRate = await TaxRate.findById(
      newTaxRate._id
    ).populate("taxComponentId", "taxShortCode");

    return res
      .status(201)
      .json({
        message: "Tax rate with HSN code added sucessfully",
        data: populatedDataOfTaxRate,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while adding tax rate: ${error.message}` });
  }
};

//it fetches the tax rates with hsn codes for specific country of the user
export const fetchTaxRateAndHSNs = async (req, res) => {
  const userId = req.user.userId;
  const { countryId } = req.params;

  if (
    !userId ||
    !countryId ||
    !ObjectId.isValid(userId) ||
    !ObjectId.isValid(countryId)
  ) {
    return res.status(400).json({ error: "Invalid User id or country id" });
  }

  try {
    //get the tax componenents for the country
    const taxCompForCountry = await TaxComponent.find({
      userId: userId,
      countryCode: countryId,
    });
    if (!taxCompForCountry || taxCompForCountry.length === 0) {
      return res
        .status(404)
        .json({ error: "No tax components found for the country" });
    }
    const taxComps = taxCompForCountry.map((comp) => comp._id);

    //get the tax rates for matching the components
    const taxRates = await TaxRate.find({
      userId: userId,
      taxComponentId: taxComps.map((c) => c),
    }).populate("taxComponentId", "taxShortCode");

    if (!taxRates || taxRates.length === 0) {
      return res
        .status(404)
        .json({ error: "No tax rates found for the country" });
    }

    return res
      .status(200)
      .json({
        message: "Tax rates fetched successfully for the country",
        data: taxRates,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while fetching tax rates: ${error.message}` });
  }
};

export const updateTaxRateAndHSN = async (req, res) => {
  //user id and taxrate doc id needed to update
  const userId = req.user.userId;
  const { taxRateId } = req.params;

  if (
    !userId ||
    !taxRateId ||
    !ObjectId.isValid(userId) ||
    !ObjectId.isValid(taxRateId)
  ) {
    return res.status(400).json({ error: "Invalid User id or tax rate id" });
  }

  //the update is flexible for all tax rate doc fields
  //we dont need to update tax component
  const { hsnCode, taxRatePercentage, effectiveFrom, effectiveTill, isActive } =
    req.body;

  const updateTaxRate = {};
  //before update, all given field valid chack like add tax rate
  if (hsnCode) {
    if (
      Number(hsnCode) % 1 !== 0 ||
      Number(hsnCode) < 1 ||
      Number(hsnCode) > 9999999999
    )
      return res
        .status(400)
        .json({
          error: "Tax rate must be a positive integer and max 10 digit number",
        });
    updateTaxRate.hsnCode = new Number(hsnCode);
  }

  if (taxRatePercentage) {
    if (Number(taxRatePercentage) < 0 || Number(taxRatePercentage) > 100)
      return res.status(400).json({ error: "Invalid tax rate" });
    updateTaxRate.taxRatePercentage = new Number(taxRatePercentage);
  }

  if (effectiveFrom) {
    updateTaxRate.effectiveFrom = new Date(effectiveFrom);
  }

  if (effectiveTill) {
    //date can be past/present/future
    updateTaxRate.effectiveTill = new Date(effectiveTill);
  }

  if (isActive) {
    //checked in mongodb
    updateTaxRate.isActive = isActive;
  }

  if (Object.keys(updateTaxRate).length === 0) {
    return res.status(400).json({ error: "No tax rate data given to update" });
  }

  try {
    const taxRateData = await TaxRate.findByIdAndUpdate(
      { _id: taxRateId },
      { $set: updateTaxRate },
      { new: true }
    ).populate("taxComponentId", "taxShortCode");

    if (!taxRateData)
      return res.status(404).json({ error: "No tax rate found to update" });

    return res
      .status(200)
      .json({ message: "Tax rate updated sucessfully", data: taxRateData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while updating tax rate: ${error.message}` });
  }
};

export const deleteTaxRateAndHSN = async (req, res) => {
  const userId = req.user.userId;
  const { taxRateId } = req.params;

  if (
    !userId ||
    !taxRateId ||
    !ObjectId.isValid(userId) ||
    !ObjectId.isValid(taxRateId)
  ) {
    return res.status(400).json({ error: "Invalid User id or tax rate id" });
  }

  try {
    const taxRateData = await TaxRate.findByIdAndDelete({ _id: taxRateId });

    if (!taxRateData)
      return res.status(404).json({ error: "No tax rate found to delete" });

    return res.status(200).json({ message: "Tax rate deleted sucessfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while deleting tax rate: ${error.message}` });
  }
};

//tax rule controllers ------------------------------------
export const addTaxRuleForCountry = async (req, res) => {
  const userId = req.user.userId;
  const {
    countryId,
    originZoneId,
    destZoneId,
    tax1ComponentId,
    tax2ComponentId,
    tax3ComponentId,
    applicationType,
  } = req.body;

  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Empty or invalid User id" });
  }
  if (!countryId || !ObjectId.isValid(countryId)) {
    return res.status(400).json({ error: "Empty or invalid country id" });
  }
  if (
    !originZoneId ||
    !destZoneId ||
    !ObjectId.isValid(originZoneId) ||
    !ObjectId.isValid(destZoneId)
  ) {
    return res
      .status(400)
      .json({
        error: "Empty or invalid origin zone id or destination zone id",
      });
  }
  //origin and dest must be in same country but not equeal

  if (!tax1ComponentId || !ObjectId.isValid(tax1ComponentId)) {
    return res
      .status(400)
      .json({ error: "Empty or invalid 1st tax component id" });
  }
  if (tax2ComponentId && !ObjectId.isValid(tax2ComponentId)) {
    return res.status(400).json({ error: "Invalid 2nd tax component id" });
  }
  if (tax3ComponentId && !ObjectId.isValid(tax3ComponentId)) {
    return res.status(400).json({ error: "Invalid 3rd tax component id" });
  }
  if (!applicationType) {
    return res
      .status(400)
      .json({ error: "Empty or invalid tax rule application Type" });
  }

  try {
    //country and zone id validity - both zones should be from same given country
    //the zone can be same - tntra tax rule
    //the zone can be different - inter tax rule

    const isOriginZoneValid = await TaxSubZone.findOne({
      userId: userId,
      countryId: countryId,
      _id: originZoneId,
    });
    if (!isOriginZoneValid) {
      return res
        .status(403)
        .json({ error: "Invalid origin zone id or country id" });
    }

    const isDestZoneValid = await TaxSubZone.findOne({
      userId: userId,
      countryId: countryId,
      _id: destZoneId,
    });
    if (!isDestZoneValid) {
      return res
        .status(403)
        .json({ error: "Invalid destination zone id or country id" });
    }

    //tax component validity - tax comps should be from same given country of given zones
    const isTAxComp1Valid = await TaxComponent.findOne({
      userId: userId,
      _id: tax1ComponentId,
      countryCode: countryId,
    });
    if (!isTAxComp1Valid) {
      return res
        .status(403)
        .json({ error: "Invalid 1st tax component id for given country" });
    }

    if (tax2ComponentId) {
      const isTAxComp2Valid = await TaxComponent.findOne({
        userId: userId,
        _id: tax2ComponentId,
        countryCode: countryId,
      });
      if (!isTAxComp2Valid) {
        return res
          .status(403)
          .json({ error: "Invalid 2nd tax component id for given country" });
      }
    }
    if (tax3ComponentId) {
      const isTAxComp3Valid = await TaxComponent.findOne({
        userId: userId,
        _id: tax3ComponentId,
        countryCode: countryId,
      });
      if (!isTAxComp3Valid) {
        return res
          .status(403)
          .json({ error: "Invalid 3rd tax component id for given country" });
      }
    }

    //check for dullicate rule, for same zones
    const taxRuleDupplicate = await TaxRule.findOne({
      userId: userId,
      originZoneId: originZoneId,
      destZoneId: destZoneId,
    });
    if (taxRuleDupplicate) {
      return res.status(403).json({ error: "Tax rule exists for this zones" });
    }

    //save data
    const taxRuleData = new TaxRule({
      userId: userId,
      originZoneId: originZoneId,
      destZoneId: destZoneId,
      countryId: countryId,
      tax1ComponentId: tax1ComponentId,
      tax2ComponentId: tax2ComponentId || null,
      tax3ComponentId: tax3ComponentId || null,
      applicationType: applicationType,
    });

    await taxRuleData.save();

    //populate with data for visibility
    const populatedTaxRule = await TaxRule.findById(taxRuleData._id)
      .populate("originZoneId", "subZoneCode")
      .populate("destZoneId", "subZoneCode")
      .populate("tax1ComponentId", "taxShortCode")
      .populate("tax2ComponentId", "taxShortCode")
      .populate("tax3ComponentId", "taxShortCode")
      .populate("countryId", "countryAlpha3Code");

    if (!populatedTaxRule)
      return res.status(404).json({ error: "Tax rule not found" });

    return res
      .status(201)
      .json({
        message: "Tax rule created successfully",
        data: populatedTaxRule || taxRuleData,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while adding tax rule: ${error.message}` });
  }
};

export const updateTaxRuleForCountry = async (req, res) => {};

export const fetchTaxRulesForCountry = async (req, res) => {
  const userId = req.user.userId;
  const { countryId } = req.params;

  if (
    !userId ||
    !countryId ||
    !ObjectId.isValid(userId) ||
    !ObjectId.isValid(countryId)
  ) {
    return res
      .status(400)
      .json({ error: "Empty or invalid User id or country id" });
  }

  try {
    const taxRules = await TaxRule.find({
      userId: userId,
      countryId: countryId,
    })
      .populate("originZoneId", "subZoneCode")
      .populate("destZoneId", "subZoneCode")
      .populate("tax1ComponentId", "taxShortCode")
      .populate("tax2ComponentId", "taxShortCode")
      .populate("tax3ComponentId", "taxShortCode")
      .populate("countryId", "countryAlpha3Code");

    if (!taxRules || taxRules.length === 0)
      return res.status(404).json({ error: "No tax rule found for the user" });

    return res
      .status(201)
      .json({ message: "Tax rules fetched successfully", data: taxRules });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while fetching tax rule: ${error.message}` });
  }
};

export const fetchTaxForCountry = async (req, res) => {
  const userId = req.user.userId;
  const { originZoneId, destZoneId } = req.params;

  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Empty or invalid User id" });
  }
  if (
    !originZoneId ||
    !destZoneId ||
    !ObjectId.isValid(originZoneId) ||
    !ObjectId.isValid(destZoneId)
  ) {
    return res
      .status(400)
      .json({
        error: "Empty or invalid origin zone id or destination zone id",
      });
  }

  try {
    const taxRule = await TaxRule.findOne(
      //search
      {
        userId: userId,
        originZoneId: originZoneId,
        destZoneId: destZoneId,
      },
      //projection only needed fields
      {
        originZoneId: 1,
        destZoneId: 1,
        tax1ComponentId: 1,
        tax2ComponentId: 1,
        tax3ComponentId: 1,
        applicationType: 1,
      }
    )
      .populate("originZoneId", "subZoneCode")
      .populate("destZoneId", "subZoneCode")
      .populate("tax1ComponentId", "taxShortCode")
      .populate("tax2ComponentId", "taxShortCode")
      .populate("tax3ComponentId", "taxShortCode")
      .populate("countryId", "countryAlpha3Code");

    if (!taxRule) return res.status(404).json({ error: "Tax rule not found" });

    return res
      .status(201)
      .json({ message: "Tax rule fetched successfully", data: taxRule });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error while fetching tax rule: ${error.message}` });
  }
};

export const deleteTaxRuleForCountry = async (req, res) => {};
