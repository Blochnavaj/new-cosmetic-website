import mongoose from "mongoose"

const LogoSchema = new mongoose.Schema({
    logo : {
        type : String,
        required : true,
    }
},{timestamps : true})

const logoModel = mongoose.model('logo',LogoSchema);

export default logoModel;