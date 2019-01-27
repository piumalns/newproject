const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
//
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

// 
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//
const config = require('./config/database');

//
const mongoose = require('mongoose');
    const connection = mongoose.connect(config.database);
if(connection){
    console.log("database connected");
}else{
    console.log("database not connection");
}

const User = require('./router/user');

 app.get("/",(req,res)=>{
     res.send("hello world");
 })


app.use('/user',User);

const Job = require('./router/job');

app.use('/job',Job);

// const Job = require('./router/job');
//  app.get("/",(req,res)=>{
//      res.send("hello image");
//  })

// app.use('/job',Job);

app.listen(port,()=>{
    console.log('listing to port '+ port);
})
