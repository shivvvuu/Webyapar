import mongoose from "mongoose";

const Image = new mongoose.Schema({
    userid:{type: String},
    name:{type: String},
    image:{type: String, default:'none'},
    status:{type:Boolean, default:false},
    mimeType:{type:String, default:'image/webp'}
})

const ImageSchema = mongoose.model('Image', Image);

export default ImageSchema;