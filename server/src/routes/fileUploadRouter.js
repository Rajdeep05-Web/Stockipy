import { Router } from "express";
const fileuploadrouter = Router();
import {fileUploadCloudnary, fileDeleteCloudnary} from "../controllers/fileUploadController.js";
import upload from "../middlewares/fileUploadMiddleware.js";

fileuploadrouter.post("/v1/file", upload.single("invoice"), fileUploadCloudnary)
fileuploadrouter.delete("/v1/file/:public_id", fileDeleteCloudnary)

export default fileuploadrouter;

