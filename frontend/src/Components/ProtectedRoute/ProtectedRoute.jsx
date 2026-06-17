import { useEffect } from "react";
import { Children } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from 'react-router-dom'
import { Spin } from 'antd';
import { checkingAuth } from "../../../features/auth/authSlice";
const ProtectedRoute = ({ children, loginPath, allowedRoles }) => {
  const dispatch = useDispatch()
  const { role, isAuthenticated, checkAuth } = useSelector((state) => state.auth)
  console.log(role,isAuthenticated)

  useEffect(() => {
    console.log('checking auth...')
    dispatch(checkingAuth())
  }, [])
  
  if(checkAuth){  
     return (
      <div className="w-screen h-screen  flex items-center justify-center">
        <Spin/>
        </div>
     )
  }


  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace />
}



  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
}

if (isAuthenticated) {
    return children;
}

}

export default ProtectedRoute
