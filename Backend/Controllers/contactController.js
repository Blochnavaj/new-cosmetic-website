import Contact from "../Model/contactModel.js";
import { v2 as cloudinary } from "cloudinary";

//upload the contact data from admin panel 
const uploadContact = async (req, res) => {
    try {
        const contact = await Contact.findOne();
        res.status(200).json(contact);
      } catch (err) {
        res.status(500).json({ message: 'Server Error' });
      }
}






//get the contact data from the database
const getContact = async (req, res) => {
    try {
        const { description, address, email, contact, hours, image } = req.body;
        const file = req.file;


        if (!contactData) contactData = new Contact();
         
        if(file){
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'contact',
            });
            contactData.image = result.secure_url;
        }

        const contactData = await Contact.findOne({});
        if (contactData) {
            contactData.description = description;
            contactData.address = address;
            contactData.email = email;
            contactData.contact = contact;
            contactData.hours = hours;
            await contactData.save();
        } else {
            const newContact = new Contact({
                description,
                address,
                email,
                contact,
                hours,
                image: file ? result.secure_url : undefined
            });
            await newContact.save();
        }
        res.json({ message: "Contact data uploaded successfully", contactData });
    } catch (error) {
        console.error(err);
           res.status(500).json({ message: "Server Error" });    
    } 
}

export { uploadContact, getContact };



