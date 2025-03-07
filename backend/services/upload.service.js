const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            folder: 'avatars',
            transformation: [
                {width: 500, height: 500, crop: "limit"}, // Resize before upload
                {quality: "auto:good"} // Optimize quality
            ],
            eager_async: true // Enable async transformations
        });

        // File has been uploaded successfully
        console.log('File uploaded successfully', response.secure_url);
        
        // Remove file from local storage
        fs.unlinkSync(localFilePath);
        
        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        // Remove the locally saved temporary file as the upload operation failed
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

module.exports = { uploadOnCloudinary };