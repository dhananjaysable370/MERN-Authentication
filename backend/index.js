import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbConnection } from './config/db.js';
import router from './routes/auth.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Set up directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "*",
    credentials: true
}));

// API Routes
app.use('/api/auth', router);

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

const startServer = async () => {
    try {
        dbConnection();
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

startServer();