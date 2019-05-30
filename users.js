const express = require('express');
const router  = express.Router();
const User    = require('../../models/User');
const gravatar= require('gravatar');
const bcryptjs= require('bcryptjs');
const JWT     = require('jsonwebtoken');
const keys    = require('../../config/keys');
const passport= require('passport');
var nodemailer = require('nodemailer');
var generator = require('generate-password');

var num;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'socialme0004@gmail.com',
    pass: 'akshitgupta'
  }
});

// Load Input..........
const validateRegisterInput = require('../../validator/register');
const validateLoginInput    = require('../../validator/login');
const validateCodeEmail     = require('../../validator/passwordemail');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test',(req,res)=> res.json({ msg:"Ban gaya bhai"}));

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register',(req,res)=>{
    const {errors,isValid} = validateRegisterInput(req.body);
    // Check Validation.....
    if(!isValid){
        return res.status(400).json(errors);
    }
    User.findOne
    (
        { email :req.body.email }
    )
    .then(user=>{
        if(user){
            errors.email='User with same Email Already Exists';
            return res.status(400).json(errors);
        }
        else{
            User.findOne
            (
                
            { username:req.body.username}
            )
            .then(user=>{
                if(user){
                    errors.username='User with same username Already Exists';
                    return res.status(400).json(errors);
                }
        else{
            var avatar=gravatar.url(req.body.email,{
                s:'200', // Size
                r:'pg',  // Rating
                d:'mm'  
            });
            const newUser =new User({
                name:req.body.name,
                email:req.body.email,
                username:req.body.username,
                avatar,
                password:req.body.password
            });
            bcryptjs.genSalt(10,(err,salt)=>{
                bcryptjs.hash(newUser.password,salt,(err,hash)=>{
                    if(err) console.log(err);
                    newUser.password=hash;
                    newUser.save()
                    .then(user=> res.json(user))
                    .catch(err=> console.log(err))
                })
            })
            
    var mailOptions = {
    from: 'Socail Me....',
    to: `${req.body.email}`,
    subject: 'Welcome to Social Me.',
    text: `You are welcome to Social Me. It's a online platlform for connecting Devs. Hope u enjoy using it.
          
   Thanks
  
   Regards    
   Mohit Gupta`
  };
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    }
})
        }
    })}}) });
    
// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login',(req,res)=>{
    const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
     const email    = req.body.email;
     const password = req.body.password;
     const username   = req.body.username;
     User.findOne
     (
        {
          $or: [
                 {email},
                 {username}
               ]
        }
     )
     .then(user =>{
         if(!user){
            return res.status(400).json({email:'Usr nt Found'});
         }
         bcryptjs.compare(password,user.password)
         .then(isMatch =>{
             if(isMatch){
                 // User Matched..........
                 // Passes JWT to login...
                 // Create Payload.....
                 const payload = {id:user.id,name:user.name,avatar:user.avatar,username:user.username,email:user.email}
                
                 JWT.sign(payload,keys.secretKey,{expiresIn:3600},(err,token)=>{
                    res.json({
                        sucess:true,
                        token:`Bearer ${token}`
                    })
                 });
            }
             else{
                return res.status(400).json({password:'Password inccorect..'});
             }
         });
     });
});

// POST api/users/forgotpassword
// Forgot Password
// Public
router.post('/forgotpassword',(req,res)=>{
       const { errors, isValid } = validateCodeEmail(req.body);
       if (!isValid) {
        return res.status(400).json(errors);
       }
     const email = req.body.email;
     const username=req.body.username;
     
var password = generator.generate({
    length: 7,
    numbers: true
});
var newPass=password;

bcryptjs.genSalt(10,(err,salt)=>{
    bcryptjs.hash(newPass,salt,(err,hash)=>{
        if(err) console.log(err);
        newPass=hash;
    })
})
User.findOne
     (
                 {email}
     )
     .then(user =>{
         if(!user){
            return res.status(400).json({email:'Usr nt Found'});
         }
         else{
            User.findOneAndUpdate({email}, {$set:{password:newPass}}, (err, doc) => {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
             });
            num = Math.floor(Math.random() * 90000) + 10000;
            var mailOptions = {
                from: 'Socail Me....',
                to: `${req.body.email}`,
                subject: 'Password Change Request',
                text: `Look like u requested to change your Password. If you did so Your new Password has been set ${password}.
                      
               Thanks
              
               Regards    
               Mohit Gupta`
              };
                transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                }
              });
              errors.sucessEmail=`Mail to email id ${user.email}  was sent sucessfully.`;
              return res.send(errors.sucessEmail);  
         }
        })
    });

// @route   GET api/users/current
// @desc    Return current User....
// @access  Public
router.get('/current',passport.authenticate('jwt',{session:false}),
    (req, res) => {
        res.json({
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          username:req.user.username
        });
      }
    );
    
const validateChangePassword = require('../../validator/changePassword');

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/changepassword',passport.authenticate('jwt',{session:false}),(req,res)=>{
            const email =req.body.email
            const current    = req.body.current;
            let password = req.body.password;
            const password2   = req.body.password2;
        User.findOne
        (
            {
            $or: [
                    {email}
                 ]
            }
        )
     .then(user =>{
         if(!user){
            return res.status(400).json({email:'Usr nt Found'});
         }
      else{
         bcryptjs.compare(current,user.password)
         .then(isMatch =>{
             if(isMatch)
            {
                const { errors, isValid } = validateChangePassword(req.body);
            //    Check Validation
                if (!isValid) {
                            return res.status(400).json(errors);
                    }
                                        
                    bcryptjs.genSalt(10,(err,salt)=>{
                        bcryptjs.hash(password,salt,(err,hash)=>{
                            if(err) console.log(err);
                            password=hash;
                            
                            User.findOneAndUpdate({email}, {$set:{password:password}}, (err, doc) => {
                                if (err) {
                                    console.log("Something wrong when updating data!");
                                }
                            });
                        })
                    })
                    
        return res.send("hh");
            }
             else{
                return res.status(400).json({current:' Current Password inccorect..'});
             }
         });
        } 
        });
});

module.exports=router;