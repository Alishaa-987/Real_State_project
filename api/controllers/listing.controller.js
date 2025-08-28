import Listing from "../models/listing.model.js";
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      userRef: req.user.id,   // 👈 logged-in user ki ID yaha store hogi
    });

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};


// Get all listings
export const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
