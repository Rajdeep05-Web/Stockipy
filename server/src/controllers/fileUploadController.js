import fs from "fs";
import cloudinary from "../configs/cloudnaryConfig.js"

const fileUploadCloudnary = async (req, res) => {
    try {
        if (!req.file) {
          return res.send(false);
        }
        // Determine the correct resource type for Cloudinary
        const fileType = req.file.mimetype.startsWith('image') ? 'image' : 'raw';
    
        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: fileType
        });
    
        // Remove file from local storage after upload
        fs.unlinkSync(req.file.path);
    
        res.json({
          success: true,
          message: 'File uploaded successfully',
          fileUrl: result.secure_url
        });
      } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ success: false, message: 'File upload failed' });
      }
}

export default fileUploadCloudnary;