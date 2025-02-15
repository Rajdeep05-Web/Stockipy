import fs from "fs";
import cloudinary from "../configs/cloudnaryConfig.js"

export const fileUploadCloudnary = async (req, res) => {
    try {
        if (!req.file) {
          return res.status(400).json({ success: false, message: 'No file uploaded' });
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

export const fileDeleteCloudnary = async (req, res) => {
    try {
        const { public_id } = req.params;
        // console.log("public_id",public_id)
        if (!public_id) {
          return res.status(400).json({ message: 'Public ID required' });
        }
    
        // Delete file from Cloudinary
        await cloudinary.uploader.destroy(public_id);
    
        return res.status(200).json({ message: 'File deleted successfully' });
      } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ success: false, message: 'File delete failed' });
      }
}
