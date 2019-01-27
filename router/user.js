const express = require('express')
const router = express.Router();
const User = require('../models/user');
var jwt = require('jsonwebtoken');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var url = "mongodb://localhost:27017/";
var ObjectId = require('mongodb').ObjectId;


const config = require('../config/database');

router.post("/register",(req,res)=>{
    // console.log(req.body)
    const newUser = new User({
        username:req.body.username,
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        position:req.body.position

    });


    User.saveUser(newUser,(err,user)=>{
        if(err){
            res.json({state:false,msg:"data not iserted"});
        }
        if(user){
            res.json({state:true,msg:"data iserted"});
        }
    })

});


router.post("/login",(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;


    User.findbyemail(email,(err,user)=>{
        if(err) throw err;
        if(!user){
            res.json({state:false,msg:"no user"})
        }

        User.passwordchecker(password,user.password,(err,match)=>{
            if(err) throw err;
            if(match){
                const token = jwt.sign({user},config.secret, {expiresIn:86400});;
                res.json({state:true,
                token:token,
                 
                id:user._id,
                name:user.name,
                username:user.username,
                email:user.email,
                position:user.position

                
            })
            }
        });

    });

    });

router.post('/machine',(req,res)=>{
    const id = req.body.id;
    MongoClient.connect(config.database, function(err, db) {
        assert.equal(null,err);
        var dbo = db.db("jobcard");
        dbo.collection("machine").find({_id:id}).toArray(function(err, result) {
          assert.equal(null,err);
          res.json({
              result
          })
          db.close();
        });
      });
})


router.get('/machine/:id',(req,res)=>{
    // console.log(machineID);
    // res.send("hello machine");
    o_id = new ObjectId(req.params.id)
    MongoClient.connect(config.database, function(err, db) {
        assert.equal(null,err);
        var dbo = db.db("jobcard");
        dbo.collection("machine").find({_id:o_id}).toArray(function(err, result) {
          assert.equal(null,err);
          res.json({
              result
          })
          db.close();
        });
      });
})


router.put('/machine',(req,res)=>{
    const name = req.body.machineName;
    const dep = req.body.machineDep;
    MongoClient.connect(config.database,(err,db)=>{
        o_id = new ObjectId(req.params.id)
        if (err) throw err;
        var dbo = db.db("jobcard");
        var value = {$set:{machineName:name,machineDep:dep}};
        dbo.collection("machine").updateOne({_id:o_id},value,(err,res)=>{
            assert.equal(null,err);
            db.close();
        });

    });
})

module.exports = router;
