import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js'
import dotenv from 'dotenv';
dotenv.config({ path: './api/.env' }); // path is relative to where you run the script it is compulsory to define becaus i get a lot of error by not defining the path

mongoose.connect(process.env.Connection)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


app.use("/api/user" , userRouter);
