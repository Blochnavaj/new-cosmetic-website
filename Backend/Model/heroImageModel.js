import mongoose, { mongo } from 'mongoose';

const HeroImageSchema = new mongoose.Schema({
    imageUrl : {
        type : String,
        required : true,
    }
},{timestamps: true});

const HeroImageModel = mongoose.model('heroImage',HeroImageSchema);
export default HeroImageModel;