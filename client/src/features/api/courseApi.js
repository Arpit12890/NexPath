//make an rtk query to fetch all courses
//call api to create a course
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const COURSE_API = "http://localhost:3000/api/v1/course"; //api endpoint 

export const courseApi = createApi({
    reducerPath: 'courseApi',
    tagTypes: ['Refetch_Creator_Course',"Refetch_Lecture"],//tag type for refetching creator course
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: 'include'
    }),

    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({courseTitle,category}) => ({
                url: '',
                method: 'POST',
                body: {courseTitle,category}
            }),
            invalidatesTags: ['Refetch_Creator_Course'],
        }),

        //search course
        getSearchCourse: builder.query({
            query: ({searchQuery,categories,sortByPrice}) => {

                //build query string
                let queryString = `/search?query=${encodeURIComponent(searchQuery)}`

                //append category
                if(categories && categories.length>0){
                    const categoriesString=categories.map(encodeURIComponent).join(",");
                    //&: Starts a new query parameter
                    queryString+=`&categories=${categoriesString}`;
                }

                //append sort by price is available
                if(sortByPrice){
                    queryString+=`&sortByPrice=${encodeURIComponent(sortByPrice)}`;
                }
                //now pass to url
                return{
                    url: queryString,
                    method: 'GET',
                }  
            }
        }),
        //get all published courses
        getPublishedCourse:builder.query({
            query: () => ({
                url: '/published-courses',
                method: 'GET'
            })
        }),

        getCreatorCourse: builder.query({
            query: () => ({
                url: '',
                method: 'GET'
            }),
            providesTags: ['Refetch_Creator_Course']
        }),
        
        editCourse: builder.mutation({
            query: ({formData,courseId}) => ({
                url: `/${courseId}`,//api endpoint 
                method: 'PUT',
                body: formData
            }),
            invalidatesTags: ['Refetch_Creator_Course']
        }),

        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,//api endpoint 
                method: 'GET',
            })
        }),
        createLecture: builder.mutation({
            query: ({courseId,lectureTitle}) => ({
                url: `/${courseId}/lecture`,
                method: 'POST',
                body: {lectureTitle}
            })
        }),
        //get lecture by course id
        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: 'GET'
            }),
            providesTags: ['Refetch_Lecture']
        }),

        //for edit lecture
        editLecture: builder.mutation({
            query: ({lectureTitle,videoInfo,isPreviewFree,courseId,lectureId}) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: 'POST',
                body: {lectureTitle,videoInfo,isPreviewFree}
            })
        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Refetch_Lecture']
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: 'GET',
            }),
        }),
        //for publish course
        publishCourse: builder.mutation({
            query: ({courseId,query}) => ({
                url: `/${courseId}?publish=${query}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Refetch_Creator_Course']
        })


        // deleteCourse: builder.mutation({
        //     query: (courseId) => ({
        //         url: `delete/${courseId}`,
        //         method: 'DELETE'
        //     })
        // })
    })
})
export const { useCreateCourseMutation,
    useGetSearchCourseQuery,useGetPublishedCourseQuery,useGetCreatorCourseQuery,useEditCourseMutation,useGetCourseByIdQuery,useCreateLectureMutation,useGetCourseLectureQuery,useEditLectureMutation,useRemoveLectureMutation,
useGetLectureByIdQuery,usePublishCourseMutation
 } = courseApi;