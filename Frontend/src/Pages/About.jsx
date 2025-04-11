import React, { useState, useEffect , useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaGripVertical } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ShopContext } from "../Context/ShopContext";
 
 

function About() {
  const [heroImage, setHeroImage] = useState('');
  const [description, setDescription] = useState('');

  const { setToken, token, backendUrl } = useContext(ShopContext);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchAboutData = async () => {
      const storedToken = localStorage.getItem("token");
      try {
        const { data } = await axios.get(`${backendUrl}/api/about/get-about`);
        console.log(data);
        setHeroImage(data.heroImage);
        setDescription(data.description);
        
        setFaqs(data.faqs);
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    fetchAboutData();
  }, []);

  const moveItem = (fromIndex, toIndex) => {
    const updatedFaqs = [...faqs];
    const [movedItem] = updatedFaqs.splice(fromIndex, 1);
    updatedFaqs.splice(toIndex, 0, movedItem);
    setFaqs(updatedFaqs);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <section className="min-h-screen flex items-center justify-center mt-28 p-6 bg-gradient-to-b from-rose-50/50 to-white/50 relative overflow-hidden">
        <div className="absolute -top-32 -left-48 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-48 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-6xl w-full z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-playfair font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-gray-400 to-rose-400 bg-clip-text text-transparent">
                About Our Essence
              </span>
            </h2>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-1 bg-rose-300 rounded-full" />
            </div>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto mb-12">
              {description}
            </p>
            
           
            <motion.div 
              className="relative rounded-3xl overflow-hidden shadow-2xl mx-auto mb-16 w-full h-96"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {heroImage && (
                <img 
                  src={heroImage}
                  alt="Luxury cosmetics"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-playfair font-bold mb-2">Luxury Redefined</h3>
                <p className="opacity-90">Ethical Beauty, Exceptional Quality</p>
              </div>
            </motion.div>
          </motion.div>

          

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link 
              to='/collection' 
              className="bg-rose-300 hover:bg-rose-400 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 inline-flex items-center gap-3 transform hover:-translate-y-1 shadow-lg hover:shadow-rose-300/30 group"
            >
              <span>Discover Our Collection</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </DndProvider>
  );
}

export default About;
