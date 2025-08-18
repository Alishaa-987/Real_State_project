import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import dotenv from 'dotenv';
dotenv.config({ path: './api/.env' }); // path is relative to where you run the script it is compulsory to define becaus i get a lot of error by not defining the path

mongoose.connect(process.env.Connection)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


app.use("/api/user" , userRouter);
app.use('/api/auth' , authRouter);
app.use((err , req , res , next )=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
})
