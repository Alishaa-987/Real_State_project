import express from "express";
import { createListing, getAllListings } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();


router.get('/', getAllListings);
router.post('/create' ,verifyToken, createListing);

export default router;