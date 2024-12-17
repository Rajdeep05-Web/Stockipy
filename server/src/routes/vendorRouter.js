import { Router } from "express";
import { fetchVendors, fetchVendor, addVendor, updateVendor, deleteVendor } from "../controllers/vendorController.js";
const vendorRouter = Router();

vendorRouter.get('/v1/vendors', fetchVendors);
vendorRouter.get('/v1/vendors/:id', fetchVendor);
vendorRouter.post('/v1/vendors', addVendor);
vendorRouter.put('/v1/vendors/:id', updateVendor);
vendorRouter.delete('/v1/vendors/:id', deleteVendor);

export default vendorRouter;
