const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    email : {
        type: String,
        required :true,
        trim : true
    },
    password : {
        type: String,
        required:true,
        trim:true,
        minlength : 3
    },
    isVerified : {
        type : Boolean,
        default : false
    } 
})

const VerifyEmail = new mongoose.model("data", dataSchema);

module.exports = VerifyEmail;