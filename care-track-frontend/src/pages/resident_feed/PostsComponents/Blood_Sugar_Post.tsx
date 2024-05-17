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

const Blood_Sugar_Post = () => {
  /**
   * Fetches the blood sugar level posts for the current resident and stores them in the Redux store.
   * This effect is triggered when the `residentId` parameter changes.
   */
  const { bloodSugarPosts, loading } = useAppSelector(
    (state) => state.feedPosts
  );
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getMessagesAsync({
        residentId: residentId,
        type: "blood_sugar_level",
      })
    );
  }, [dispatch, residentId]);
  /**
   * Deletes a blood sugar level post for a resident.
   *
   * @param residentId - The ID of the resident whose post is being deleted.
   * @param messageId - The ID of the message to delete.
   * @returns A promise that resolves when the delete is complete.
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
          type: "blood_sugar_level",
        })
      );
    });
  };
  /**
   * Updates a blood sugar level post with a new message.
   *
   * @param messageId - The ID of the message to update.
   * @param newMessage - The new message to set for the post.
   * @returns A promise that resolves when the update is complete.
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
          type: "blood_sugar_level",
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
  return (
    /**
     * Renders a list of blood sugar level posts for a resident.
     *
     * @param bloodSugarPosts - An array of blood sugar level posts to display.
     * @param residentId - The ID of the resident whose posts are being displayed.
     * @param onDelete - A callback function to handle deleting a post.
     * @param onUpdate - A callback function to handle updating a post.
     */
    <div className="py-4">
      <div>
        {bloodSugarPosts && bloodSugarPosts?.length > 0 ? (
          <div className="flex space-y-2 flex-col gap-2">
            {bloodSugarPosts?.map((post, i) => {
              return (
                <Feed_post_Design
                  key={i}
                  category="Blood Sugar Level"
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

export default Blood_Sugar_Post;
