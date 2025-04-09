import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
    title : String,
    imageUrl : String,
    category : String
}, {timestamps: true})

const BannerModel = new mongoose.model("Banner", BannerSchema);
export default BannerModel;