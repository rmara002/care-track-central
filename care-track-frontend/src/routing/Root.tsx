/**
 * The Root component is the main entry point for the application's routing. It handles the authentication state, updates the unread message count, and renders the appropriate content based on the user's authentication status.
 *
 * The component uses the `useAppDispatch` and `useAppSelector` hooks from the Redux store to access the application's state and dispatch actions. It also uses the `useEffect` hook to check the user's authentication status and update the unread message count at regular intervals.
 *
 * If the user is authenticated, the component renders the `Header` and `Outlet` components, which display the application's header and the current route's content, respectively. If the user is not authenticated, the component renders the `Login_Form` component.
 *
 * The `ScrollToTop` component is used to automatically scroll the page to the top when the route changes.
 */
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import Login_Form from "@/pages/auth/Login_Form";
import { updateUnreadMsgs } from "@/redux/features/staffSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
const Root = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { unreadMsgs } = useAppSelector((state) => state.staffmembers);

  let user = localStorage.getItem("token");
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const notificationsUnread = localStorage.getItem("notifications");
      if (notificationsUnread == "true") {
        dispatch(updateUnreadMsgs(true));
      } else {
        dispatch(updateUnreadMsgs(false));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className=" sm:py-10 ">
      <div className="w-full sm:max-w-3xl mx-auto sm:p-6 bg-white shadow-md rounded-md">
        {user ? (
          <ScrollToTop>
            <Header unread={unreadMsgs} />

            <Outlet />
          </ScrollToTop>
        ) : (
          <Login_Form />
        )}
      </div>
    </div>
  );
};

export default Root;
