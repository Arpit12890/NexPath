import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi"
import { useParams,Navigate } from "react-router-dom"

//purchase course protected route
const PurchaseCourseProtectedRoute = ({ children }) => {
    const {courseId}=useParams();
    const {data,isLoading}=useGetCourseDetailWithStatusQuery(courseId);

    if(isLoading){
        return <p>Loading..</p>
    }

    //children-progress page
    return data?.purchased ? children : <Navigate to={`/course-detail/${courseId}`}/>
}
export default PurchaseCourseProtectedRoute;