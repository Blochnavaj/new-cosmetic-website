import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    locations: [{
      timestamp: { type: Date, default: Date.now },
      coordinates: {
        type: [Number],  
        required: true
      },
      ipAddress: String,
      device: String
    }],
    password: {
        type: String,
        required: true
    },
   
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model('User', UserSchema);

export default userModel;
