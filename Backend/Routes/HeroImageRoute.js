import express from 'express';
const HeroImageRoute = express.Router();
import upload from '../Middleware/uploadMiddleware.js';
import adminAuth from '../Middleware/adminAuth.js'
import { getHeroImage, uploadHeroImage } from '../Controllers/heroImageController.js';


HeroImageRoute.post('/upload',adminAuth,upload.single('image'),uploadHeroImage );
HeroImageRoute.get('/get-image', getHeroImage);


export default HeroImageRoute;