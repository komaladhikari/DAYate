import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';

//app configuration
const app = express();
const port = process.env.PORT || 5001;

connectDB()
connectCloudinary()

//middlewares
app.use(express.json()); //whatever request we will get will be passed using the json
app.use(cors()); //can access backend from any ip address
 
//api endpoints
//imports user router from userRoute.js and uses it for all routes starting with /api/user
app.use('/api/user', userRouter)
app.get('/',(req,res)=>{
    res.send("API working")
})

app.listen(port, '0.0.0.0', () => console.log('server started on PORT: ' + port + ' (bound to 0.0.0.0)')) //start express server