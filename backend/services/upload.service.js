const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        if (!fs.existsSync(localFilePath)) {
            console.error('File not found:', localFilePath);
            return null;
        }

        // Upload file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            folder: 'uploads',
            transformation: [
                {width: 1000, height: 1000, crop: "limit"},
                {quality: "auto:good"}
            ]
        });

        console.log('File uploaded successfully:', response.secure_url);
        
        // Remove temporary file
        try {
            fs.unlinkSync(localFilePath);
        } catch (unlinkError) {
            console.error('Error removing temp file:', unlinkError);
            // Continue even if temp file deletion fails
        }

        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        try {
            if (localFilePath && fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (unlinkError) {
            console.error('Error removing temp file:', unlinkError);
        }
        throw error; 
    }
};

module.exports = { uploadOnCloudinary };