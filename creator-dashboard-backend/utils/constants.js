const { v4 } = require("uuid");
const cloudinary = require("cloudinary").v2;
const db = require("monk")(process.env.MONGODB_URL);
const streamifier = require("streamifier");

// Cloudinary Image Bucket Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//format date function
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long", // 'short', 'narrow' for shorter names
    year: "numeric",
    month: "long", // 'short' for abbreviated month names
    day: "numeric",
  });
};

const uploadAsset = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "assets",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

//upload image to cloudinary bucket
const uploadFile = async (file) => {
  console.log("the file is ", file);
  const base64String = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64",
  )}`;

  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "assets",
      resource_type: "auto",
    });
    return result.url;
  } catch (err) {
    return null;
  }
};




module.exports = {
  formatDate,
  uploadAsset,
  uploadFile,
};
 2