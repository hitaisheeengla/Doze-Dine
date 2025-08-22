const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("GET route for all users");
})

router.get("/:id",(req,res)=>{
    res.send("GET route for showing individual user");
})

router.post("/",(req,res)=>{
    res.send("POST route for adding users");
})

router.delete("/",(req,res)=>{
    res.send("DELETE route for all users");
})

module.exports = router;