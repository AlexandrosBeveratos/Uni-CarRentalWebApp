import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({requiredRole, children}) => {
    const user = JSON.parse(sessionStorage.getItem('user'))

    if(user == null){
        return <Navigate to={"/login"} />
    }
    if(!requiredRole.includes(user.role)){
        return <Navigate to={"/"} replace />
    }
    return children 
};
export default ProtectedRoute