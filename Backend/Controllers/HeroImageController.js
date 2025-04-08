import HeroImageModel from "../Model/heroImageModel.js"
import { v2 as cloudinary } from 'cloudinary';

//upload hero Image 
const uploadHeroImage = async (req,res) => {
    try {
          
         const  result = await cloudinary.uploader.upload(req.file.path,{
            folder : "heroImages",
         }) 
         const hero = await HeroImageModel.findOne();
         if(hero){
          hero.imageUrl = result.secure_url,
          await hero.save()
         } else {
            await HeroImageModel.create({ imageUrl: result.secure_url });

         }
         res.status(200).json({ message: 'Hero image uploaded successfully', imageUrl: result.secure_url });

    } catch (error) {
        res.status(500).json({ message: 'Error uploading hero image', error: error.message });

    }
}


//get the hero image 

const getHeroImage = async (req,res) => {
    try {
         const hero  = await HeroImageModel.findOne();
         if(!hero) {
            return res.status(404).json({success : false , message :" hero Image not found" })
         }
         res.status(200).json(hero);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hero image', error: error.message });

    }
}

export {uploadHeroImage, getHeroImage}