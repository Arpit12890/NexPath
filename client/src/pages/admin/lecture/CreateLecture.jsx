import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { use } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const createlecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  //for create lecture
  const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();

  //get lecture
  const { data: lectureData, isLoading: lectureLoading,isError:lectureError,refetch } = useGetCourseLectureQuery(courseId);


  const createLectureHandler = async () => {
    await createLecture({ courseId, lectureTitle })
  };

  //display toast
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  console.log(lectureData);

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add lecture, add some basic course details for your new lectures
        </h1>
        <p className="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
          laborum!
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="courseTitle"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Title Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/admin/course/${courseId}`)}>
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create lecture"
            )}
          </Button>
        </div>
        <div className='mt-10'>
          {
            lectureLoading ? (
              <p>Loading lectures..</p>
            ) : lectureError ? (
              <p>Failed to load lectures</p>
            ) : lectureData.lectures.length === 0 ? (
              <p>No lectures available</p>
            ) : (
              lectureData.lectures.map((lecture,index) => (
                <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index} />
              ))
            )}
        </div>
      </div>
    </div>
  )
}

export default createlecture