import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({});

cloudinary.config({

    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME,

});

//upload media to cloudinary
export const uploadMedia = async (file) => { //receive file object
  try {
    const uploadResponse = await cloudinary.uploader.upload(file,{
        resource_type: "auto"
    });
    return uploadResponse;
  } 
  catch (error) {
    console.log(error);
  }
}
//delete previous image from cloudinary if we update profile photo
 export const deleteMedia = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } 
  catch (error) {
    console.log(error);
  }
}
//delete video from cloudinary
export const deleteVideo = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
        resource_type: "video"
    });
  } 
  catch (error) {
    console.log(error);
  }
}

