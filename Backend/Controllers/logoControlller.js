import logoModel from "../Model/logoModel.js";
import { v2 as cloudinary } from "cloudinary";

//get the logo image from users Frontend 
const getLogo = async (req, res) => {
    try {
        const logo = await Logo.findOne().sort({ createdAt: -1 });
        if (!logo) return res.status(404).json({ error: "Logo not found" });
        res.status(200).json(logo);
      } catch (err) {
        res.status(500).json({ error: "Server error" });
      } 
}


//upload logo image from admin panel 

const uploadLogo = async (req,res) => {
    try {
        const result = await cloudinary.uploader.upload_stream(
          { folder: "logo" },
          async (error, result) => {
            if (error) return res.status(500).json({ error: "Cloudinary error" });
    
            // Delete previous logo if exists
            const existingLogo = await Logo.findOne();
            if (existingLogo) await existingLogo.deleteOne();
    
            const newLogo = new Logo({ image: result.secure_url });
            await newLogo.save();
    
            res.status(200).json(newLogo);
          }
        );
    
        req.file.stream.pipe(result);
      } catch (err) {
        res.status(500).json({ error: "Server error" });
      }
}


export {getLogo, uploadLogo};