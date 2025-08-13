 import express from "express";
 import {test} from '../controllers/user.controller.js'

 const router = express.Router();  // that how we create router through exprss

 router.get('/test' , test);

 export default router;
 // All the routers should define under indesex.js so we have to define that like calling function