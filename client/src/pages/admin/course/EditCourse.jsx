import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'
import CourseTab from './CourseTab'

const EditCourse = () => {
  return (
    <div className='flex-1'>
        <div>
            <div className='flex justify-between items-center mb-5'>
                <h1 className='font-bold text-xl'>
                    Add detail information about the course
                </h1>
                <Link to='lecture'>
                <Button className='hover:text-blue-500' variant='link'>Go to lectures page</Button>
                </Link>
            </div>
        </div>
        <CourseTab/>   
    </div>
  )
}

export default EditCourse