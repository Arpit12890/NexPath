import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import './App.css'
import { Button } from './components/ui/button'
import Navbar from './components/ui/Navbar'
import Login from './pages/login'
import HeroSection from './pages/student/HeroSection'
import MainLayout from './layout/MainLayout'
import Courses from './pages/student/Courses'
import MyLearning from './pages/student/MyLearning'
import Profile from './pages/student/Profile'
import Sidebar from './pages/admin/Sidebar'
import { Dashboard } from './pages/admin/Dashboard'
import CourseTable from './pages/admin/course/CourseTable'
import AddCourse from './pages/admin/course/AddCourse'
import EditCourse from './pages/admin/course/EditCourse'
import CreateLecture from './pages/admin/lecture/CreateLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import CourseDetail from './pages/student/CourseDetail'
import CourseProgress from './pages/student/CourseProgress'
import SearchPage from './pages/student/SearchPage'
import { AdminRoute, AuthenticatedUser, ProtectedRoutes } from './components/ui/ProtectedRoutes'
import PurchaseCourseProtectedRoute from './components/ui/PurchaseCourseProtectedRoute'
import { ThemeProvider } from './components/ui/ThemeProvider'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: <AuthenticatedUser><Login/></AuthenticatedUser>
      },
      {
        path: 'my-learning',
        element: <ProtectedRoutes><MyLearning /></ProtectedRoutes>
      },
      {
        path: 'profile',
        element: <ProtectedRoutes><Profile /></ProtectedRoutes>
      },
      {
        path: 'course/search',
        element: <ProtectedRoutes><SearchPage /></ProtectedRoutes>
      },
      {
        path: "course-detail/:courseId",
        element: <ProtectedRoutes><CourseDetail/></ProtectedRoutes>
      },
      {
        path: "course-progress/:courseId",
        element: <ProtectedRoutes>
          <PurchaseCourseProtectedRoute>
            <CourseProgress/>
            </PurchaseCourseProtectedRoute>
          </ProtectedRoutes>
      },
      //admin routes start from here
      {
        path: "admin",
        element: <AdminRoute><Sidebar /></AdminRoute>,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: "course",
            element: <CourseTable />
          },
          {
            path:"course/create",
            element:<AddCourse/>
          },
          {
            path:"course/:courseId",//dynamic route
            element:<EditCourse/>
          },
          {
            path:"course/:courseId/lecture",//dynamic route
            element:<CreateLecture/>
          },
          {
            path:"course/:courseId/lecture/:lectureId",//dynamic route
            element:<EditLecture/>
          }
        ]
      }
    ],
  },
])

function App() {
  return (
    <main>
      <ThemeProvider>
      <RouterProvider router={appRouter}></RouterProvider>
      </ThemeProvider>
      
    </main>
  )
}

export default App
