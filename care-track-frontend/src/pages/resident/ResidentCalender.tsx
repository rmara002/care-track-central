import CalenderInput from "@/components/CalenderInput";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DeleteAsyncThunk,
  UpdateAsyncThunk,
  getCalenderPosts,
} from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Feed_post_Design from "../resident_feed/feed_components/Feed_post_Design";

export default function ResidentCalender() {
  const [calenderPosts, setCalenderPosts] = useState<any>([]);
  const { searchFeedPosts, loading } = useAppSelector(
    (state) => state.feedPosts
  );

  const { residentId } = useParams();

  const [date, setDate] = useState<any>("");
  const dispatch = useAppDispatch();

  /**
   * Deletes a post message with the provided message ID and resident ID.
   * After the deletion, it updates the calenderPosts state to remove the deleted post.
   * @param residentId - The ID of the resident associated with the post.
   * @param messageId - The ID of the post message to delete.
   */
  const onDelete = async (
    residentId: string | undefined,
    messageId: string
  ) => {
    dispatch(
      DeleteAsyncThunk("delete-message")({ residentId, messageId })
    ).then(() => {
      const updatedPosts = calenderPosts.filter(
        (post: any) => post.id !== messageId
      );
      setCalenderPosts(updatedPosts);
      toast.success("Post Deleted Successfully");
    });
  };
  /**
   * Updates a post message with the provided message ID and new message text.
   * After the update, it triggers a search to refresh the calendar posts.
   * @param messageId - The ID of the post message to update.
   * @param newMessage - The new message text to update the post with.
   */
  const onUpdate = (messageId: string, newMessage: string) => {
    dispatch(
      UpdateAsyncThunk("update-message")({
        messageId,
        newMessage: newMessage,
      })
    ).then(() => {
      handleSearch();
    });
  };

  const options = [
    { value: "personal_care", label: "Personal Care" },
    { value: "personal_care_hygiene", label: "Personal Care & Hygiene" },
    { value: "food_intake", label: "Food Intake" },
    { value: "fluid_intake", label: "Fluid Intake" },
    { value: "weight", label: "Weight" },
    { value: "oxygen_saturation", label: "Oxygen Saturation" },
    { value: "pulse_rate", label: "Pulse Rate" },
    { value: "temperature", label: "Temperature" },
    { value: "blood_sugar_level", label: "Blood Sugar Level" },
    { value: "bowel_movement", label: "Bowel Movement" },
    { value: "body_map", label: "Body Map" },
    { value: "incident_accident_form", label: "Incident & Accident" },
  ];

  /**
   * Retrieves the label for a given option type.
   * @param type - The type of the option.
   * @returns The label for the option, or an empty string if no matching option is found.
   */
  const getCategoryLabel = (type: string) => {
    const option = options.find((option) => option.value === type);
    return option ? option.label : "";
  };

  /**
   * Handles the search functionality for the resident calendar.
   * It dispatches the `getCalenderPosts` action with the current date and resident ID as the search data.
   */
  const handleSearch = () => {
    const searchData = {
      date,
      residentId,
    };
    dispatch(getCalenderPosts(searchData));
  };

  useEffect(() => {
    if (date !== "" && searchFeedPosts?.length > 0) {
      setCalenderPosts(searchFeedPosts);
    } else {
      setCalenderPosts([]);
    }
  }, [searchFeedPosts]);

  return (
    /**
     * Renders a calendar view for a resident, displaying a list of posts with various metadata.
     * The component includes a date input and a search button to filter the posts by date.
     * If there are no posts, a "No Post Found" message is displayed.
     * The component uses the `Feed_post_Design` component to render each individual post.
     */
    <div>
      <Separator className="my-4 bg-gray-300 h-[1.5px] py-[1px] px-0 " />
      <div className="border p-5 mb-5 mt-5 flex justify-between">
        <CalenderInput date={date} setDate={setDate} />
        <Button variant="outline" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          {calenderPosts.length !== 0 ? (
            <div>
              <div className="py-4">
                {calenderPosts && (
                  <div className="flex space-y-2 flex-col gap-2">
                    {!!calenderPosts &&
                      calenderPosts?.map((post: any, i: number) => {
                        const categoryLabel = getCategoryLabel(post.type);
                        return (
                          <Feed_post_Design
                            key={i}
                            category={categoryLabel}
                            message={post.message}
                            timestamp={post.created_at}
                            messageId={post.id}
                            residentId={residentId}
                            posted_by_name={post.posted_by_name}
                            posted_by={post.posted_by}
                            updated_at={post.updated_at}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                          />
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center my-10">
              <h2>No Post Found.</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
}
