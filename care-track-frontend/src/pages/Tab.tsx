import Separator from "@/components/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCarePlan } from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ResidentCard from "./home/home_components/ResidentCard";
import Resident from "./resident/Resident";
import ResidentCalender from "./resident/ResidentCalender";
import Resident_Feed from "./resident_feed/Resident_Feed";

const Tab = () => {
  /**
   * Fetches the care plan for the resident with the given ID and dispatches the action to update the care plan state.
   *
   * This effect is triggered when the `residentId` parameter changes. It calls the `getCarePlan` action creator with the numeric value of the `residentId` parameter to fetch the care plan data from the server and update the application state.
   *
   * @param {string | undefined} residentId - The ID of the resident to fetch the care plan for.
   * @param {function} dispatch - The Redux dispatch function used to dispatch the `getCarePlan` action.
   */
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  const { carePlan } = useAppSelector((state: any) => state.carePlan);

  useEffect(() => {
    if (residentId) {
      dispatch(getCarePlan(Number(residentId)));
    }
  }, [residentId]);
  return (
    /**
     * Renders a tab interface with a resident card, tabs for different views (feed, calendar, care plan), and the corresponding content for each tab.
     *
     * The tab interface is used to display information and functionality related to a resident, including their feed, calendar, and care plan.
     *
     * @returns {JSX.Element} The rendered tab interface
     */
    <div>
      <Separator className="max-w-md">
        {carePlan && (
          <ResidentCard
            // url={`/${carePlan?.resident_id}`}
            id={carePlan?.resident_id}
            name={carePlan?.name}
            dob={carePlan?.birthday}
            room={carePlan.room_number}
            icon={carePlan?.icon}
          />
        )}
      </Separator>
      <Tabs defaultValue="feed" className="">
        <TabsList className="flex items-center justify-evenly py-6">
          <TabsTrigger value="feed" className="py-2 border">
            Feed
          </TabsTrigger>
          <TabsTrigger value="calender" className="py-2 border">
            Calendar
          </TabsTrigger>
          <TabsTrigger value="care_plan" className="py-2 border">
            Care Plan
          </TabsTrigger>
        </TabsList>
        <TabsContent value="calender">
          <ResidentCalender />
        </TabsContent>
        <TabsContent value="care_plan">
          <Resident />
        </TabsContent>
        <TabsContent value="feed">
          <Resident_Feed />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tab;
