import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;