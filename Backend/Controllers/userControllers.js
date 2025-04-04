import User from "../Model/userModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const createToken = (userId) => {
    return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" }); // ✅ Ensure correct ID format
};

 
// LOGIN USER
const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({ success: false, message: "User doesn't exist" });
      }

      // Compare password
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      // Generate JWT Token with "userId"
      const token = createToken(user._id);

      return res.status(200).json({
         success: true,
         message: "User login successful",
         token
      });

   } catch (error) {
      console.error("Error in loginUser:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
   }
};


// 🔹 REGISTER USER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input fields
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Hash password before saving
        const hashPassword = await bcryptjs.hash(password, 10);

        // Create new user
        const newUser = new User({ name, email, password: hashPassword });
        await newUser.save();

        // Generate JWT Token
        const token = createToken(newUser._id);

        res.status(201).json({ success: true, message: "User registered successfully", token });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 🔹 ADMIN LOGIN
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if credentials match environment variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Sign token with `userId` for consistency
            const token = jwt.sign(
                { userId: "admin", isAdmin: true },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "30d" }
            );

            return res.status(200).json({
                success: true,
                message: "Admin login successful",
                token
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        console.error("Error in adminLogin:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

//TOTAL USERS CALCULATION FOR ADMIN PANEL 
const getTotalUsers  = async (req,res) => {
    try {
 
       const totalUsers = await User.countDocuments();
        
       res.status(200).json({
        success : true,
        totalUsers
       })  
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });

    }
}

//TOTAL USERS DATA FOR ADMIN PANEL 
const getUsersData = async (req, res) => {
    try {
        const users = await User.find(); // ✅ Use `users` instead of `getData`
        res.status(200).json({ success: true, users }); // ✅ Return as `users`
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

//map location for users 
  const getCustomerLocations = async (req, res) => {
    try {
      const customers = await User.aggregate([
        {
          $match: {
            'address.location': { $exists: true },
            role: 'customer' // filter only customers
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            'address.city': 1,
            'address.state': 1,
            'address.country': 1,
            location: '$address.location'
          }
        }
      ]);
  
      res.json({
        success: true,
        data: customers
      });
    } catch (error) {
      console.error('Error fetching customer locations:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer locations'
      });
    }
  };
  
   const getGeoSpatialData = async (req, res) => {
    try {
      const { lat, lng, radius = 10000 } = req.query; // radius in meters
      
      const customers = await User.find({
        'address.location': {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: parseInt(radius)
          }
        }
      }).limit(100);
  
      res.json({
        success: true,
        data: customers
      });
    } catch (error) {
      console.error('Error fetching geospatial data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch geospatial data'
      });
    }
  };


export { registerUser, loginUser, adminLogin, getTotalUsers , getUsersData, getCustomerLocations, getGeoSpatialData };
