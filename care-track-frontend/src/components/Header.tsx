/**
 * The `Header` component represents the header section of the application. It includes the following functionality:
 *
 * - Displays the application title "Care Track Central"
 * - Provides a link to return to the dashboard
 * - Displays a notification bell icon with a badge if there are unread notifications
 * - Displays a dropdown menu with the user's profile information and various actions:
 *   - Create a new resident (for users with role 1/admin)
 *   - View the staff list
 *   - Edit the user's profile
 *   - Edit the user's password
 *   - Logout
 *
 * The component uses various UI components from the `@/components/ui/dropdown-menu` module and the `buttonVariants`
 * function from `./ui/button`. It also utilizes the `useAppSelector` hook from `@/redux/hooks` to access the user's
 * information from the Redux store.
 */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAppSelector } from "@/redux/hooks";
import { Bell, UserCircleIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import toast from "react-hot-toast";
export default function Header({ unread }: any) {
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
    localStorage.removeItem("persistedRoot");
  };
  const handleNotification = () => {
    navigate("/notification");
  };

  return (
    <div className="flex justify-between items-center flex-col sm:flex-row ">
      <div className="flex space-x-4 items-center my-4 sm:my-0">
        <h1 className="sm:text-xl flex flex-col items-center font-semibold max-w-prose sm:font-bold  text-center leading-snug ">
          Care Track Central
        </h1>

        <Link
          to={"/"}
          className={buttonVariants({
            variant: "outline",
            className: " px-3 py-1 rounded-sm",
          })}
        >
          Retun to Dashboard
        </Link>
      </div>
      <div className="flex basis-2/6 space-x-4 items-center">
        {user?.role === 1 && (
          <div
            className="border p-2 px-4 group hover:bg-secondary rounded-sm"
            onClick={handleNotification}
          >
            {unread ? (
              <div className="relative inline-block">
                <Bell className="w-4 h-4 duration-300 transition-colors ease-in-out cursor-pointer group-hover:text-zinc-900" />
                <div className="w-2 h-2 bg-red-600 rounded-full absolute top-0 right-0"></div>
              </div>
            ) : (
              <Bell className="w-4 h-4 text-gray-600 duration-300 transition-colors ease-in-out cursor-pointer group-hover:text-zinc-900" />
            )}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="border hover:bg-muted py-1 px-2 rounded  flex justify-between items-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {user?.icon ? (
              <img
                src={user?.icon}
                className="w-5 rounded-full h-5 m-auto"
                alt=""
              />
            ) : (
              <UserCircleIcon className="text-gray-500  w-5 h-5 m-auto" />
            )}
            <h4 className="font-bold whitespace-nowrap text-ellipsis overflow-hidden w-40">
              {user?.fullname}
            </h4>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </DropdownMenuTrigger>
          {isDropdownOpen && (
            <DropdownMenuContent>
              {user?.role === 1 && (
                <DropdownMenuItem className="active:bg-muted">
                  <Link to={"/create-resident"}>Create A New Resident</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Link to={"/staffmembers"}>Staffs List</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={"/update-profile"}>Edit Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={"/update-password"}>Edit Password</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                <Link to="">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </div>
  );
}
