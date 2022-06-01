const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id:{
        type:String,
        required: true
    },
    firstName : 
    {   type: String,
        required: true,
        minlength: 3,
        maxlength: 20 
    },   
    lastName : 
    {   type: String,
        required: true,
        minlength: 3,
        maxlength: 20 
    },
    email:
    {
        type: String,
        required: true,
    },
    password:
    {
        type:String,
        required: true,
    },
    
},{timestamps:true});

module.exports = mongoose.model("User",UserSchema)