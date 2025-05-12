import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbConnection } from './config/db.js';
import authRouter from './routes/auth.route.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Fix __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// API Routes
app.use('/api/auth', authRouter);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, 'frontend', 'dist');
    app.use(express.static(frontendPath));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(frontendPath, 'index.html'));
    });
}

// Start server and connect to DB
app.listen(PORT, async () => {
    try {
        await dbConnection();
        console.log('✅ Connected to MongoDB');
        console.log(`🚀 Server running on port ${PORT}`);
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
    }
});
