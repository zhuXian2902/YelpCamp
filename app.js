var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    // Campground = require('./models/campground'),
    // Comment = require('./models/comment'),
    passport = require('passport'),
    LocalStrategy = require('passport-local');
    User = require('./models/user');
    // User = require('./models/user');
var campgroundRoutes = require('./routes/campground'),
     commentRoutes    = require('./routes/comment'),
    indexRoutes      = require('./routes/auth');

mongoose.connect("mongodb://localhost:27017/yelp_camp_v3",{useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine" , "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
    secret: "I love Barca although it's not the same",
    resave : false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res , next){
    res.locals.currUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);



//schema set

// Campground.create(
//     {name :"Granite hill" , image : "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" ,
// description:"enjoying it!"} , function(err , campground){
//     if(err) {
//         console.log(err);
//     }
//     else {
//         console.log(campground);
//     }
// })

//


// const ejsLint = require('ejs-lint');

app.listen(3000 , function(){
    console.log("server started");
});
