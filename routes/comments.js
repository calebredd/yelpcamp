var express = require("express"),
    router = express.Router({mergeParams:true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comments"),
    middleware=require('../middleware');

//Create new comment
router.get("/new",middleware.isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err,campground){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new",{campground:campground});
    }
  });
});
//Post new comment
router.post("/",middleware.isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err, camp){
    if(err){
      console.log(err);
      res.redirect('/campgrounds');
    }else{
      Comment.create(req.body.comment,function(err, comment){
        if(err){
          console.log(err);
        }else{
          comment.author.id=req.user._id;
          comment.author.username=req.user.username;
          comment.save();
          camp.comments.push(comment);
          camp.save();
          res.redirect('/campgrounds/'+req.params.id);
        }
      });
    }
  });
});
//Edit comment
router.get("/:commentId/edit",middleware.checkCommentOwnership,function(req,res){
  Campground.findById(req.params.id,function(err,campground){
    Comment.findById(req.params.commentId,function(err,comment){
      if(err){
        console.log(err);
      }else{
        res.render("comments/edit",{comment:comment,campground:campground});
      }
    });
  });
});
//Update Comment
router.patch("/:commentId",middleware.checkCommentOwnership,function(req,res){
 Campground.findById(req.params.id,function(err,camp){  
  Comment.findById(req.params.commentId,function(err,updateComment){    
      if(err){
        console.log(err);
      }else{
        updateComment.text=req.body.comment.text;
        updateComment.save();
        camp.save();
        res.redirect('/campgrounds/'+req.params.id);
      }
    });
  });
 });
//Delete comment
router.delete("/:commentId",middleware.checkCommentOwnership,function(req,res){
  Comment.findOneAndDelete(req.params.commentId,function(err){
    if(err){
      res.redirect("back");
    }else{
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});

module.exports=router;
