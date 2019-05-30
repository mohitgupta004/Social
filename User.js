const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

var newDate = new Date(Date.now());
var datee = `${newDate.toDateString()} ${newDate.toTimeString()}`;

// Create Schema....
const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String
    }, 
    avatar:{
        type:String
    },
    date:{
        type:String,
        default:datee
    },
    googleId:{
    	type:String
    }
});

module.exports = User =mongoose.model('users',UserSchema);