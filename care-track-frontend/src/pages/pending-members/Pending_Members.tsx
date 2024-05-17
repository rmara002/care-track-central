import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  approveRegularStaff,
  fetchStaffMembers,
} from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { format } from "date-fns";
import { User2Icon } from "lucide-react";
import { useEffect, useState } from "react";

const Pending_Members = () => {
  /**
   * Fetches the list of staff members and handles the approval of regular staff members.
   *
   * The `fetchStaffMembers` action is dispatched to retrieve the list of staff members from the application state.
   * The `approveRegularStaff` action is dispatched to approve a regular staff member, and the `fetchStaffMembers` action is dispatched again to update the list of staff members.
   *
   * @param {string} userId - The ID of the staff member to be approved.
   */

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { staffMembers, loading } = useAppSelector(
    (state) => state.staffmembers
  );
  const [pendingApproval, setPendingApproval] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchStaffMembers());
  }, [dispatch]);
  const handleApproveRegularStaff = (userId: string, status: string) => {
    dispatch(approveRegularStaff({ userId, status })).then((resultAction) => {
      if (approveRegularStaff.fulfilled.match(resultAction)) {
        dispatch(fetchStaffMembers());
      }
    });
  };

  useEffect(() => {
    if (staffMembers?.length) {
      const pendingMembers = staffMembers.filter(
        (item) => item.status == "pending"
      );
      setPendingApproval(pendingMembers);
    } else {
      setPendingApproval([]);
    }
  }, [staffMembers]);

  return (
    /**
     * Renders a list of pending staff members, allowing the user to approve them if they have the necessary role.
     * The component displays a loading state, a message if no pending members are found, and a list of pending members with an "Approve" button for each one.
     * The list is filtered to only show members with a status other than "approve".
     * The component uses the `User2Icon` component and the `Button` component.
     */
    <div className="py-5 m-4 sm:m-0">
      <div className="flex flex-col space-y-2 max-w-2xl">
        <div className="flex flex-col space-y-2 max-w-2xl">
          {loading ? (
            <Loading />
          ) : pendingApproval.length === 0 ? (
            <div className="flex items-center justify-center">
              <span>No notification.</span>
            </div>
          ) : (
            pendingApproval?.map((member: any, i) => (
              <div
                key={i}
                className="flex w-full justify-between items-center space-x-4 p-2 border hover:bg-secondary rounded group duration-300 transition-colors ease-in-out flex-col sm:flex-row gap-[8px] sm:gap-0"
              >
                <div className="flex items-center justify-between">
                  <User2Icon className="text-gray-500  w-4 h-4 group-hover:text-gray-700 duration-300 transition-colors ease-in-out" />
                  <p className="font-medium mx-2">
                    {member.username} | {format(member.created_at, "PPP")}
                  </p>
                </div>
                <div>
                  {member.status === "pending" && user?.role === 1 && (
                    <>
                      <Button
                        onClick={() =>
                          handleApproveRegularStaff(member.id, "approve")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        className="mx-2"
                        onClick={() =>
                          handleApproveRegularStaff(member.id, "decline")
                        }
                      >
                        Decline
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default Pending_Members;
