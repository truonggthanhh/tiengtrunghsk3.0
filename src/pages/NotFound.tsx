import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const NotFound = () => {
  const location = useLocation();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Add a small delay to prevent flashing 404 during lazy route loading
    const timer = setTimeout(() => {
      setShouldShow(true);
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname,
      );
    }, 200); // 200ms delay to allow lazy routes to load

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Show loading state during the delay
  if (!shouldShow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Oops! Trang không tồn tại</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
};

export default NotFound;
