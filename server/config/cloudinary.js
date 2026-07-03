const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('☁️ Cloudinary integration active.');
} else {
  console.log('💾 Local storage upload active (Cloudinary config empty).');
  // Ensure local uploads directory exists
  const uploadDir = path.join(__dirname, '../public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

/**
 * Upload a file to Cloudinary, or save locally as fallback
 * @param {string} localFilePath Path to the temporary file
 * @returns {Promise<{url: string, public_id?: string}>} URL and optional identifier
 */
const uploadImage = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    if (isCloudinaryConfigured) {
      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: 'businessconnect_ai'
      });
      // Clean up temp file
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      return { url: result.secure_url, public_id: result.public_id };
    } else {
      // Local fallback: move file from temp folder to public uploads directory
      const fileName = `${Date.now()}-${path.basename(localFilePath)}`;
      const destination = path.join(__dirname, '../public/uploads', fileName);
      
      fs.copyFileSync(localFilePath, destination);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      
      return { url: `/uploads/${fileName}` };
    }
  } catch (error) {
    console.error('Upload Error:', error);
    // Cleanup temp file even if failed
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error;
  }
};

module.exports = {
  uploadImage,
  isCloudinaryConfigured
};
