import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { session, isLoading } = useSession();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  if (!session) {
    // Save current location to redirect back after login
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/cantonese/login?returnUrl=${returnUrl}`} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;