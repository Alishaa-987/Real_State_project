 import express from "express";
 import { deleteUser  , getUserListings , getUser} from "../controllers/user.controller.js";
 import {test} from '../controllers/user.controller.js'
 import { verifyToken } from "../utils/verifyUser.js";
 import { updateUser } from "../controllers/user.controller.js";
 const router = express.Router();  // that how we create router through exprss

 router.get('/test' , test);
 router.post('/update/:id' , verifyToken , updateUser);
 router.delete('/delete/:id' , verifyToken , deleteUser);
 router.get('/listings/:id', verifyToken , getUserListings);
 router.get('/:id' , verifyToken , getUser)


 export default router;
 // All the routers should define under indesex.js so we have to define that like calling function