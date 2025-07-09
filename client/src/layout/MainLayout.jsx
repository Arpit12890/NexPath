import Navbar from '@/components/ui/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
        <Navbar></Navbar>
        <div className='flex-1 mt-12'>
            {/* for rendering children we use outlet */}
            <Outlet></Outlet>
        </div>
    </div>
  )
}

export default MainLayout