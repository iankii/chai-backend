import express from 'express';
import cors from cors;
import cookieParser from 'cookie-parser';

const app = express();

// app.use is used for middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
    // TODO: read more options
}))

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public")) // to access public files like images
app.use(cookieParser())


export { app };
