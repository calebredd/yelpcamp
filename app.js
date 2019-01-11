var express   =require("express"),
    app       =express(),
    port      =process.env.PORT || 3000,
    bodyParser=require("body-parser"),
    mongoose  =require("mongoose"),
    Campground=require("./models/campground"),
    Comment   =require("./models/comments"),
    User      =require("./models/user"),
    request   =require("request"),
    seedDB    =require("./seed"),
    passport  =require('passport'),
    LocalStrategy=require('passport-local'),
    flash     =require('connect-flash'),
    methodOverride=require('method-override');

var commentRoutes   =require('./routes/comments'),
    campgroundRoutes=require('./routes/campgrounds'),
    indexRoutes     =require('./routes/index');

//seedDB();
//mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser:true});
mongoose.connect("mongodb://reddwebdev:kadfejvuf7@ds153824.mlab.com:53824/yelpcampreddwebdev");
app.set("view engine","ejs");
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use(require('express-session')({
  secret:"This is a secret",
  resave:false,
  saveUninitialized:false
}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
  res.locals.currentUser=req.user;
  res.locals.error=req.flash('error');
  res.locals.success=req.flash('success');
  next();
});
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(indexRoutes);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//app.use("request");

  app.listen(port,function(){
    console.log("Yelpcamp has begun...");
  });
