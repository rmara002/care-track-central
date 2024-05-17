/**
 * The main routing configuration for the application, using React Router.
 * It defines the top-level routes and their corresponding components.
 * The routes include the home page, a tab page for residents, staff members page,
 * pending members page, a create resident page, as well as authentication routes
 * for login, signup, password reset, and profile update.
 */
import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import Home from "@/pages/home/Home";
import Tab from "@/pages/Tab";
import Create_Resident from "../pages/create_resident/Create_Resident";
import Sign_Up from "@/pages/auth/Sign_Up";
import Login_Form from "@/pages/auth/Login_Form";
import UpdatePassword from "@/pages/auth/UpdatePassword";
import Staff_Members from "@/pages/staff-members/Staff_Members";
import Pending_Members from "@/pages/pending-members/Pending_Members";
import ProfileUpdate from "@/pages/auth/ProfileUpdate";
export const routing = createBrowserRouter([
  {
    path: "/",
    element: <Root />,

    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: ":residentId",
        element: <Tab />,
      },
      {
        path: "/staffmembers",
        element: <Staff_Members />,
      },
      {
        path: "/notification",
        element: <Pending_Members />,
      },
      {
        path: "/create-resident",
        element: <Create_Resident />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login_Form />,
  },
  {
    path: "/signup",
    element: <Sign_Up />,
  },
  {
    path: "/update-password",
    element: <UpdatePassword />,
  },
  {
    path: "/update-profile",
    element: <ProfileUpdate />,
  },
]);
