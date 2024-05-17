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

const Bowel_Movement_Post = () => {
  /**
   * Fetches the bowel movement posts for the current resident and updates the application state.
   *
   * This effect is triggered when the `residentId` parameter changes. It dispatches the `getMessagesAsync` action to fetch the bowel movement posts for the specified resident and updates the application state with the fetched data.
   *
   * @param residentId - The ID of the resident whose bowel movement posts should be fetched.
   * @param dispatch - The Redux dispatch function used to dispatch actions.
   */
  const { bowelMovementPosts, loading } = useAppSelector(
    (state) => state.feedPosts
  );
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getMessagesAsync({
        residentId: residentId,
        type: "bowel_movement",
      })
    );
  }, [dispatch, residentId]);
  /**
   * Deletes a bowel movement message for the specified resident.
   *
   * @param residentId - The ID of the resident whose bowel movement message is being deleted.
   * @param messageId - The ID of the bowel movement message to be deleted.
   * @returns A promise that resolves when the deletion is complete.
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
          type: "bowel_movement",
        })
      );
    });
  };
  /**
   * Updates a bowel movement message for the specified resident.
   *
   * @param residentId - The ID of the resident whose bowel movement message is being updated.
   * @param messageId - The ID of the bowel movement message to be updated.
   * @param newMessage - The new message content to be used for the update.
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
          type: "bowel_movement",
        })
      );
    });
  };
  /**
   * Renders a list of bowel movement posts for a resident feed.
   *
   * The component checks if there are any bowel movement posts available, and if so, maps over them to render a `Feed_post_Design` component for each post. If there are no posts, it displays a "No Posts Currently" message. If the posts are still being loaded, it displays a `Loading` component.
   *
   * @param {Object[]} bowelMovementPosts - An array of bowel movement post objects.
   * @param {string} bowelMovementPosts[].message - The message content of the bowel movement post.
   * @param {string} bowelMovementPosts[].created_at - The timestamp when the bowel movement post was created.
   * @param {string} bowelMovementPosts[].id - The unique identifier of the bowel movement post.
   * @param {string} bowelMovementPosts[].posted_by_name - The name of the user who posted the bowel movement.
   * @param {string} bowelMovementPosts[].posted_by - The unique identifier of the user who posted the bowel movement.
   * @param {string} bowelMovementPosts[].updated_at - The timestamp when the bowel movement post was last updated.
   * @param {function} onDelete - A function to handle deleting a bowel movement post.
   * @param {function} onUpdate - A function to handle updating a bowel movement post.
   * @param {string} residentId - The unique identifier of the resident.
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
        {bowelMovementPosts && bowelMovementPosts.length > 0 ? (
          <div className="flex space-y-2 flex-col gap-2">
            {bowelMovementPosts?.map((post, i) => {
              return (
                <Feed_post_Design
                  key={i}
                  category="Bowel Movement"
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

export default Bowel_Movement_Post;
