//if we are user than not access to admin routes
//so we make an protected route

//1-agr login h to dobara login page pr nhi ja skte.
//2-agr login hi nhi h toh bhut sari service ko access hi nhi kr skta.
//3-only admin hi ja skta h dashboard pr.

import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

//for user agr login nhi toh login page pr jaega.
export const ProtectedRoutes = ({ children }) => {
    const {isAuthenticated}=useSelector(store=>store.auth);

    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }
    return children;
}

//user login h phele se toh homepage pr chla jayega.
export const AuthenticatedUser=({children})=>{
    const {isAuthenticated}=useSelector(store=>store.auth);

    if(isAuthenticated){
        return <Navigate to="/"/>
    }
    return children;
}

//for admin agr login nhi toh login page pr jaega.
//agr uska role instructor nhi h toh homepage pr bhej dege.
export const AdminRoute=({children})=>{ 
    const {isAuthenticated,user}=useSelector(store=>store.auth);

    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }
    if(user?.role!=="instructor"){
        return <Navigate to="/"/>
    }
    return children;
}
