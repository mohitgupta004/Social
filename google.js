const express = require('express');
const passport = require('passport');
const JWT     = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose=require('mongoose');
const cookieSession=require('cookie-session');
const router  = express.Router();
var generator = require('generate-password');
const bcryptjs= require('bcryptjs');

const keys   = require('../../config/keys');
const User=mongoose.model('users');
require('./../../models/User');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
  user: 'socialme0004@gmail.com',
  pass: 'akshitgupta'
  }
});

var password = generator.generate({
    length: 10,
    numbers: true
});

var newPass=password;

passport.serializeUser((user,done)=>{
	done(null,user.id);
});

passport.deserializeUser((id,done)=>{
	User.findById(id)
	.then(user=>{
		done(null,user);
	});
});

mongoose.connect(keys.mongoURI);

const app =express();

app.use(
	cookieSession({
		maxAge:30*24*60*60*1000,
		keys:[keys.cookieKey] 
	})
);

app.use(passport.initialize());
app.use(passport.session());


passport.use(new GoogleStrategy({
	clientID:keys.googleClientId,
	clientSecret:keys.googleClientSecret,
	callbackURL : '/auth/google/callback'
	},(acessToken,refreshToken,profile,done)=>{
		console.log(profile.emails[0].value);
		User.findOne({email:profile.emails[0].value}).then((user)=>{
			if(user)
			{
				console.log("Already Present. Logged In");
				const payload = {id:user.id,name:user.name,avatar:user.avatar}
                
                 JWT.sign(payload,keys.secretKey,{expiresIn:3600},(err,token)=>{
                        console.log(`Bearer ${token}`);
                 });
				done(null,user);
			}
			else
			{
				bcryptjs.genSalt(10,(err,salt)=>{
					bcryptjs.hash(newPass,salt,(err,hash)=>{
						if(err) console.log(err);
						newPass=hash;
						profile.photos[0].value = profile.photos[0].value.replace(/50$/,"200");
						const username = profile.emails[0].value.split('@')[0]
						
				new User({ googleId:profile.id,name:profile.displayName,email:profile.emails[0].value,avatar:profile.photos[0].value,password:newPass,username:username}).save().then(user=>{
					console.log("Account Created.. Logged in");
					var mailOptions = {
						from: 'Socail Me....',
						to: `${profile.emails[0].value}`,
						subject: 'Welcome to Social Me.',
						text: `You are welcome to Social Me. It's a online platlform for connecting Devs. Hope u enjoy using it.
							  
Your Default password is ${password}	
Change it any time by clicking on Change Password.

Thanks
Regards    
Mohit Gupta`
					  };
						transporter.sendMail(mailOptions, function(error, info){
						if (error) {
						  console.log(error);
						} else {
						  console.log('Email sent: ' + info.response);
						}
					  });
					console.log(password);
				const payload = {id:user.id,name:user.name,avatar:user.avatar}
                 JWT.sign(payload,keys.secretKey,{expiresIn:3600},(err,token)=>{
                        console.log(`Bearer ${token}`);
                 });
					done(null,user);
				});
			})
		})
			}
		});
	})
);

router.get('/auth/google', passport.authenticate('google', { scope: [
       'https://www.googleapis.com/auth/plus.login',
	   'https://www.googleapis.com/auth/plus.profile.emails.read'] 
	   
}));

  router.get('/auth/google/callback', 
        passport.authenticate('google', {
            successRedirect: 'http://127.0.0.1:5500/Social Me_theme/profiles.html',
            failureRedirect: '/fail'
        })
    );

router.get('/api/current_user',(req,res)=>{
	res.send("dd");
});


module.exports=router;