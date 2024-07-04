import {v2 as cloudinary} from 'cloudinary';
import exp from 'constants';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null;

        //upload the file on cloudinary
        const resposne = await cloudinary.uploader.upload(localFilePath ,
            {
                resource_type:"auto"
            })

        //file has been uploaded successfully
        console.log("file is uploaded on cloudinary " , resposne.url)
        return resposne;

    }catch(error){
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}


export {uploadOnCloudinary};










// cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });