import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';

export const signUp = async (req , res)=>{
    const {username , email , password} = req.body;
    const hashPassword = await bcryptjs.hashSync(password , 12);
    const newUser = new User ({username , email , password:hashPassword});
    await newUser.save();
    res.status(201).json("User created successfully")
    
};