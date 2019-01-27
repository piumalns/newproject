const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new schema({
    username:{type:String,require:true},
    name:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    position:{type:String,require:true}


});

const User = module.exports = mongoose.model("employee",userSchema);


module.exports.saveUser = function(newUser,callback){

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
           newUser.password = hash;
           if(err) throw err;
           newUser.save(callback);
        });
    });

}

module.exports.finduserbyid = function(id,callback){
    User.findOne(id,callback);
}




module.exports.findbyemail = function(email,callback){
    const query = {email:email};
    User.findOne(query,callback);
}


module.exports.passwordchecker =function(checkpassword,hash,callback){
    bcrypt.compare(checkpassword, hash, function(err, res) {
        if(err) throw err;
        if(res){
            callback(null,res);
        }
    });
}

module.exports.findbymachineid = function(id,callback){
    machine.findOne(id,callback);
}


