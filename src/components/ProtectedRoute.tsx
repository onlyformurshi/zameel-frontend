import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [isVerifying, setIsVerifying] = useState(true);
    const location = useLocation();
    const { isAuthenticated, loading, checkAuthStatus } = useAuthStore();

    useEffect(() => {
        const verify = async () => {
            const isValid = await checkAuthStatus();
            if (!isValid) {
                // Force clear auth state if validation fails
                useAuthStore.getState().logout();
            }
            setIsVerifying(false);
        };
        verify();
    }, [checkAuthStatus]);

    if (isVerifying || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 