import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

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
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">哎吔！搵唔到呢頁 (Oops! Trang không tồn tại)</p>
        <Link to="/cantonese" className="text-sm text-ink/70 hover:text-ink dark:text-cream/70 dark:hover:text-cream underline">返回主頁 (Quay về trang chủ)</Link>
      </div>
    </div>
  );
};

export default NotFound;