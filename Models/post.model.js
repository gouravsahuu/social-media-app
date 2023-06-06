const mongoose = require("mongoose");

const {UserModel} = require("../Models/user.model");

const postSchema = mongoose.Schema({
    
    user: { type: mongoose.ObjectId, ref: UserModel },
    text: {type:String,required:true},
    image: {type:String,required:true},
    createdAt: {type:Date,required:true},
    likes: [{ type: mongoose.ObjectId, ref: UserModel }],
    comments: [{
      user: { type: mongoose.ObjectId, ref: UserModel },
      text: String,
      createdAt: Date
    }]
})

const PostModel = mongoose.model("post",postSchema);

module.exports = {PostModel};