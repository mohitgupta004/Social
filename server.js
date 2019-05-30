const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const passport   = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const train=require('./routes/api/train');
const google=require('./routes/api/google');
const app=express();


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// DB config....
const db=require('./config/keys')
.mongoURI;

mongoose
    .connect(db)
    .then(()=>console.log(`Mongo Connected`))
    .catch(err => console.log(err));

app.use(passport.initialize());
require('./config/passport')(passport);

const path=require('path');

app.use('/api/users',users);
app.use('/api/posts',posts);
app.use('/api/profile',profile);
app.use('/api/train',train);
app.use('/',google);

if(process.env.NODE_ENV === 'production')
{
    app.use(express.static('client/build'));
    app.get('*',(req,res) =>{
        res.sendFile(path.resolve(__dirname,'client','build','index.hmtl'));
    })
}


const port =process.env.PORT||5000
app.listen(port,()=>{
    var newDate = new Date(Date.now());
    var datee = `${newDate.toDateString()} ${newDate.toTimeString()}`;
    console.log(datee);
    console.log(`Server running on port ${port}`);
});
