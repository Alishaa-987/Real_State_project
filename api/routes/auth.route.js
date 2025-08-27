import express from 'express';
import {google, signUp , signIn} from '../controllers/auth.controller.js';
import {signOut} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signUp' , signUp);
router.post('/signIn' , signIn);
router.post('/google' , google);
router.get('/signOut' , signOut);

export default router;