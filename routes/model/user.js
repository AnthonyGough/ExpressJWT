const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require ("bcrypt");
const SALT_FACTOR=10;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }, 
},
{ timestamps: true});

userSchema.pre('save' )
    
   
module.exports = mongoose.model("User", userSchema);