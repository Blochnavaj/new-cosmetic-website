import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    description : {
        type : String,
        required : true,
    },
    address : {
        type : String , 
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    contact : {
        type : Number,
        required : true,
    },
    hours : {
        type : String,
        required : true,
    },
    image : {
        type : String,
        required : true,
    },

},{timestamps : true});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;