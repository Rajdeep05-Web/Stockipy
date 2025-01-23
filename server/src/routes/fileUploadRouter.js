import { Router } from "express";
const fileuploadrouter = Router();
import fileUploadCloudnary from "../controllers/fileUploadController.js";
import upload from "../middlewares/fileUpload.js";

fileuploadrouter.post("/v1/upload", upload.single("invoice"), fileUploadCloudnary)

export default fileuploadrouter;

