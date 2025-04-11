import express from "express";
import dotenv from "dotenv";
 
import cors from "cors";
import connectDB from "./Config/db.js";
import connectClodinary from "./Config/cloudinary.js";
import userRouter from "./Routes/userRoute.js";
import productRouter from "./Routes/productRoute.js";
import cartRoutes from "./Routes/cartRoutes.js";  
import orderRouter from "./Routes/orderRoute.js";
import HeroImageRoute from "./Routes/heroImageRoute.js";
import BannerRoute from "./Routes/BannerRoute.js";
import router from "./Routes/AboutRoute.js";
 
dotenv.config();

const app = express();
const port = process.env.PORT || 9000; 

connectDB();
connectClodinary();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
 

// Error handling middleware add करें (Express के लिए)
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
})

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/v1", productRouter);
app.use("/api/cart", cartRoutes); 
app.use("/api/order" , orderRouter);
app.use("/api/hero",HeroImageRoute );
app.use('/api/banner' , BannerRoute);
app.use('/api/about', router)
 

 
app.listen(port, () => console.log(`Server running on port ${port}`));
