const express = require('express');
const router  = express.Router();


router.get('/test',(req,res)=> res.json({ msg:"New posts agaya bhai"}));

module.exports=router;