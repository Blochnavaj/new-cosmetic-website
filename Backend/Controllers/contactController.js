import Contact from "../Model/contactModel.js";
import { v2 as cloudinary } from "cloudinary";

//upload the contact data from admin panel 
const uploadContact = async (req, res) => {
    try {
      const { description, address, email, contact, hours } = req.body;
      const file = req.file;
  
      // First, find existing contact
      let contactData = await Contact.findOne({});
  
      // If an image file is uploaded, upload it to Cloudinary
      let imageUrl;
      if (file) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "contact",
        });
        imageUrl = result.secure_url;
      }
  
      if (contactData) {
        // Update existing contact data
        contactData.description = description;
        contactData.address = address;
        contactData.email = email;
        contactData.contact = contact;
        contactData.hours = hours;
        if (imageUrl) contactData.image = imageUrl;
  
        await contactData.save();
      } else {
        // Create new contact data
        contactData = new Contact({
          description,
          address,
          email,
          contact,
          hours,
          image: imageUrl,
        });
        await contactData.save();
      }
  
      res.json({ message: "Contact data uploaded successfully", contactData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };





//get the contact data from the database
const getContact = async (req, res) => {
      try {
        const contact = await Contact.findOne();
        res.status(200).json(contact);
      } catch (err) {
        res.status(500).json({ message: 'Server Error' });
      }
}

export { uploadContact, getContact };



