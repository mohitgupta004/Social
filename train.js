const express = require('express');
const router  = express.Router();
const readline = require('readline');
const request = require('request');

var myArray = [];

console.log(myArray);

router.post('/live',(req,res)=>{
    request({
     url :`https://api.railwayapi.com/v2/route/train/${train}/apikey/bku22nlymk/`,
    json:true,
    },(error,response,body) => {
    
    })
});
module.exports=router;