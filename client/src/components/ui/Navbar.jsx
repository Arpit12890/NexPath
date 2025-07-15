import { Menu, School } from 'lucide-react'
import React, { useEffect } from 'react'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { DarkMode } from '@/DarkMode'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Link, useNavigate } from 'react-router-dom'
import { useLogoutUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'


function Navbar() {
  //for update avatar photo we take user data from redux store
  const { user } = useSelector((state) => state.auth);

  //for logout user
  const [logoutUser,{data,isSuccess}]=useLogoutUserMutation();
  const navigate=useNavigate();

  const logoutHandler=async()=>{
    await logoutUser();
  };

  useEffect(()=>{
    if(isSuccess){
      toast.success(data.message||"Logged out successfully");
      navigate("/login");
    }
  },[isSuccess]);

  return (
    <div className='h-16 dark:bg-[#020817] bg-white border-b-2 dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
      {/* for desktop */}
      {/* mobile device k liye hidden rhega */}
      <div className='items-center justify-between hidden h-full gap-10 mx-auto max-w-7xl md:flex'>
        <div className='flex items-center gap-2'>
          <School size={"30"}></School>
          <Link to='/'>
          <h1 className='hidden text-2xl font-extrabold md:block'>NexPath</h1>
          </Link>
        </div>
        {/* User icons and dark icon */}
        <div className='flex items-center gap-8'>
          {/* this is user icon is only shown when user exist otherwise signup or login button are shown. */}
          {
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={user?.photoUrl||"https://github.com/shadcn.png"} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                  <DropdownMenuItem><Link to='my-learning'>My learning</Link></DropdownMenuItem>
                  <DropdownMenuItem><Link to='profile'>Edit Profile</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutHandler}>Log out</DropdownMenuItem>
                  </DropdownMenuGroup>
                  {
                    user?.role==="instructor"&&( 
                      <>
                    <DropdownMenuSeparator /> 
                    <DropdownMenuItem><Link to="/admin/dashboard">Dashboard</Link></DropdownMenuItem>
                    </>
                    )
                  }
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className='flex items-center gap-2'> 
                <Button variant='outline' onClick={()=> navigate("/login")}>Login</Button>
                <Button onClick={()=> navigate("/login")}>Signup</Button>
              </div>
            )
          }
          <DarkMode></DarkMode>
        </div>
      </div>
      {/* for mobile device */}
      <div className='flex items-center justify-between h-full px-4 md:hidden'>
        <h1 className='text-2xl font-extrabold'>NexPath</h1>
        <MobileNavbar user={user}></MobileNavbar>
      </div>
    </div>
  )
}

export default Navbar;

const MobileNavbar = ({user}) => {
  const navigate=useNavigate();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='icon' className=" rounded-full hover:bg-gray-300" variant="outline">
          <Menu></Menu>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2 ">
          <SheetTitle><Link>NexPath</Link></SheetTitle>
          <DarkMode></DarkMode>
        </SheetHeader>
        <Separator className='mr-2'></Separator>
        <nav className='flex flex-col space-y-4'>
          <Link to="/my-learning">My Learning</Link>
          <Link to='/profile'>Edit Profile</Link>
          <p>Log out</p>
        </nav>
        {/* this footer is only exist when there is instructor role */}
        {
          user?.role === 'instructor' && (
            <SheetFooter >
              <SheetClose asChild>
                <Button onClick={()=>navigate("/admin/dashboard")} className="w-full" type="submit">Dashboard</Button>
              </SheetClose>
            </SheetFooter>
          )}
      </SheetContent>
    </Sheet>
  )
}