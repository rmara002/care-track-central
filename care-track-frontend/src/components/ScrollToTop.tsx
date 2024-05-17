import { useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * A React component that ensures the window is scrolled to the top on route changes.
 * This component is particularly useful in single-page applications (SPAs) where
 * the page does not reload fully on navigation, which can lead to scroll positions
 * persisting across page changes, potentially confusing users.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The child components that ScrollToTop will render.
 * @returns {React.ReactElement} - A fragment that wraps child components, typically used to envelop an app's routes.
 */
const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);
  return <>{children}</>;
};

export default ScrollToTop;
