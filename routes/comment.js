var express = require('express');
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/campgrounds/:id/comments/new", isLoggedIn , function(req , res){
    Campground.findById(req.params.id,function(err , campground) {
        res.render("comments/new",{campground:campground});
        })
    })

router.post("/campgrounds/:id/comments" , isLoggedIn ,function(req , res){
    Campground.findById(req.params.id , function(err , campground) {
        if(err){
            req.flash("error" , "server is down");
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment,function(err , comment) {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash("success" , "comment added successully.");
                res.redirect("/campgrounds/"+campground._id);
            });
        }
    })
});

router.get("/campgrounds/:id/comments/:comment_id/edit" ,checkComment , function(req , res){
    // console.log(req.comment.text);
    Comment.findById(req.params.comment_id , function(err , comment){
      if (err) {
        req.flash("error" , "you don't have permission.");
          res.redirect("/campgrounds")
      }else {
          res.render("comments/edit" ,{campId : req.params.id , comment:comment});
      }
    })
});

router.put("/campgrounds/:id/comments/:comment_id" , checkComment ,  function(req , res){
    Comment.findByIdAndUpdate(req.params.comment_id , req.body.comment , function(err , data){
        if (err) {
          req.flash("error" , "you don't have permission.");
            res.redirect("back");
        }else {
          res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

router.delete("/campgrounds/:id/comments/:comment_id" , checkComment , function(req , res){
    Comment.findByIdAndRemove(req.params.comment_id , function(err , comment){
        if (err) {
          req.flash("error" , "you don't have permission.");
            res.redirect("back")
        }else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

function checkComment(req , res , next){
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id , function(err , comment) {
            if(err){
               res.redirect("back");
            }else {
                if(comment.author.id.equals(req.user._id)){
                    next();
                }else {
                  req.flash("error" , "you don't have permission.");
                    res.redirect("back");
                }
            }
        })
    }else {
      req.flash("error" , "You need to LogIn for that!");
      res.redirect("back");
    }
}

function isLoggedIn(req , res , next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","please Login first to do that!");
    res.redirect("/login");
}

module .exports = router;
