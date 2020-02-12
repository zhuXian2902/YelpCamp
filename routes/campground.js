var express = require('express');
var router = express.Router();
var Campground = require("../models/campground")

router.get("/campgrounds" , function(req , res){
    Campground.find({} , function(err , allcampgrounds){
        if(err)
          console.log(err);
        else
          res.render("campgrounds/index" , {campgrounds:allcampgrounds , currUser:req.user});
    });
});

router.post("/campgrounds" , isLoggedIn , function(req , res){
    // res.send("hey");
    var name = req.body.name;
    var price = req.body.price;
    var image =  req.body.image;
    var desc = req.body.desc;
    var author = {
      id: req.user._id,
      username: req.user.username
    }
    var campground = {name : name,price:price ,image : image , description:desc , author:author};
    // campgrounds.push(campground);
    Campground.create(campground , function(err , newly){
        if(err)
            console.log(err);
        else
            console.log(newly);
            res.redirect("/campgrounds");
    })

})

router.get("/campgrounds/new" , isLoggedIn , function(req , res){
    res.render("campgrounds/new");
})

router.get("/campgrounds/:id" , function(req , res){
    Campground.findById(req.params.id).populate("comments").exec(function(err , foundcampground){
        if(err)
            console.log(err)
        else{
            // console.log(foundcampground);
            res.render("campgrounds/show" , {campground:foundcampground});
        }
    });
});

router.get("/campgrounds/:id/edit" , check , function(req , res){
    Campground.findById(req.params.id , function(err , foundCampground){
        if(err)
            req.flash("error" , "you don't have permission.");
        res.render("campgrounds/edit" , {campground:foundCampground});
      })
});

router.put("/campgrounds/:id" , check , function(req , res){
    // var data = {name:req.body.name , image:req.body.image , desc:req.body.desc};
    Campground.findByIdAndUpdate(req.params.id , req.body.campground , function(err , updatedCampground){
        if(err){
          console.log(err);
          res.redirect("/campgrounds");
        }else {
          res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
router.delete("/campgrounds/:id" , check , function(req , res){
    Campground.findByIdAndRemove(req.params.id , function(err){
      if(err){
        res.redirect("/campgrounds");
      }
      else {
        res.redirect("/campgrounds")
      }
    })
})


function isLoggedIn(req , res , next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","please Login first to do that!");
    res.redirect("/login");
}

function check(req , res , next) {
  if(req.isAuthenticated()){
    Campground.findById(req.params.id , function(err , foundCampground){
      if(err){
        req.flash("error" , "campground don't found");
        res.redirect("back");
      }else {
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }
        else {
          req.flash("error" , "you don't have permission.");
          res.redirect("back");
        }
    }
  });
  }
  else {
    req.flash("error" , "You need to LogIn for that!")
    res.redirect("back");
  }
}

module.exports = router;
