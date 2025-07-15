import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();//prevent from refreshing the page
    if(searchQuery.trim()!==""){
      navigate(`/course/search?query=${searchQuery}`);//navigate to the search page with the search query
    }
    setSearchQuery("");//clear the search input field
  }

  return (
    <div className='relative px-4 py-20 text-center bg-indigo-600 bg-gradient-to-r from-blue-500 to dark:from-gray-800 dark:to-gray-900'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='mt-2 mb-4 text-4xl font-bold text-white'>Find the Best Courses for You</h1>
        <p className='mb-8 text-gray-200 dark:text-gray-400'>Discover,Learn,and Upskill with our wide range of courses</p>
        
        <form onSubmit={searchHandler} className='flex items-center max-w-xl mx-auto mb-6 overflow-hidden bg-white rounded-full shadow-lg dark:bg-gray-800 '>
          <Input 
          type='text'
          placeholder='Search Courses'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='flex-grow px-6 py-3 text-gray-900 placeholder-gray-400 border-none focus-visible:ring-0 dark:text-gray-100 dark:placeholder-gray-500'></Input>
          <Button type='submit' className="px-6 py-3 text-white bg-blue-600 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800 dark:bg-blue-700">
            Search
          </Button>
          
        </form>
        {/* explore pr click krke sare courses chaiye so query kuch nhi bheje ge */}
        <Button onClick={()=>navigate(`/course/search?query`)} className="text-blue-600 bg-white rounded-full dark:bg-gray-800 hover:bg-gray-200">Explore Courses</Button>
      </div>
    </div>
  )
}

export default HeroSection