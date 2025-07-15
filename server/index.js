//create an server
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connect } from 'mongoose';
import connectDB from './database/db.js';
import userRoute from './routes/user.route.js';
import courseRoute from './routes/course.route.js';
import mediaRoute from './routes/media.route.js';
import purchaseRoute from './routes/purchaseCourse.route.js';
import courseProgressRoute from './routes/courseProgress.route.js';
import path from 'path';

dotenv.config();//it allow .env file to be used in any file.

//call database connection here
connectDB();
const app = express();
const PORT = process.env.PORT || 5000; //if process.env.PORT is not available then use 5000

const _dirname=path.resolve(); //directory ka path mil jayega

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

//apis endpoint
app.use("/api/v1/media",mediaRoute) 
app.use("/api/v1/user",userRoute) 
//"https://localhost:3000/api/v1/user/register" register wala endpoint pe jayega
app.use("/api/v1/course",courseRoute)
app.use('/api/v1/purchase',purchaseRoute)
app.use('/api/v1/progress',courseProgressRoute)

//serve frontend files on localhost:3000
app.use(express.static(path.join(_dirname, '/client/dist')));

app.get('*',(req,res)=>{
    res.sendFile(path.resolve(_dirname,'client','dist','index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


