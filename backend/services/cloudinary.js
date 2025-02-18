require("dotenv").config();

const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,       
  api_secret: process.env.CLOUDINARY_API_SECRET  
});



const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',  
          folder: 'talkify-avatar',     
        },
        (error, result) => {
          if (error) {
            return reject(error);  
          }
          resolve(result.secure_url);  
        }
      ).end(fileBuffer);  
    });
  };

  module.exports = {
    uploadToCloudinary
  }
  
