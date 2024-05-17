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

const Temperature_Posts = () => {
  /**
   * Fetches the temperature posts for the current resident and stores them in the application state.
   *
   * This effect is triggered when the `residentId` parameter changes. It dispatches the `getMessagesAsync` action
   * to fetch the temperature posts for the current resident and updates the application state accordingly.
   *
   * @param residentId - The ID of the resident whose temperature posts should be fetched.
   */
  const { temperaturePosts, loading } = useAppSelector(
    (state) => state.feedPosts
  );
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getMessagesAsync({
        residentId: residentId,
        type: "temperature",
      })
    );
  }, [dispatch, residentId]);
  /**
   * Deletes a temperature post from the resident feed.
   *
   * @param residentId - The ID of the resident whose feed is being displayed.
   * @param messageId - The ID of the temperature post to be deleted.
   * @returns A promise that resolves when the temperature post has been deleted.
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
          type: "temperature",
        })
      );
    });
  };
  /**
   * Updates a temperature post in the resident feed.
   *
   * @param residentId - The ID of the resident whose feed is being displayed.
   * @param messageId - The ID of the temperature post to be updated.
   * @param newMessage - The new message to be set for the temperature post.
   * @returns A promise that resolves when the temperature post has been updated.
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
          type: "temperature",
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
     * Renders a list of temperature posts in the resident feed.
     *
     * The component checks if there are any temperature posts available, and if so, it maps over the posts and renders a `Feed_post_Design` component for each one. If there are no posts, it displays a "No Posts Currently" message. If the posts are still being loaded, it displays a loading indicator.
     *
     * @param temperaturePosts - An array of temperature posts, or null if the posts are still being loaded.
     * @param residentId - The ID of the resident whose feed is being displayed.
     * @param onDelete - A function to handle deleting a temperature post.
     * @param onUpdate - A function to handle updating a temperature post.
     */
    <div className="py-4">
      <div>
        {temperaturePosts && temperaturePosts?.length > 0 ? (
          <div className="flex space-y-2 flex-col gap-2">
            {temperaturePosts?.map((post, i) => {
              return (
                <Feed_post_Design
                  key={i}
                  category="Temperature"
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

export default Temperature_Posts;
