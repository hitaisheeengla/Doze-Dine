const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");


router.get("/", wrapAsync(listingController.index));

router.get("/new", isLoggedIn, listingController.renderNewForm);
//SHOW
router.get("/:id", wrapAsync(listingController.showListing))

//EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

//ADD LISTING
router.post("/", validateListing, isLoggedIn,wrapAsync(listingController.addNewListing));

//UPDATE LISTING
router.put("/:id", isLoggedIn,isOwner, wrapAsync(listingController.editListing))

//DELETE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))

module.exports = router;