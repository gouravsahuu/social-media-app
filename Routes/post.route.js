const express = require("express");
const {PostModel} = require("../Models/post.model");
const {authentication} = require("../Middlewares/auth");

const postRoute = express.Router();

postRoute.get("/posts",async (req,res) => {
    try{
        const allPosts = await PostModel.find().populate(["likes","comments"]);
        res.status(200).send(allPosts);
    }
    catch(err){
        res.status(400).send({"error":err.message});
    }
})

postRoute.get("/posts/:id",async(req,res) => {
    const id = req.params.id;
    try{
        const post = await PostModel.findById(id).populate(["likes","comments"]);
        res.status(200).send(post);
    }
    catch(err){
        res.status(400).send({"error":err.message});
    }
})

postRoute.post("/posts",authentication,async(req,res) => {
    const {user,text,image} = req.body;
    try{
        const createdAt = new Date();
        let likes = [];
        let comments = [];
        const newPost = new PostModel({user,text,image,likes,comments,createdAt});
        await newPost.save();
        res.status(201).send({"message":"Post Added Successfully"});
    }
    catch(err){
        res.status(400).send({"error":err.message});
    }
})

postRoute.patch("/api/posts/:id",authentication,async(req,res) => {
    const id = req.params.id;
    const updatePost = req.body;
    try{
        const post = await PostModel.findByIdAndUpdate(id,updatePost);
        res.status(204).send({"message":"Post Updated Successfully"});
    }
    catch(err){
        res.status(400).send({"error":err.message});
    }
})

postRoute.delete("/api/posts/:id",authentication,async(req,res) => {
    const id = req.params.id;
    try{
        await PostModel.findByIdAndDelete(id);
        res.status(202).send({"message":"Post Deleted Successfully"});
    }
    catch(err){
        res.status(400).send({"error":err.message});
    }
})

postRoute.post("/api/posts/:id/like",authentication,async(req,res) => {
    const id = req.params.id;
    const liked = req.body;
    try{
        const post = await PostModel.findById(id);
        post.likes.push(liked);
        await PostModel.findByIdAndUpdate(id,{likes:post.likes});
        res.status(201).send({"message":"Post Liked"});
    }
    catch(err){
        res.status(400).send({"error":err.message});
    }
})

postRoute.post("/api/posts/:id/comment",authentication,async(req,res) => {
    const id = req.params.id;
    const commented = req.body;
    try{
        const post = await PostModel.findById(id);
        post.comments.push(commented);
        await PostModel.findByIdAndUpdate(id,{comments:post.comments});
        res.status(201).send({"message":"Comment Added"});
    }
    catch(err){
        res.status(400).send({"error":err.message});
    }
})

module.exports = {postRoute};