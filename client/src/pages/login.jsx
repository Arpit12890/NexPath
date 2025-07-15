"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { User, Mail, Lock, Loader2 } from "lucide-react"
import { useRegisterUserMutation, useLoginUserMutation } from "@/features/api/authApi"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
const Login = () => {
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [login, setLogin] = useState({
    email: "",
    password: "",
  })
  //call the mutation function
  const [registerUser, {
    data: registerData,
    error: registererror,
    isLoading: registerisloading,
    isSuccess: registerissuccess },] = useRegisterUserMutation()

  const [loginUser, {
    data: logindata,
    error: loginerror,
    isLoading: loginisloading,
    isSuccess: loginissuccess },] = useLoginUserMutation()

    const navigate = useNavigate()

  const changeinputHandler = (e, type) => {
    const { name, value } = e.target
    if (type === "signup") {
      setSignup({ ...signup, [name]: value })
    } else {
      setLogin({ ...login, [name]: value })
    }
  }

  const handleregisteration = async (type) => {
    const inputdata = type === "signup" ? signup : login
    //now call the mutation for api call

    const action = type === "signup" ? registerUser : loginUser
    //now call the action
    await action(inputdata)
  }
  //if registeration is successfull then show the message so use sonner for that.
  useEffect(() => {
    if(registerissuccess && registerData){
      toast.success(registerData.message || "Signup successfully..")
    }
    if(registererror){
      toast.error(registererror.data.message || "Signup failed..")
    }
    if(loginissuccess && logindata){
      toast.success(logindata.message || "Login successfully..")
      navigate("/")
    }
    if(loginerror){
      toast.error(loginerror.data.message || "Login failed..")
    }
    
  }, [loginisloading, registerisloading, logindata, registerData, loginerror, registererror])


  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-300 to-secondary-300">
      <Tabs defaultValue="Login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2 p-1 mb-8 bg-white rounded-full">
          <TabsTrigger value="Signup" className="text-lg font-semibold transition-all duration-300 rounded-full">
            Sign Up
          </TabsTrigger>
          <TabsTrigger value="Login" className="text-lg font-semibold transition-all duration-300 rounded-full">
            Log In
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Signup">
          <Card className="bg-white shadow-xl bg-opacity-80 backdrop-blur-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text">
                Create an account
              </CardTitle>
              <CardDescription className="text-gray-600">Enter your details to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Name
                </Label>
                <div className="relative">
                  <User className="absolute w-5 h-5 left-3 top-3 text-primary-500" />
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={signup.name}
                    onChange={(e) => changeinputHandler(e, "signup")}
                    placeholder="Enter your name"
                    required
                    className="pl-10 border-primary-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 left-3 top-3 text-primary-500" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={signup.email}
                    placeholder="Enter your email"
                    onChange={(e) => changeinputHandler(e, "signup")}
                    required
                    className="pl-10 border-primary-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 left-3 top-3 text-primary-500" />
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={signup.password}
                    onChange={(e) => changeinputHandler(e, "signup")}
                    placeholder="Create a password"
                    required
                    className="pl-10 border-primary-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={registerisloading}
                onClick={() => handleregisteration("signup")}
                className="w-full px-4 py-2 font-bold text-white transition-all duration-300 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
              >
                {
                  registerisloading ? (
                    <>
                      <Loader2 className="w-6 h-6 mx-auto animate-spin" />
                      Please wait..
                    </>
                  ) : "Sign up"
                }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="Login">
          <Card className="bg-white shadow-xl bg-opacity-80 backdrop-blur-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold text-transparent bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text">
                Welcome back
              </CardTitle>
              <CardDescription className="text-gray-600">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 left-3 top-3 text-secondary-500" />
                  <Input
                    id="login-email"
                    type="email"
                    name="email"
                    value={login.email}
                    onChange={(e) => changeinputHandler(e, "login")}
                    placeholder="Enter your email"
                    required
                    className="pl-10 border-secondary-300 focus:border-secondary-500 focus:ring-secondary-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 left-3 top-3 text-secondary-500" />
                  <Input
                    id="login-password"
                    type="password"
                    name="password"
                    value={login.password}
                    onChange={(e) => changeinputHandler(e, "login")}
                    placeholder="Enter your password"
                    required
                    className="pl-10 border-secondary-300 focus:border-secondary-500 focus:ring-secondary-500"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button disabled={loginisloading}
                onClick={() => handleregisteration("login")}
                className="w-full px-4 py-2 mb-2 font-bold text-white transition-all duration-300 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 hover:from-secondary-600 hover:to-primary-600"
              >
                {
                  loginisloading ? (
                    <>
                      <Loader2 className="w-6 h-6 mx-auto animate-spin" />
                      Please wait..
                    </>
                  ) : "Log in"
                }
              </Button>
              <a
                href="#"
                className="text-sm transition-colors duration-300 text-primary-600 hover:text-primary-800 hover:underline"
              >
                Forgot password?
              </a>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Login

