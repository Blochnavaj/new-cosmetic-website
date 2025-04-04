import mongoose from 'mongoose';

const HeroImageSchema = new mongoose.Schema({
    imageurl :{
        type : String,
        require : true

    }
},{timestamps: true});

const heroImageModel = mongoose.model("HeroImage",HeroImageSchema);

export default heroImageModel;