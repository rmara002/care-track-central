import Loading from "@/components/Loading";
import Separator from "@/components/Separator";
import {
  deleteStaffMember,
  fetchStaffMembers,
} from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { format } from "date-fns";
import { Trash, User2Icon } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Staff_Members = () => {
  const { user } = useAppSelector((state) => state.user);
  const { staffMembers, loading } = useAppSelector(
    (state) => state.staffmembers
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchStaffMembers());
  }, [dispatch]);

  /**
   * Deletes a staff member from the system after confirming the deletion with the user.
   * @param id - The ID of the staff member to be deleted.
   * @returns void
   */
  const handledDelete = (id: any) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this staff? Warning: Deleting this staff will also delete all their posts as well. Proceed with Caution."
    );
    if (confirmed) {
      dispatch(deleteStaffMember(id)).then((res: any) => {
        if (!res.error) {
          dispatch(fetchStaffMembers());
          toast.success("User Deleted Successfully");
        } else {
          toast.error("Error Deleting User");
        }
      });
    }
  };

  return (
    /**
     * Renders a list of staff members, with the ability to approve pending members and delete members for users with the admin role.
     * The list is filtered to only show approved members, and displays the member's username, role, and creation date.
     * If there are no approved members, a "Not Found Members!" message is displayed.
     * If a member is pending and the user has the admin role, an "Approve" button is shown.
     * If the user has the admin role, a trash icon is shown to delete the member.
     */
    <div className="py-0 m-4 sm:m-0">
      <Separator>
        <h2 className="text-lg font-normal tracking-wide  ">Staffs List</h2>
      </Separator>

      <div className="flex flex-col space-y-2 max-w-2xl">
        <div className="flex flex-col space-y-2 max-w-2xl">
          {loading ? (
            <Loading />
          ) : staffMembers.length === 0 ? (
            <div className="flex items-center justify-center">
              <span>Not Found Members!</span>
            </div>
          ) : (
            staffMembers
              .filter((item) => item.status === "approve")
              .map((member: any, i) => (
                <div
                  key={i}
                  className="flex w-full items-center space-x-4 p-2 border hover:bg-secondary rounded group duration-300 transition-colors ease-in-out"
                >
                  {member?.icon ? (
                    <img
                      src={member?.icon}
                      alt=""
                      className="text-gray-500  w-5 h-5 rounded-lg group-hover:text-gray-700 duration-300 transition-colors ease-in-out"
                    />
                  ) : (
                    <User2Icon className="text-gray-500  w-4 h-4 group-hover:text-gray-700 duration-300 transition-colors ease-in-out" />
                  )}
                  <div className="flex w-full items-center justify-between">
                    <p className="font-medium text-captalize">
                      {member.username} | {format(member.created_at, "PPP")}{" "}
                      {member?.user_role && (
                        <span className="capitalize">
                          | Role: {member?.user_role}
                        </span>
                      )}
                    </p>
                  </div>
                  {user?.role == 1 && (
                    <Trash
                      className="text-gray-500 w-4 h-4 group-hover:text-gray-700 duration-300 transition-colors ease-in-out cursor-pointer"
                      onClick={() => handledDelete(member.id)}
                    />
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};
export default Staff_Members;
