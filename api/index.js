import express from 'express';
import dotenv from 'dotenv';

dotenv.config({'path': './api/.env'});
import cors from "cors";


import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';


const app = express();

mongoose
  .connect(process.env.Connection)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });


  app.use(cors({
  origin: "https://real-state-project-livid.vercel.app",  // yahan apna Vercel ka domain likho
  credentials: true
}));



  const __dirname = path.resolve();


app.use(express.json());

app.use(cookieParser());



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


app.use(express.static(path.join(__dirname, '/client/dist')));


app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});