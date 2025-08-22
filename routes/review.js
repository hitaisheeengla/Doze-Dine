const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {reviewSchema}=require("../schema.js");


const validateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

//REVIEWS
//POST REVIEWS
router.post("/", validateReview,wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review added successfully");
    res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEWS
router.delete("/:reviewId", wrapAsync(async(req,res,next)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;