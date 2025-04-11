import express from 'express';
import adminAuth from '../Middleware/adminAuth.js' 
import { getAboutData, updateAboutData } from '../Controllers/AboutController.js';
import upload from '../Middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/get-about', getAboutData);
router.put('/update-about',adminAuth,upload.single('image'),updateAboutData); // Admin Only

export default router;
