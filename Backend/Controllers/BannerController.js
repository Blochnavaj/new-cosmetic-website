import BannerModel from "../Model/BannerModel.js"
import { v2 as cloudinary } from "cloudinary";

//upload a Banner from admin panel 
const uploadBanner = async(req,res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
     
        const Banners = new BannerModel({
             title : req.body.title,
             imageUrl :  result.secure_url,
             category : req.body.category
        })

        await Banners.save();
        res.status(201).json({
            success : true,
            message : 'Banner uploaded',
            Banners : Banners
        })
    } catch (error) {
        res.status(500).json({ message: "Upload failed", error: error.message });

    }
}


//getBanner from frontend 
const getBanner = async (req,res) => {
    try {
      const banner =  await BannerModel.findOne();
      res.status(200).json({
        success : true,
        banner
      })
    } catch (error) {
         console.log(error);
         res.status(404).json({
            success : false,
            message : "Invalid credentials" 
         })
    }
}

export {uploadBanner, getBanner}