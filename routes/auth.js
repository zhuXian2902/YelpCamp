var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');

router.get("/" , function(req , res){
    res.render("landing");
});

router.get("/register" , function(req , res){
    res.render("register");
})

router.post("/register" , function(req ,res){
    // req.assert('username', 'username cannot be blank').notEmpty();
    var newUser = new User({username:req.body.username})
    User.register(newUser , req.body.password , function(err , user){
        if(err){
            req.flash("error" , err.message);
            res.redirect("register");
        }
        passport.authenticate("local")(req , res , function(){
            req.flash("success" , "Welcome to YelpCamp "+user.username);
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login" , function(req ,res){
    res.render("login");
})

router.post("/login" ,passport.authenticate("local",
 {
   successRedirect:"/campgrounds",
   failureRedirect:"/login",
   failureFlash:true,
   successFlash:"Welcome Back!"
 }), function(req , res){

})

router.get("/logout" , function(req , res){
    req.logout();
    req.flash("success" , "Logged you out!")
    res.redirect("/campgrounds");
});

function isLoggedIn(req , res , next){
    if(is.isAuthenticated()){
      return next();
    }
    req.flash("error","please Login first to do that!");
    res.redirect("/login");
}

module.exports = router;
