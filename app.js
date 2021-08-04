const express = require('express');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');


const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({extended: true}));

// Static folder
app.use("/public",express.static('public'));


app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Signup route
app.post('/', function(req, res){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    // Make sure fields are filled
    if(!fname || !lname || !email){
        // res.redirect('/fail.html');
        // return;
        res.sendFile(path.join(__dirname, 'fail.html'));
        return ;
    }

    // Construct request data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields:{
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    const postData = JSON.stringify(data);

    const options = {
        url:'https://us6.api.mailchimp.com/3.0/lists/767a8ac477',
        method: 'POST',
        headers: {
            Authorization: 'auth b3e489bb3e56579a7b2617a6eac607c3-us6'
        },
        body: postData
     };

     request(options, function(err, response, body){
            if(err){
                // res.send("There was an erroe with singning up, please try again");
                res.sendFile(path.join(__dirname, 'fail.html'));
            }else{
                if(response.statusCode === 200){
                    res.sendFile(path.join(__dirname, 'success.html'));
                    // res.send("Successfully ");
                    // res.redirect('http://google.com');
                }else{
                    res.send("there was error");
                    res.sendFile(path.join(__dirname, 'fail.html'));
                    // res.redirect('/fail.html');
                }
            }
     });
});

// route for the failure page
app.post('/fail', function(req, res){
    res.redirect('/');
});

app.listen(process.env.PORT ||3000, function(){
    console.log("server is running")
});

// 

// // 

// url 

// b3e489bb3e56579a7b2617a6eac607c3-us6  ---api key