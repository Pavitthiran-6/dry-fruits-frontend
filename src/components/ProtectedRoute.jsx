import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const { isAdminAuthenticated } = useSelector((state) => state.auth);

    if (!isAdminAuthenticated) {
        // Redirect to admin login with return URL
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
