const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

var newDate = new Date(Date.now());
var datee = `${newDate.toDateString()} ${newDate.toTimeString()}`;


const ProfileSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    handle:{
        type:String,
        required:true,
        max:40
    },
    company:{
        type:String
    },
    website:{
        type:String
    },
    location:{
        type:String
    },
    status:{
        type:String,
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    bio:{
        type:String
    },
    githubusername:{
        type:String
    },
    experience: [
        {
          title: {
            type: String,
            required: true
          },
          company: {
            type: String,
            required: true
          },
          location: {
            type: String
          },
          from: {
            type: Date,
            required: true
          },
          to: {
            type: Date
          },
          current: {
            type: Boolean,
            default: false
          },
          description: {
            type: String
          }
        }
      ],
    education: [
        {
          school: {
            type: String,
            required: true
          },
          degree: {
            type: String,
            required: true
          },
          fieldofstudy: {
            type: String,
            required: true
          },
          from: {
            type: Date,
            required: true
          },
          to: {
            type: Date
          },
          current: {
            type: Boolean,
            default: false
          },
          description: {
            type: String
          }
        }
      ],
      certificate: [
        {
          name: {
            type: String,
            required: true
          },
          description:{
            type: String,
            required: true
          },
          issuer: {
            type: String,
            required: true
          },
          url: {
            type: String
          },
          from: {
            type: Date,
            required: true
          },
          to: {
            type: Date
          },
          licence_no: {
            type: String
          },
          current: {
            type: Boolean,
            default: false
          }
        }
      ],
    social: {
        youtube: {
          type: String
        },
        twitter: {
          type: String
        },
        facebook: {
          type: String
        },
        linkedin: {
          type: String
        },
        instagram: {
          type: String
        }
      },
    date: {
        type: String,
        default: datee
      }
    });
    
    module.exports = Profile = mongoose.model('profile', ProfileSchema);
