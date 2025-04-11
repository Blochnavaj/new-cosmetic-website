import About from '../Model/AboutModel.js';
import { v2 as cloudinary } from "cloudinary";

// Get About Page Data
export const getAboutData = async (req, res) => {
  try {
    const about = await About.findOne().lean();
    if (about) {
      const transformedData = {
        ...about,
        heroImage: about.imageUrl,
        faqs: about.faqs.map(faq => ({
          id: faq._id.toString(),
          question: faq.question,
          answer: faq.answer
        }))
      };
      res.json(transformedData);
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch about page data' });
  }
};

// Update About Page Data (admin only)
export const updateAboutData = async (req, res) => {
  try {
    const { description, faqs: faqsString } = req.body;
    const file = req.file;
    const faqs = JSON.parse(faqsString);

    let imageUrl;
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'about',
      });
      imageUrl = result.secure_url;
    }

    let about = await About.findOne() || new About();
    
    about.description = description;
    about.faqs = faqs.map(faq => {
      if (mongoose.Types.ObjectId.isValid(faq.id)) {
        return {
          _id: faq.id,
          question: faq.question,
          answer: faq.answer
        };
      } else {
        return {
          question: faq.question,
          answer: faq.answer
        };
      }
    });
    
    if (imageUrl) about.imageUrl = imageUrl;
    await about.save();
    
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
