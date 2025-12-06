import Router from "express";
import dbConnectMiddleware from "../middlewares/dbConnectMiddleware.js";
import {
  addCountryAndCode,
  getAllCountriesAndCodes,
  updateCountryAndCode,
  addTaxSubZoneType,
  getAllTaxZoneTypes,
  addTaxZone,
  getAllTaxZonesPerCountry,
  addTaxComponent,
  getTaxComponents,
  updateTaxComp,
  deleteTaxComp,
  addTaxRateAndHSN,
  fetchTaxRateAndHSNs,
  updateTaxRateAndHSN,
  deleteTaxRateAndHSN,
  addTaxRuleForCountry,
  fetchTaxForCountry,
  fetchTaxRulesForCountry,
} from "../controllers/taxController.js";

const taxRouter = Router();

taxRouter.use(dbConnectMiddleware);

taxRouter.post("/v1/tax/country/:userId", addCountryAndCode);
taxRouter.get("/v1/tax/country/:userId", getAllCountriesAndCodes);
taxRouter.put("/v1/tax/country/:userId/:countryId", updateCountryAndCode);

taxRouter.post("/v1/tax/zone-type/:userId", addTaxSubZoneType);
taxRouter.get("/v1/tax/zone-type/:userId", getAllTaxZoneTypes);

taxRouter.post("/v1/tax/zone/:userId", addTaxZone);
taxRouter.get("/v1/tax/zone/:userId/:countryId", getAllTaxZonesPerCountry);

taxRouter.post("/v1/tax/component/:userId", addTaxComponent);
taxRouter.get("/v1/tax/component/:userId/:countryId", getTaxComponents);
taxRouter.put("/v1/tax/component/:userId/:taxComponentId", updateTaxComp);
taxRouter.delete("/v1/tax/component/:userId/:taxComponentId", deleteTaxComp);

taxRouter.post("/v1/tax/rate", addTaxRateAndHSN);
taxRouter.get("/v1/tax/rate/:countryId", fetchTaxRateAndHSNs);
taxRouter.put("/v1/tax/rate/:taxRateId", updateTaxRateAndHSN);
taxRouter.delete("/v1/tax/rate/:taxRateId", deleteTaxRateAndHSN);

taxRouter.post("/v1/tax/rule", addTaxRuleForCountry);
taxRouter.get("/v1/tax/rule/:originZoneId/:destZoneId", fetchTaxForCountry);
taxRouter.get("/v1/tax/rule/:countryId", fetchTaxRulesForCountry);

export default taxRouter;
