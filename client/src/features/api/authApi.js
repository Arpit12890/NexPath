//integrate backend with frontend
//now for api integeration use rtkquery
//rtkquery is a data fetching and caching tool that is built on top of redux toolkit

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn,userLoggedOut } from '../authSlice';

const USER_API = "https://nexpath-backend.onrender.com"

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        //baseurl is api endpoint
        baseUrl: USER_API,
        credentials: 'include'
    }),
    //query- for data fetching
    //mutation- for data posting
    endpoints:(builder)=>({ 
        
        registerUser: builder.mutation({
            query:(inputData)=>({
                url: 'register', //api endpoint, register pr hit hoga
                method: 'POST',
                body: inputData 
            })
        }),
        
        loginUser: builder.mutation({
            query:(inputData)=>({
                url: 'login',
                method: 'POST',
                body: inputData
            }),
            //jese hi login hoga hm apni action ko dispatch krenge
            //onQueryStarted() is a lifecycle event that is triggered when a query or mutation is initiated. It allows you to perform optimistic updates, side effects, or rollback logic in case of an error.
            //queryfullfilled()- promise return when mutation is successfully completed
            async onQueryStarted(arg,{dispatch, queryFulfilled}){
                try{
                    const result = await queryFulfilled; //promise return
                    dispatch(userLoggedIn({user:result.data.user}))
                }
                catch(err){
                    console.log(err)
                }
            }
        }),
        //for logout
        logoutUser: builder.mutation({
            query:()=>({
                url: 'logout',
                method: 'GET' 
            }),
            async onQueryStarted(arg,{dispatch, queryFulfilled}){
                try{
                    dispatch(userLoggedOut())
                }
                catch(err){
                    console.log(err)
                }
            }
        }),
        //for fetching user data
        loadUser: builder.query({
            query:()=>({
                url: 'profile',
                method: 'GET'
        }),
        async onQueryStarted(arg,{dispatch, queryFulfilled}){
            try{
                const result = await queryFulfilled; //promise return
                dispatch(userLoggedIn({user:result.data.user}))
            }
            catch(err){
                console.log(err)
            }
        }
    }),
        //for updating user data
        updateUser: builder.mutation({
            query:(formData)=>({ //receive form data
                url: 'profile/update',
                method: 'PUT',
                body: formData, //Data to be sent in the request body
                credentials: 'include'
            })
        })     
    })
});
//use this hook in frontend
export const { useRegisterUserMutation, useLoginUserMutation,useLogoutUserMutation,useLoadUserQuery,useUpdateUserMutation, } = authApi;
