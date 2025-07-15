import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import React,{ useState,useEffect } from 'react'
import Course from './Course'
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'

// Profile page
const Profile = () => {

  //get user data from input field
  //for this make an state
  const [name,setName]=useState("");
  const[profilePhoto,setProfilePhoto]=useState("");

  //call api to get user data
  //for fetching user data
  //for query use {} and for mutation use [].
  //refetch- kb kb userquery ko fetch krna h hme tb krna h jb user profile update krta h toh phirse refetch krna hoga.
  const {data, isLoading,refetch} = useLoadUserQuery();
  //for updating user data
  const [updateUser,{data:updateUserData,isLoading:updateUserIsLoading,error,isSuccess,isError
  }]= useUpdateUserMutation();

  const onChangeHandler=(e)=>{
    //get file from input field
    const file=e.target.files[0];
    if(file) setProfilePhoto(file);
  }

  const updateUserHandler = async() => {
    //call mutation to done api integration
    //send data to api
    const formData=new FormData();
    formData.append("name",name);
    formData.append("profilePhoto",profilePhoto);
    await updateUser(formData);
  };

  //jb jb profile update hoga tb tb profile ko refetch krna hoga.
  useEffect(()=>{
    refetch();
  },[]);

  //this code will run when user data is updated.
  //if user data is updated then show success message
  useEffect(()=>{
    if(isSuccess){
      refetch();
      toast.success(data.message||"Profile updated successfully");
    }
    if(isError){
      toast.error(error.message||"Failed to update profile");
    }
  },[error,updateUserData,isSuccess,isError]);

  if(isLoading) return <h1>Loading...</h1>;

  const user=data && data.user;

  console.log(user);

//now display realtime data using user

  return (
    <div className='max-w-4xl mx-auto px-4 my-10 '>
      <h1 className='font-bold text-2xl text-center md:text-left'>PROFILE</h1>
      <div className='flex flex-col md:flex-row items-center md:items-start gap-8 mt-8'>
        <div className='flex flex-col items-center'>
          {/* adding avatar */}
          
          <Avatar className='h-24 w-24 md:h-32 md:w-32 mb-4'>
            <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div>
          <div className='mb-2'>
            <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
              Name:
              <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>
                {user.name.toUpperCase()}
              </span>
            </h1>
          </div>

          <div className='mb-2'>
            <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
              Email:
              <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>
                {user.email}
              </span>
            </h1>
          </div>

          <div className='mb-2'>
            <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
              Role:
              <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>
                {user.role.toUpperCase()}
              </span>
            </h1>
          </div>

          {/* add dialog box here for edit profile */}

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name">
                    Name
                  </Label>
                  <Input type="text"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}

                  placeholder="Name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>
                    Update Profile
                  </Label>
                  <Input onChange={onChangeHandler} type="file"
                    accept="image/*"
                    className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                  {
                    updateUserIsLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait
                      </>
                    ) : "Save Changes"
                  }
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Now, show all the courses that is enrolled by user */}
      <div>
        <h1 className='font-medium text-lg mt-8'>
          Courses you're enrolled in
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5'>
          {/* if user not enrolled in any couses then show msg else show courses.  */}
          {
            user.enrolledCourses.length === 0 ? <h1>You haven't enrolled yet</h1> : (
              user.enrolledCourses.map((course) => 
              <Course course={course} key={course._id}/>) 
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Profile
