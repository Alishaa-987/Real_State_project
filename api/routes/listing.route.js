import express from "express";
import { createListing,getListing, getAllListings ,deleteListing , updateListing  , getListings} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();


router.get('/', getAllListings);
router.post('/create' ,verifyToken, createListing);
router.delete("/delete/:id" , verifyToken , deleteListing);
router.put('/update/:id' , verifyToken , updateListing);
router.get('/get/:id' , getListing);
router.get('/get', getListings);
export default router;