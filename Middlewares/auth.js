const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const key = process.env.key;
const {UserModel} = require("../Models/user.model");

const authentication = async (req,res,next) => {
    const token = req.headers.authorization;
    jwt.verify(token, key, async (err, decoded) => {
        if(decoded){
            let userExists = await UserModel.findById(decoded.userID);
            if(userExists){
                req.user = userExists;
                next();
            }
            else{
                res.status(400).send({"error":"Unauthorized user"});
            }
        }
        else{
            res.status(401).send({"error":"Unauthorized"});
        }
    });
}

module.exports = {authentication};