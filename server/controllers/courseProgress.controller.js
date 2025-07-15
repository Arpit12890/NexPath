import {CourseProgress} from "../models/courseProgress.model.js";
import Course from "../models/course.model.js";

//get course progress by course id
export const getCourseProgress = async (req, res) => {
    try {

        const { courseId } = req.params;
        const userId = req.id;

        //step1 fetch the user course progress
        let courseProgress = await CourseProgress.findOne({ userId, courseId }).populate('courseId');

        const courseDetails = await Course.findById(courseId).populate('lectures');

        if (!courseDetails) {
            return res.status(404).json({ message: "Course details not found" });
        }

        //step2 if no progress found,return course details with an empty progress
        if (!courseProgress) {
            return res.status(200).json({
                data: {
                    courseDetails,
                    progress: [],
                    completed: false
                }
            });
        }

        //step-3 return the users course progress along with course details

        return res.status(200).json({
            data: {
                courseDetails,
                progress: courseProgress.lectureProgress,
                completed: courseProgress.completed
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//update lecture progress
export const updateLectureProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.id;

        //fetch or create course progress
        let courseProgress = await CourseProgress.findOne({ userId, courseId });

        if (!courseProgress) {
            //if no progress exist,create a new record
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed: false,
                lectureProgress: []
            });
        }
        //find the lec progress in the course progress
        const lectureIndex=courseProgress.lectureProgress.findIndex((lecture)=>lecture.lectureId===lectureId);

        if(lectureIndex!==-1){
            //if lecture already exist,update its status
            courseProgress.lectureProgress[lectureIndex].viewed=true;
        }
        else{
            //add new lecture progress
            courseProgress.lectureProgress.push({
                lectureId,
                viewed:true,
            })
        } 
        //if all lecture is completed
        const lectureProgressLength=courseProgress.lectureProgress.filter((lectureprog)=> lectureprog.viewed===true).length;

        const course=await Course.findById(courseId);

        if(course.lectures.length===lectureProgressLength){
            courseProgress.completed=true;
        }

        await courseProgress.save();

        return res.status(200).json({
            message: "Lecture progress updated successfully."
        });
    }

    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//mark as completed to course progress
export const markAsCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        //fetch course progress
        const courseProgress = await CourseProgress.findOne({ userId, courseId });

        if (!courseProgress) {
            return res.status(404).json({ message: "Course progress not found" });
        }

        //mark as completed
        courseProgress.lectureProgress.map((lectureProgress)=>lectureProgress.viewed=true);
        courseProgress.completed = true;

        await courseProgress.save();

        return res.status(200).json({
            message: "Course marked as completed."
        });   
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//mark as incompleted to course progress
export const markAsInCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        //fetch course progress
        const courseProgress = await CourseProgress.findOne({ userId, courseId });

        if (!courseProgress) {
            return res.status(404).json({ message: "Course progress not found" });
        }

        //mark as Incompleted
        courseProgress.lectureProgress.map((lectureProgress)=>lectureProgress.viewed=false);
        courseProgress.completed = false;

        await courseProgress.save();

        return res.status(200).json({
            message: "Course marked as Incompleted."
        });   
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


