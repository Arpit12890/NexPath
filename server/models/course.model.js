import mongoose from "mongoose";

const courseSchema= new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true
    },
    subTitle: { 
        type: String
    },
    description: {
        type: String
    },
    category: { 
        type: String,
        required: true
    },
    courseLevel: {  
        type: String,
        enum: ['Beginner', 'Medium', 'Advance']
    },
    coursePrice: {
        type: Number
    },
    courseThumbnail: {
        type: String
    },  
    //one course can have multiple students
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    //one course can have multiple lectures
    lectures: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lecture'
        }
    ],
    //single creator of one course
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isPublished: {
        type: Boolean,
        default: false
    }
},{timestamps: true});

const Course=mongoose.model('Course',courseSchema);

export default Course;


