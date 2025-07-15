import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useCompleteCourseMutation, useGetCourseProgressQuery, useIncompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi';
import { CheckCircle2, CirclePlay } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { use } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

  const [updateLectureProgress]=useUpdateLectureProgressMutation();

  const [completeCourse,{data:markCompletedData,isSuccess:completedSuccess}]=useCompleteCourseMutation();

  const [incompleteCourse,{data:markInCompletedData,isSuccess:incompletedSuccess}]=useIncompleteCourseMutation();

  useEffect(() => {
    if (completedSuccess) {
      toast.success(markCompletedData.message);
    }
    if (incompletedSuccess) {
      toast.success(markInCompletedData.message);
    }
  },[completedSuccess,incompletedSuccess]);

  const [currentLecture, setCurrentLecture] = useState(null);

  if (isLoading) {
    return <p>Loading...</p>
  }
  if (isError) {
    return <p>Error...</p>
  }

  console.log(data)

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  //initialize the first lec if not exist
  const initialLecture = currentLecture || courseDetails.lectures && courseDetails.lectures[0];

  //handle which lecture is completed or not
  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed === true);
  }

  //handle lecture progress
  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId })
    refetch();
  }

  //handle select a specific lecture to watch
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  }


  //for handling complete or incomplete course
  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
    refetch();
  }

  const handleIncompleteCourse = async () => {
    await incompleteCourse(courseId); 
    refetch();
  }

  return (
    <div className='max-w-7xl mx-auto p-4'>
      {/* display course name */}
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl font-bold'>
          {courseTitle}
        </h1>
        <Button onClick={completed?handleIncompleteCourse:handleCompleteCourse}
        variant={completed?"outline":"default"}>
          {
            completed?(
              <div className='flex items-center'>
                <CheckCircle2 className='h-4 w-4 mr-2'/><span>Completed</span>
              </div>
            ):(
              "Mark as Completed"
            )
          }
        </Button>
      </div>

      <div className='flex flex-col md:flex-row gap-6'>
        {/* video section */}
        <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture?.videoUrl}
              controls
              className='w-full h-auto md:rounded-lg'
              onPlay={()=>handleLectureProgress(currentLecture?._id || initialLecture._id)}
            ></video>
          </div>
          {/* display current watching lecture title */}
          <div className='mt-2'>
            <h3 className='font-medium text-lg
          '>
              {
                `Lecture ${courseDetails.lectures.findIndex((lec) => lec._id === (currentLecture?._id || initialLecture?._id)) + 1} : ${currentLecture?.lectureTitle || initialLecture?.lectureTitle}`
              }
            </h3>
          </div>
        </div>

        {/* lecture Sidebar */}
        <div className='flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0'>
          <h2 className='font-semibold text-xl mb-4'>Course Lecture</h2>
          <div className='flex-1 overflow-y-auto'>
            {
              courseDetails?.lectures.map((lecture) => (
                <Card key={lecture._id} className={`mb-3 hover:cursor-pointer transition transform ${lecture._id===currentLecture?._id ? 'bg-gray-200 dark:bg-gray-800' : ''} shadow-md rounded-lg`}
                onClick={()=>handleSelectLecture(lecture)}>
                  <CardContent className='flex items-center justify-between p-4'>
                    <div className='flex items-center'>
                      {
                        isLectureCompleted(lecture._id) ? (
                          <CheckCircle2 size={24} className='text-purple-500 mr-2' />
                        ) : (
                          <CirclePlay size={24} className='text-gray-500 mr-2' />
                        )
                      }
                      <div>
                        <CardTitle className='text-lg font-medium'>{lecture.lectureTitle}</CardTitle>
                      </div>
                    </div>
                    {
                      //if true then show completed badge
                      isLectureCompleted(lecture._id) && (
                        <Badge className='bg-purple-200 text-purple-600'>Completed</Badge>
                      )
                    }
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseProgress