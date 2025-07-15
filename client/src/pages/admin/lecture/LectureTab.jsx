import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Toaster } from '@/components/ui/sonner'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { use } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

//api endpoint
const MEDIA_API = "https://nexpath.onrender.com/api/v1/media";

const LectureTab = () => {

  const [lectureTitle, setLectureTitle] = useState('');
  const [uploadVideInfo, setUploadVideInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setbtnDisable] = useState(true);

  const params = useParams();
  const { courseId, lectureId } = params;

  //get lecture by id for populating data
  const { data: lectureData} = useGetLectureByIdQuery(lectureId);
  const lecture=lectureData?.lecture;

  console.log(lecture);

  useEffect(() => {
    if(lecture){
      setLectureTitle(lecture.lectureTitle);
      setUploadVideInfo({ videoUrl: lecture.videoUrl, publicId: lecture.publicId });
      setIsFree(lecture.isPreviewFree);
    }
  }, [lecture]);

  //for edit lecture
  const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();

  const [removeLecture,{data:removeData,isLoading:removeLoading,isSuccess:removeSuccess}]=useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        //call api
        //Sends the file to the server using an axios.post() request.
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          }
        })
        if (res.data.success) {
          console.log(res);
          setUploadVideInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id });
          setbtnDisable(false);
          toast.success(res.data.message);
        }
      }
      catch (error) {
        console.log(error);
        toast.error("Failed to upload video");
      }
      finally {
        setMediaProgress(false);
      }
    }
  }

  const editLectureHandler = async () => {
    await editLecture({
      lectureTitle,videoInfo:uploadVideInfo, isPreviewFree:isFree, courseId, lectureId
    });
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.message);
    }
  },[isSuccess, error]);

  useEffect(() => {
    if (removeSuccess) {
      toast.success("Lecture removed successfully");
    }
    else if (removeLoading) {
      toast.loading("Removing lecture...");
    }
  },[removeSuccess],[removeLoading]);

  return (
    <Card>
      <CardHeader className='flex justify-between'>
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>Make changes and click save when done.</CardDescription>
        </div>
        <div className='flex items-center gap-2'>
          <Button disabled={removeLoading} onClick={removeLectureHandler} variant="destructive">
            {
              removeLoading? <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
              Please wait
              </>:"Remove Lecture"
            }
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} type='text' placeholder='Ex. Introduction to Java' />
        </div>
        <div className='my-5'>
          <Label>Video <span className='text-red-500'>*</span></Label>
          <Input type='file'
            accept='video/*'
            placeholder='Ex. Introduction to Java'
            onChange={fileChangeHandler}
            className='w-fit' />
        </div>

        <div className='flex items-center space-x-2 my-5'>
          <div className="flex items-center space-x-2">
            <Switch checked={isFree} onCheckedChange={setIsFree} id="airplane-mode" />
            <Label htmlFor="airplane-mode">Is this video FREE?</Label>
          </div>
        </div>
        {
          mediaProgress && (
            <div className='my-4'>
              <Progress value={uploadProgress} />
              <p>{uploadProgress}% uploaded</p>
            </div>
          )
        }
        <div className='mt-4'>
          <Button disabled={isLoading} onClick={editLectureHandler}>
            {
                isLoading? <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                Please wait
                </>:"Update Lecture"
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
export default LectureTab