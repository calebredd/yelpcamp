var express=require("express"),
    User=require('../models/user'),
    passport  =require('passport'),
    middleware=require('../middleware');
    router=express.Router({mergeParams:true});
//get landing page
router.get("/",function(req,res){
  res.render('landing');
});
//Auth Routes
router.get('/secret',middleware.isLoggedIn,function(req,res){
  res.render('secret');
});
//Register Routes
router.get('/register',function(req,res){
  res.render('register');
});
router.post('/register',function(req,res){
  var newUser=new User({username:req.body.username});
  User.register(newUser,req.body.password,function(err,user){
    if(err){
      req.flash('error',err.message);
      res.render('register');
    }
    passport.authenticate("local")(req,res,function(){
      req.flash('success','Account successfully created!');
      res.redirect('/secret');
    });
  });
});
//Login Routes
router.get('/login',function(req,res){
  res.render('login');
});
router.post('/login',passport.authenticate("local",{
  successRedirect:'/secret',
  failureRedirect:'/login'
  }),function(req,res){
});
//Logout ROUTES
router.get('/logout',function(req,res){
  req.logout();
  req.flash("success","Successfully Logged Out!");
  res.redirect('/');
});

module.exports=router;
