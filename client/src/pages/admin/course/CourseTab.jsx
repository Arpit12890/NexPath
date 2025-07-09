import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/ui/RichTextEditor.jsx';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from '@/features/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';


const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: '',
    subtitle: '',
    description: '',
    category: '',
    courseLevel: '',
    coursePrice: '',
    courseThumbnail: ''
  });

  //for getting data
  const params=useParams();
  const courseId=params.courseId;

  const {data:courseByIdData,isLoading:courseByIdLoading,refetch}=useGetCourseByIdQuery(courseId);

  //for publishing and unpublishing course
  const [publishCourse,{}]=usePublishCourseMutation();

  //now populate the input fields with the data
  useEffect(()=>{
    if(courseByIdData?.course){
      const course=courseByIdData?.course;
      setInput({
        courseTitle:course.courseTitle,
        subtitle:course.subTitle,
        description:course.description,
        category:course.category,
        courseLevel:course.courseLevel,
        coursePrice:course.coursePrice,
        courseThumbnail:course.courseThumbnail
      })
    }
  },[courseByIdData])

  const [previewThumbnail, setPreviewThumbnail] = useState('');

  const navigate = useNavigate();

  //use edit course mutation
  const [editCourse,{data,isLoading,isSuccess,error}]=useEditCourseMutation();

  //for getting data
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  }

  const selectCategory = (value) => {
    setInput({ ...input, category: value })
  }

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value })
  }

  //get file
  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file })
      //for showing preview on browser use file reader to convert file to url
      const fileReader = new FileReader();
      fileReader.onloadend = () =>
        setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  }
  const updateCourseHandler = async() => {
    //convert input into formdata
    const formData=new FormData();
    //key value pair
    formData.append("courseTitle",input.courseTitle);
    formData.append("subTitle",input.subtitle);
    formData.append("description",input.description);
    formData.append("category",input.category);
    formData.append("courseLevel",input.courseLevel);
    formData.append("coursePrice",input.coursePrice);
    formData.append("courseThumbnail",input.courseThumbnail);

    await editCourse({formData,courseId});  
  }

  const publishStatusHandler = async (action) => {
    try{
      const response=await publishCourse({courseId,query:action});
      if(response.data){
        refetch();
        toast.success(response.data.message);
      }
    }
    catch(error){
      toast.error(error?.data?.message||"Failed to update course");
    }
  }
  useEffect(()=>{
    if(isSuccess){
      toast.success(data?.message||"Course updated successfully");
      navigate("/admin/course");
    }
    if(error){
      toast.error(error?.data?.message||"Failed to update course");
    }
  },[isSuccess,error]);

  if(courseByIdLoading){
    return <Loader2 className='h-4 w-4 animate-spin'/>
  }
  return (
    <Card>
      <CardHeader className='flex flex-row justify-between'>
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>Make changes to your courses here. Click save when you are done.</CardDescription>
        </div>
        <div className='space-x-2'>
          <Button disabled ={courseByIdData?.course.lectures.length===0} variant='outline' onClick={()=>publishStatusHandler(courseByIdData?.course.isPublished ?'false':'true')}>
            {courseByIdData?.course.isPublished ?'Unpublish' : 'Publish'}
          </Button>
          <Button>Remove Course</Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className='space-y-4 mt-4'>
          <div>
            <Label>Title</Label>
            <Input
              type='text'
              name='courseTitle'
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder='Enter course title'
            />
          </div>

          <div>
            <Label>Subtitle</Label>
            <Input
              type='text'
              name='subtitle'
              value={input.subtitle}
              onChange={changeEventHandler}
              placeholder='Enter course subtitle'
            />
          </div>

          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>

          <div className='flex items-center gap-5'>
            <div>
              <Label>Category</Label>
              <Select onValueChange={selectCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Course Level</Label>
              <Select onValueChange={selectCourseLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>

                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Price in (INR)</Label>
              <Input
                type='number'
                name='coursePrice'
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder='199'
                className='w-fit'
              />

            </div>
          </div>

          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type='file'
              onChange={selectThumbnail}
              accept='image/*'
              className='w-fit'
            />
            {
              previewThumbnail && (
                <img src={previewThumbnail} alt='thumbnail' className='w-64 my-2' />
              )
            }
          </div>

          <div className='space-x-2'>
            <Button onClick={() => navigate('/admin/course')} variant='outline'>Cancel</Button>
            <Button disabled={isLoading} onClick={updateCourseHandler}>
              {
                isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please wait
                  </>
                ) : ('Save')
              }
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>

  )
}

export default CourseTab