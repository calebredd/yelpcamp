var middlewareObj={};
var Campground=require('../models/campground'),
    Comment=require('../models/comments');

middlewareObj.checkCampgroundOwnership=function(req,res,next){
    if(req.isAuthenticated()){
      Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
          res.redirect('back');
        }else{
          if(foundCampground.author.id.equals(req.user._id)){
            return next();
          }else{
            req.flash("error",'You do not have permission to do that!');
            res.redirect("back");
          }
        }
      });
    }
}

middlewareObj.checkCommentOwnership=function(req,res,next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.commentId,function(err,foundComment){
      if(err){
        res.redirect('back');
      }else{
        if(foundComment.author.id.equals(req.user._id)){
          return next();
        }else{
          req.flash("error",'You do not have permission to do that!');
          res.redirect("back");
        }
      }
    });
  }
}
middlewareObj.isLoggedIn=function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error','Please Login First!');
  res.redirect('/login');
 }
module.exports=middlewareObj;
