import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const aboutSchema = new mongoose.Schema({
  description: String,
  imageUrl: String,
  faqs: [faqSchema],
});

const About = mongoose.model('About', aboutSchema);

export default About;
