import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './shared/config/mongodb.js';
import connectCloudinary from './shared/config/cloudinary.js';
import { authRouter } from "./modules/auth/index.js";
import { planRouter } from "./modules/plans/index.js";
import { chatRouter } from "./modules/chat/index.js";
import { calendarRouter } from "./modules/calendar/index.js";
import { shareRouter } from "./modules/share/index.js";
import { restaurantRouter } from "./modules/restaurants/index.js";
import { giftRouter } from "./modules/gifts/index.js";
import { aiRouter } from "./modules/ai/index.js";
import { businessRouter } from "./modules/business/index.js";
import { adminRouter } from "./modules/admin/index.js";


//app configuration
const app = express();
const port = process.env.PORT || 5001;

connectCloudinary()

//middlewares
app.use(express.json()); //whatever request we will get will be passed using the json

const allowedOrigins = [
    'http://localhost:5173',
    'https://da-yate-livid.vercel.app',
    ...((process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
        .split(',')
        .map((origin) => origin.trim().replace(/\/$/, ''))
        .filter(Boolean)),
];

const isLocalViteOrigin = (origin) =>
    /^http:\/\/(localhost|127\.0\.0\.1):517\d$/.test(origin);

app.use(cors({
    origin(origin, callback) {
        const normalizedOrigin = origin?.replace(/\/$/, '');

        if (
            !origin ||
            allowedOrigins.includes(normalizedOrigin) ||
            isLocalViteOrigin(normalizedOrigin)
        ) {
            callback(null, true);
            return;
        }

        callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
}));
 
//api endpoints

//imports user router from userRoute.js and uses it for all routes starting with /api/user
app.use("/api/user", authRouter);
app.use("/api/plan/share", shareRouter);
app.use("/api/plan", planRouter); // import plan router and use it for all routes starting with /api/plan
app.use("/api/chat/calendar", calendarRouter);
app.use("/api/chat", chatRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/gifts", giftRouter);
app.use("/api/ai", aiRouter);
app.use("/api/business", businessRouter);
app.use("/api/admin", adminRouter);


app.get('/',(req,res)=>{
    res.send("API working")
})

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, '0.0.0.0', () =>
            console.log('server started on PORT: ' + port + ' (bound to 0.0.0.0)')
        );
    } catch (error) {
        console.error(`Could not connect to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

startServer();
