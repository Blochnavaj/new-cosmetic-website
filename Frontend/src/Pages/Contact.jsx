import React, { useContext, useEffect, useState } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ShopContext } from "../Context/ShopContext";
import axios from 'axios';

function Contact() {
    const { setToken, token, backendUrl } = useContext(ShopContext);
    const [contact, setContact] = useState(null);

    useEffect(() => {
      const fetchContact = async () => {
        const storedToken = localStorage.getItem("token");

        try {
          const response = await axios.get(`${backendUrl}/api/contact/get-contact`);
           
          console.log(response);
          setContact(response.data);
        } catch (error) {
          console.error("Error fetching contact info:", error);
        }
      };
  
      fetchContact();
    },);
  return (
    <section className="min-h-screen mt-24 flex items-center justify-center p-6 bg-gradient-to-b from-rose-50/50 to-white/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-32 -left-48 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-48 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl"></div>

      <motion.div 
        className="max-w-6xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Side - Contact Details */}
        <div className="w-full md:w-1/2 space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-gray-400 to-rose-400 bg-clip-text text-transparent">
                Connect With Us
              </span>
            </h2>
                 <p className="text-gray-600 text-lg leading-relaxed">
                 {contact?.description || "We are here to assist you with all your beauty needs. Whether you have questions about our products, need assistance with an order, or just want to say hello, we would love to hear from you!"}
             </p>
          </motion.div>

          <motion.ul 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <ContactItem 
              icon={<FaMapMarkerAlt className="text-rose-400" />}
              title="Visit Us"
              content={contact?.address || "123 Beauty Lane, Glamour City"}
              link="https://www.google.com/maps?q=123+Beauty+Lane,+Glamour+City"
            />
            <ContactItem 
              icon={<FaEnvelope className="text-rose-400" />}
              title="Email"
              content={contact?.email}
              link="mailto:support@cosmeticbrand.com"
            />
            <ContactItem 
              icon={<FaPhoneAlt className="text-rose-400" />}
              title="Call Us"
              content={contact?.contact || "+1 (234) 567-890"}
              link="tel:+1234567890"
            />
            <ContactItem 
              icon={<FaClock className="text-rose-400" />}
              title="Hours"
              content={contact?.hours || "Mon-Fri: 9 AM - 6 PM"}
            />
          </motion.ul>

          <motion.div 
            className="flex space-x-6 text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <SocialIcon 
              icon={<FaInstagram />}
              color="hover:text-pink-600"
              link="#"
            />
            <SocialIcon 
              icon={<FaFacebook />}
              color="hover:text-blue-600"
              link="#"
            />
            <SocialIcon 
              icon={<FaTwitter />}
              color="hover:text-blue-400"
              link="#"
            />
            <SocialIcon 
              icon={<FaLinkedin />}
              color="hover:text-blue-700"
              link="#"
            />
          </motion.div>
        </div>

        {/* Right Side - Image */}
        <motion.div 
          className="w-full md:w-1/2 relative rounded-2xl overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={contact?.image || "https://via.placeholder.com/600x400"}
            alt="Beauty Consultation"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}

const ContactItem = ({ icon, title, content, link }) => (
  <li className="flex items-start gap-4 group">
    <div className="p-3 bg-rose-50 rounded-lg text-2xl">{icon}</div>
    <div className="flex-1">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      {link ? (
        <a href={link} className="text-gray-600 hover:text-rose-500 transition-colors">
          {content}
        </a>
      ) : (
        <p className="text-gray-600">{content}</p>
      )}
    </div>
  </li>
);

const SocialIcon = ({ icon, color, link }) => (
  <motion.a 
    href={link}
    className={`text-gray-600 ${color} transition-all duration-300 hover:-translate-y-1`}
    whileHover={{ scale: 1.1 }}
  >
    {icon}
  </motion.a>
);

export default Contact;