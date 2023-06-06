const express = require("express");
const {connection} = require("./Configs/db");
require("dotenv").config();
const port = process.env.port;
const {userRoute} = require("./Routes/user.route");
const {postRoute} = require("./Routes/post.route");

const app = express();

app.use(express.json());

app.use("/api",userRoute);
app.use("/api",postRoute);

app.get("/",(req,res) => {
    res.status(200).send({"message":"This is the backend server for the social media app"});
})

app.listen(port,async() => {
    try{
        await connection;
        console.log(`Connected to Database`);
        console.log(`Sever is running at port ${port}`);
    }
    catch(err){
        console.log(err.message);
    }
})