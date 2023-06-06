const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {type:String,required:true},
    email: {type:String,required:true},
    password: {type:String,required:true},
    dob: {type:Date,required:true},
    bio: {type:String,required:true},
    posts: [{ type: mongoose.ObjectId}],
    friends: [{ type: mongoose.ObjectId}],
    friendRequests: [{ type: mongoose.ObjectId}]
})

const UserModel = mongoose.model("user",userSchema);

module.exports = {UserModel};