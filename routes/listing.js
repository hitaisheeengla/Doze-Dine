const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} =require("../cloudConfig.js");
const upload = multer({ storage });


//INDEX, CREATE
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingController.addNewListing))

//NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);


//SEARCH
router.get("/search", wrapAsync(listingController.searchListings));

//FILTER BY CATEGORY
router.get("/filter/:category", wrapAsync(listingController.filterListings));

//SHOW, EDIT, DELETE

router
.route("/:id")
.get (wrapAsync(listingController.showListing))
.put( isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.editListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


//EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))



module.exports = router;