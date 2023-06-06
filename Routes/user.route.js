const express = require("express");
const {UserModel} = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {authentication} = require("../Middlewares/auth");

const userRoute = express.Router();

userRoute.get("/users",async(req,res) => {
    const allusers = await UserModel.find();
    res.status(200).send(allusers);
})

userRoute.post("/register",async(req,res) => {
    const {name,email,password,dob,bio} = req.body;
    try{
        const existingUser = await UserModel.find({email});
        if(existingUser.length == 0){
            bcrypt.hash(password, 5, async (err,hash) => {
                if(err){
                    res.status(400).send({"error":err.message});
                }
                else{
                    let posts = [];
                    let friends = [];
                    let friendRequests = [];
                    const user = new UserModel({name,email,dob,bio,posts,friends,friendRequests,password:hash});
                    await user.save();
                    res.status(201).send({"message":"User Registered Successfully"});
                }
            })
        }
        else{
            res.status(400).send({"error":"User Already Registered"});
        }
    }
    catch(err){
        res.status(400).send({"error":err.message});
    }
})

userRoute.post("/login",async(req,res) => {
    const {email,password} = req.body;
    try{
        const userCheck = await UserModel.find({email});
        if(userCheck.length > 0){
            bcrypt.compare(password, userCheck[0].password, (err,result) => {
                if(result == true){
                    const token = jwt.sign({userID : userCheck[0]._id}, process.env.key, {expiresIn: "1h"});
                    res.status(201).send({"message":"Login Success","token":token});
                }
                else if(result == false){
                    res.status(400).send({"error":"Invalid Credentials"});
                }
            })
        }
        else{
            res.status(400).send({"message":"User Not Registered"});
        }
    }
    catch(err){
        res.status(400).send({"error":err.message});
    }
})

userRoute.get("/users/:id/friends",async(req,res) => {
    const id = req.params.id;
    try{
        const user = await UserModel.findById(id);
        res.status(200).send(user.friends);
    }
    catch(err){
        res.status(400).send({"error":err.message});
    }
})

userRoute.post("/users/:id/friends",authentication,async(req,res) => {
    const id = req.params.id;
    const friendReq = req.body;
    try{
        const user = await UserModel.findById(id);
        if(user){
            user.friendRequests.push(friendReq);
            await UserModel.findByIdAndUpdate(id,{friendRequests:user.friendRequests});
            res.status(201).send({"message":`Friend Request Sent to ${user.name}`});
        }
        else{
            res.status(400).send({"error":"User does not exist"});
        }
    }
    catch(err){
        res.status(400).send({"error":err.message});
    }
})

userRoute.patch("/users/:id/friends/:friendId",authentication,async(req,res) => {
    const {id,friendId} = req.params;
    try{
        const user = await UserModel.findById(id);
        let flag = false;
        for(let i=0;i<user.friendRequests.length;i++){
            if(user.friendRequests[i]._id == friendId){
                const reqe = user.friendRequests.splice(i,1);
                user.friends.push(...reqe);
                flag = true;
                break;
            }
        }
        if(flag){
            await UserModel.findByIdAndUpdate(id,{friends:user.friends,friendRequests:user.friendRequests});
            res.status(204).send({"message":"Friend Request Accepted"});
        }
        else{
            res.status(400).send({"error":"Something Went Wrong"});
        }
    }
    catch(err){
        res.status(400).send({"error":err.message});
    }
})

module.exports = {userRoute};