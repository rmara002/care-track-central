import {
  DeleteAsyncThunk,
  UpdateAsyncThunk,
  getMessagesAsync,
} from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Feed_post_Design from "../feed_components/Feed_post_Design";
import Loading from "@/components/Loading";

const Incident_Accident_Post = () => {
  /**
   * Fetches incident and accident posts for the specified resident.
   *
   * This code is responsible for retrieving the incident and accident posts for the current resident. It uses the `getMessagesAsync` action creator from the `feedPosts` slice to fetch the posts, passing in the resident ID and the "incident_accident_form" type.
   *
   * The `useEffect` hook is used to trigger the fetch when the component mounts or when the `residentId` changes.
   *
   * @param residentId - The ID of the resident whose incident and accident posts should be fetched.
   * @returns The incident and accident posts for the specified resident, along with a loading state.
   */
  const { incidentAccidentPosts, loading } = useAppSelector(
    (state) => state.feedPosts
  );
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getMessagesAsync({
        residentId: residentId,
        type: "incident_accident_form",
      })
    );
  }, [dispatch, residentId]);
  /**
   * Deletes an incident/accident message for the specified resident.
   *
   * @param residentId - The ID of the resident whose message should be deleted.
   * @param messageId - The ID of the message to be deleted.
   * @returns A promise that resolves when the message has been successfully deleted.
   */
  const onDelete = async (
    residentId: string | undefined,
    messageId: string
  ) => {
    dispatch(
      DeleteAsyncThunk("delete-message")({ residentId, messageId })
    ).then(() => {
      toast.success("Post Deleted Successfully");
      dispatch(
        getMessagesAsync({
          residentId: residentId,
          type: "incident_accident_form",
        })
      );
    });
  };
  /**
   * Updates an incident or accident message for a resident.
   *
   * @param residentId - The ID of the resident whose message is being updated.
   * @param messageId - The ID of the message to be updated.
   * @param newMessage - The new message content.
   * @returns A promise that resolves when the message has been updated.
   */
  const onUpdate = (messageId: string, newMessage: string) => {
    dispatch(
      UpdateAsyncThunk("update-message")({
        messageId,
        newMessage: newMessage,
      })
    ).then(() => {
      dispatch(
        getMessagesAsync({
          residentId: residentId,
          type: "incident_accident_form",
        })
      );
    });
  };

  if (loading) {
    return (
      <div className="my-4">
        <Loading />
      </div>
    );
  }

  /**
   * Renders a list of incident and accident posts in the resident feed.
   *
   * The component checks if `incidentAccidentPosts` is not null, and if so, maps over the data to render a `Feed_post_Design` component for each post. If `incidentAccidentPosts` is null, it displays "No Posts Currently", and if it is undefined, it renders a `Loading` component.
   *
   * The `Feed_post_Design` component is passed the following props:
   * - `category`: The category of the post, which is "Incident & Accident"
   * - `message`: The message content of the post
   * - `timestamp`: The timestamp of when the post was created
   * - `messageId`: The unique identifier of the post
   * - `residentId`: The identifier of the resident
   * - `posted_by_name`: The name of the user who posted the post
   * - `posted_by`: The identifier of the user who posted the post
   * - `updated_at`: The timestamp of when the post was last updated
   * - `onDelete`: A function to handle deleting the post
   * - `onUpdate`: A function to handle updating the post
   */
  return (
    <div className="py-4">
      <div>
        {incidentAccidentPosts && incidentAccidentPosts?.length > 0 ? (
          <div className="flex space-y-2 flex-col gap-2">
            {incidentAccidentPosts?.map((post, i) => {
              return (
                <Feed_post_Design
                  key={i}
                  category="Incident & Accident"
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
        ) : (
          "No Posts Currently"
        )}
      </div>
    </div>
  );
};

export default Incident_Accident_Post;
