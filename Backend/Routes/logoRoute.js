import express from 'express';
import { getLogo, uploadLogo } from '../Controllers/logoControlller.js';
import adminAuth from '../Middleware/adminAuth.js';
import upload from '../Middleware/uploadMiddleware.js';
const logoRoute = express.Router();


logoRoute.get('/get-logo',getLogo);
logoRoute.post('/upload-logo',adminAuth,upload.single('image'),uploadLogo);



export default logoRoute;