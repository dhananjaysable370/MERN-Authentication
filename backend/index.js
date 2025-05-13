import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbConnection } from './config/db.js';
import authRouter from './routes/auth.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

const _dirname = path.resolve()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use('/api/auth', authRouter);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
})

app.listen(PORT, async () => {
    try {
        await dbConnection();
        console.log('✅ Connected to MongoDB');
        console.log(`🚀 Server running on port ${PORT}`);
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
    }
});
