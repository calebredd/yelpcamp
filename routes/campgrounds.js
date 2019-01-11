var express=require("express"),
Campground=require("../models/campground"),
    router=express.Router({mergeParams:true}),
    middleware=require('../middleware');
//INDEX route
router.get('/',function(req,res){
  Campground.find({},function(err,campgrounds){
    if(err){
        res.redirect('back');
    }else{
    res.render('campgrounds/index',{campgrounds:campgrounds});
    }
  });
});
//NEW route --show form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
  res.render("campgrounds/new");
});
//Show route --shows info about one campground
router.get('/:id',function(req,res){
  Campground.findById(req.params.id).populate('comments').exec(function(err,foundCampground){
    if(err){
        res.redirect('back');
    }else{
      res.render("campgrounds/show",{campground:foundCampground});
    }
  });
});
// create route --add new campground to database (db)
router.post("/",middleware.isLoggedIn,function(req,res){
  var name= req.body.name;
  var image= req.body.image;
  var price=req.body.price;
  var description= req.body.description;
  var author={
    username:req.user.username,
    id:req.user._id
  }
  var newCamp={name:name,image:image,price:price,description:description,author:author};
  Campground.create(newCamp,function(err, camp){
    if(err){
        res.redirect('back');
    }else{
      res.redirect('/campgrounds');
    }
  });
});
//Edit  --shows edit form
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findById(req.params.id,function(err,campground){
    if(err){
      res.redirect('back');
    }else{
      res.render('campgrounds/edit',{campground:campground});
      }
  });
});
//Update  --update one dog, then redirect
router.patch("/:id",middleware.isLoggedIn,function(req,res){
  Campground.updateOne({"_id":req.params.id},req.body.camp,function(err,camp){
  if(err){
    res.redirect('back');
  }else{
    res.redirect('/campgrounds/'+req.params.id);
  }
  });
});
//Destroy
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.deleteOne({'_id':req.params.id},function(err, camp){
      if(err){
        res.redirect('back');
      }else{
         res.redirect('/campgrounds');
      }
    });
});

  module.exports=router;
