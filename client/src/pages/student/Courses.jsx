import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import Course from './Course'
import { useGetPublishedCourseQuery } from '@/features/api/courseApi'

//container k andr cards aa jayege
const Courses = () => {

  const {data,isLoading,isSuccess,isError}=useGetPublishedCourseQuery() ;

  if(isError){
    return <h1>Some error occurred while fetching courses.</h1>
  }

  return (
    <div className='bg-gray-50 dark:bg-[#121212]'>
        <div className='p-6 mx-auto max-w-7xl'>
            <h2 className='mb-10 text-3xl font-bold text-center text-gray-800 dark:text-slate-100'>
                Our Courses
            </h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>  
                {/*we can show multiple skeleton cards using array */}
            {    
                isLoading?(
                  
                    Array.from({length:8}).map((_,index)=>{
                        return <CourseSkeleton key={index}/>
                    })
                ):(
                  // iterate through courses array and return Course component
                    data?.courses.map((course,index)=>{
                      return <Course key={index} course={course}/>
                    })
                )
            }
            </div>   
        </div>  
    </div>
  )
}
export default Courses

const CourseSkeleton = () => {
    return (
      <div className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
        <Skeleton className="w-full h-36" />
        <div className="px-5 py-4 space-y-3">
          <Skeleton className="w-3/4 h-6" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-20 h-4" />
            </div>
            <Skeleton className="w-16 h-4" />
          </div>
          <Skeleton className="w-1/4 h-4" />
        </div>
      </div>
    );
  };