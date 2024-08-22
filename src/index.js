// require('dotenv').config();
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

const port = process.env.PORT || 8080;

dotenv.config({
  path: './env',
});

connectDB()
  .then(() => {
    app.on('error', (err) => {
      console.log('Error occured in express ', err);
    });

    app.listen(port, () => {
      console.log(`Server is running at ${port}`);
    });
  })
  .catch((err) => {
    console.log('Mongo DB connection failed !!!', err);
  });

/*
import mongoose from 'mongoose';
import { DB_NAME } from './constants';
import express from 'express';

const app = express();

async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on('error', (error) => {
      console.log('Error', error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log('process.env.PORT');
    });
  } catch (error) {
    console.log('error:', error);
  }
};
*/
