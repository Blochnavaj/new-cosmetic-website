import express from 'express';
import { getContact, uploadContact } from '../Controllers/contactController.js';
import  adminAuth  from '../Middleware/authMiddleware.js';
import upload from '../Middleware/uploadMiddleware.js';




const contactRouter = express.Router();


contactRouter.get('/get-contact',getContact);
contactRouter.post('/upload-contact',adminAuth,upload.single('image') ,uploadContact);

export default contactRouter ;