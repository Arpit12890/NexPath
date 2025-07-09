import mongoose from "mongoose";

//create a schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:['instructor','student'],
        default:'student'
    },
    //array of references to another table which is course here.
    //relation between user and course.
    enrolledCourses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Course'
        }
    ],
    photoUrl:{
        type:String,
        default:''
    }
},{timestamps:true});

//create a model
export const User=mongoose.model('User',userSchema);

