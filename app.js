if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const db_url = process.env.MONGO_ATLAS;

main().then(() => { console.log("connected to DB") }).catch(err => console.log(err));

async function main() {
    await mongoose.connect(db_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: db_url,
    touchAfter: 24 * 60 * 60,// time period in seconds
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600
});

store.on("error",(e)=>{
    console.log("SESSION STORE ERROR",e);
});
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7 ,// 7 days
        httpOnly: true, // Helps prevent XSS attacks
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demoUser", async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"hitaishee"
//     })
//     let registeredUser =await User.register(fakeUser,"chotupassword");
//     res.send(registeredUser);
// } )
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",user);

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", { message });
})


app.use((req, res) => {
      res.status(404).send("<h1>Oops! Page not found.</h1>");
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
})