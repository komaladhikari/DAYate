import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './shared/config/mongodb.js';
import connectCloudinary from './shared/config/cloudinary.js';
import { authRouter } from "./modules/auth/index.js";
import productRouter from './routes/productRoute.js';
import planRouter from "./routes/planRoute.js";
import chatRouter from "./routes/chatRoute.js";

//app configuration
const app = express();
const port = process.env.PORT || 5001;

connectDB()
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

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
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
app.use ('/api/product', productRouter)
app.use("/api/plan", planRouter); // import plan router and use it for all routes starting with /api/plan
app.use("/api/chat", chatRouter);


app.get('/',(req,res)=>{
    res.send("API working")
})

app.listen(port, '0.0.0.0', () => console.log('server started on PORT: ' + port + ' (bound to 0.0.0.0)')) //start express server
