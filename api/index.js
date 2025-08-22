import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import bcrypt from 'bcryptjs';
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import dotenv from 'dotenv';
dotenv.config({ path: './api/.env' }); // path is relative to where you run the script it is compulsory to define becaus i get a lot of error by not defining the path


const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",   // frontend ka URL
  credentials: true
}));




app.use('/api/auth' , authRouter);
app.use("/api/user" , userRouter);

app.use((err , req , res , next )=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});



mongoose.connect(process.env.Connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() =>{
  console.log('✅ MongoDB connected')
  app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
})
.catch(err => console.error('❌ Connection error:', err));






