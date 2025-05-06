import express from 'express'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import cors from 'cors'
import { dbConnection } from './config/db.js';
import authRouter from './routes/auth.route.js';

// Config
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


// Routes
app.use('/api/auth', authRouter);


app.listen(process.env.PORT || 8081, () => {
    dbConnection().then(() => {
        console.log(`Connected to Mongo DB.`)
    }).catch((error) => {
        console.log(`Error while connecting to mongo db. : ${error}`)
    });
    console.log(`Server listening on port ${process.env.PORT || 8081}`);
});