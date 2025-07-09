import { populate } from "dotenv";
import Course from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMedia, uploadMedia } from '../utils/cloudinary.js';


export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({ message: "Course title and category is required" });
        }
        //create a new course
        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        })
        return res.status(201).json({
            course,
            message: "Course created successfully"
        });

    }
    catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Failed to create course" });
    }
}
//for getting all courses of a particular creator
export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({
                courses: [],
                message: "No courses found"
            });
        }
        return res.status(200).json({
            courses,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get courses" });
    }
}
//for updating course
export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        //if course found then update
        //destroy old thumbnail
        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMedia(publicId);//delete old thumbnail              
            }
            //upload thumbnail on cloudinary
            courseThumbnail = await uploadMedia(thumbnail.path);

        }
        //collect updated data
        const updateData = { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url };

        //update course
        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        return res.status(200).json({
            course,
            message: "Course updated successfully"
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to update course" });
    }
}

//for geting course data by id
export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json({
            course,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get course" });
    }
}
//logic for lecture create
export const createLecture = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { lectureTitle } = req.body;

        if (!lectureTitle || !courseId) {
            return res.status(400).json({ message: "Lecture title is required" });
        }

        //create lecture
        const lecture = await Lecture.create({
            lectureTitle
        });
        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id)
            await course.save();
        }
        return res.status(201).json({
            lecture,
            message: "Lecture created successfully."
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to create lecture" });
    }
}
//for getting all lectures of a particular course
export const getCourseLecture = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId).populate("lectures"); //gives all lectures data
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json({
            lectures: course.lectures,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get lectures" });
    }
}

//for updating lecture
export const editLecture = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;

        let lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }
        // //delete old media from cloudinary
        // if(lecture.publicId){
        //     await deleteMedia(lecture.publicId);
        // }
        //if lecture found then update
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        //ensure the course still has the lecture id if it was not already added it.
        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        }
        return res.status(200).json({
            lecture,
            message: "Lecture updated successfully"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to update lecture" });
    }
}
//for remove lecture
export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        let lecture = await
            Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }
        //delete the lecture media from cloudinary as well
        if (lecture.publicId) {
            await deleteMedia(lecture.publicId);
        }

        //remove the lecture reference from the course
        await Course.updateOne(
            { lectures: lectureId },//find the course with the lecture id
            { $pull: { lectures: lectureId } }//remove the lecture id from the course
        )
        return res.status(200).json({
            message: "Lecture removed successfully."
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to remove lecture" });
    }
}
//for getting lecture by id
export const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }
        return res.status(200).json({
            lecture,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get lecture" });
    }

}

//logic for course is published or not.
export const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query;//true or false
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        //publish status based on the query parameter
        course.isPublished = publish === 'true';
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message: `Course ${statusMessage} successfully`
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to update status" });
    }
}

//for searching course
export const searchCourse = async (req, res) => {
    try {
        const { query = "", categories = [], sortByPrice = "" } = req.query;

        //create search query

        //$regex is used to perform pattern matching on string fields (like "search").
        // query is the search term you're matching against.
        // $options: "i" makes the search case-insensitive.
        const searchCriteria = {
            $or: [
                { courseTitle: { $regex: query, $options: "i" } },
                { subTitle: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]
        }

        //if categories selected
        //$in is used to match any of the values in the array to category field.
        //filtering the courses based on the selected categories.
        if(categories.length>0){
            searchCriteria.category={$in: categories}
        }

        //define sorting order
        const sortOptions={};
        if(sortByPrice==="low"){
            sortOptions.coursePrice=1;//ascending order
        }
        else if(sortByPrice==="high"){
            sortOptions.coursePrice=-1;//descending order
        }

        //search course
        let courses=await Course.find(searchCriteria).populate({path:"creator",select:"name photoUrl"}).sort(sortOptions);

        return res.status(200).json({
            courses: courses||[],//if courses exist then return it otherwise return empty array
            message: "Courses found successfully"
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to search course" });
    }
}

//get published courses display it on home page
export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "name photoUrl" });
        if (!courses) {
            return res.status(404).json({
                message: "No courses found"
            });
        }
        return res.status(200).json({
            courses,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get courses" });
    }
}

