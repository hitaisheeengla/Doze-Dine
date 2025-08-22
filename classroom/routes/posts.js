const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("GET route for all posts");
})

router.get("/:id",(req,res)=>{
    res.send("GET route for showing individual post");
})

router.post("/",(req,res)=>{
    res.send("POST route for adding posts");
})

router.delete("/",(req,res)=>{
    res.send("DELETE route for posts");
})

module.exports = router;