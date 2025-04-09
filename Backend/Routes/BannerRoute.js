import express from 'express';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

import { getBanner, uploadBanner } from '../Controllers/BannerController.js';
import adminAuth from '../Middleware/adminAuth.js'
const BannerRoute = express.Router();


BannerRoute.post('/upload',adminAuth,upload.single('image'), uploadBanner);
BannerRoute.get('/get-banner', getBanner);

export default BannerRoute;