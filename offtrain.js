const express = require('express');
const router  = express.Router();
const readline = require('readline');
const request = require('request');

var myArray = [];

console.log(myArray);

router.post('/live',(req,res)=>{
    var train=req.body.train;
     myArray = [];
    url :`https://api.railwayapi.com/v2/route/train/${train}/apikey/bku22nlymk/`,
    json:true,
    },(error,response,body) => {
    if(error)
    {
        console.log("Server error");
    }
    else if(body.response_code === 404||body.response_code === 405)
    {
        console.log("Invalid");
    }
    else if(body.response_code === 500)
    {
        console.log("Invalid API key......");
    }
    else
    {
            res.json(req.body.train);
            var time = body.route[0].schdep;
            time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
            if (time.length > 1) { // If time format correct
            time = time.slice (1);  // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours    
            
            myArray.push({
                train_number:body.train.number,
                train_name:body.train.name,
                Start_Date:body.start_date,
                Start_From:body.route[0].station.name,
                Scheduled_Departure:body.route[0].schdep,
                Actual_Departure:body.route[0].actdep,
                Late_By:body.route[0].status,
                Status:body.position,
                current_station:body.current_station.name
            })
                for( i = 1; i<body.route.length; i++){
                    if(body.route[i].has_arrived){
                        myArray.push({
                            Station: `${body.route[i].station.name } (${body.route[i].station.code })`,
                            Scheduled_Arrival:body.route[i].scharr,
                            Actual_Arrival:body.route[i].actarr,
                            Scheduled_Departure: body.route[i].schdep,
                            Actual_Departure: body.route[i].actdep,
                            Day:body.route[i].day,
                            Distance: body.route[i].distance,
                            status: body.route[i].status
                        });        
             }
             else{
                myArray.push({
                    Has_arrived: "Nope, Yet to come and expected details are",
                    Station: `${body.route[i].station.name } (${body.route[i].station.code })`,
                    Scheduled_Arrival:body.route[i].scharr,
                    Actual_Arrival:body.route[i].actarr,
                    Scheduled_Departure: body.route[i].schdep,
                    Actual_Departure: body.route[i].actdep,
                    Day:body.route[i].day,
                    Distance: body.route[i].distance,
                    status: body.route[i].status
             })}
            }
            res.json(myArray);
        }
        });
        
    })

router.get('/live',(req,res)=>{
    res.json(myArray);
});

var myArray = [];

module.exports=router;