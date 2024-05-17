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

const Pulse_Rate_Posts = () => {
  /**
   * Fetches and stores the pulse rate posts for the current resident in the application state.
   *
   * This effect is triggered when the `residentId` parameter changes. It dispatches the `getMessagesAsync` action to fetch the pulse rate posts for the given resident and store them in the application state.
   *
   * @param residentId - The ID of the current resident.
   * @param dispatch - The Redux dispatch function used to dispatch actions.
   */
  const { pulseRatePosts, loading } = useAppSelector(
    (state) => state.feedPosts
  );
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getMessagesAsync({
        residentId: residentId,
        type: "pulse_rate",
      })
    );
  }, [dispatch, residentId]);
  /**
   * Deletes a pulse rate post message.
   *
   * @param residentId - The ID of the resident associated with the pulse rate post.
   * @param messageId - The ID of the pulse rate post message to delete.
   * @returns A promise that resolves when the pulse rate post message has been deleted.
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
          type: "pulse_rate",
        })
      );
    });
  };
  /**
   * Updates the message for a pulse rate post.
   *
   * @param residentId - The ID of the resident associated with the pulse rate post.
   * @param messageId - The ID of the pulse rate post message to update.
   * @param newMessage - The new message to update the pulse rate post with.
   * @returns A promise that resolves when the pulse rate post message has been updated.
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
          type: "pulse_rate",
        })
      );
    });
  };
  /**
   * Renders a list of pulse rate posts for a resident feed.
   *
   * @param pulseRatePosts - An array of pulse rate post data, or null if no posts are available.
   * @param residentId - The ID of the resident whose pulse rate posts are being displayed.
   * @param onDelete - A function to handle deleting a pulse rate post.
   * @param onUpdate - A function to handle updating a pulse rate post.
   * @returns A React element representing the pulse rate posts.
   */

  if (loading) {
    return (
      <div className="my-4">
        <Loading />
      </div>
    );
  }
  return (
    <div className="py-4">
      <div>
        {pulseRatePosts && pulseRatePosts?.length > 0 ? (
          <div className="flex space-y-2 flex-col gap-2">
            {pulseRatePosts?.map((post, i) => {
              return (
                <Feed_post_Design
                  key={i}
                  category="Pulse Rate"
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

export default Pulse_Rate_Posts;
