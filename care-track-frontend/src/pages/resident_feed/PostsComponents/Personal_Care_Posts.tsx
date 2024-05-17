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

const Personal_Care_Posts = () => {
  /**
   * Fetches the personal care posts for the current resident and stores them in the application state.
   * This effect is triggered when the `residentId` parameter changes.
   */
  const { personalCarePosts, loading } = useAppSelector(
    (state) => state.feedPosts
  );
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getMessagesAsync({
        residentId: residentId,
        type: "personal_care",
      })
    );
  }, [dispatch, residentId]);

  /**
   * Deletes a personal care message for a resident.
   *
   * @param residentId - The ID of the resident whose personal care message is being deleted.
   * @param messageId - The ID of the personal care message to be deleted.
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
          type: "personal_care",
        })
      );
    });
  };
  /**
   * Updates a personal care message for a resident.
   *
   * @param residentId - The ID of the resident whose personal care message is being updated.
   * @param messageId - The ID of the personal care message to be updated.
   * @param newMessage - The new message content to be saved.
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
          type: "personal_care",
        })
      );
    });
  };
  /**
   * Renders a list of personal care posts for a resident feed.
   *
   * @param personalCarePosts - An array of personal care posts, or null if no posts are available.
   * @param residentId - The ID of the resident whose feed is being displayed.
   * @param onDelete - A function to handle deleting a personal care post.
   * @param onUpdate - A function to handle updating a personal care post.
   * @returns A React element representing the personal care posts.
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
        {personalCarePosts && personalCarePosts.length > 0 ? (
          <div className="flex space-y-2 flex-col gap-2">
            {personalCarePosts?.map((post, i) => {
              return (
                <Feed_post_Design
                  key={i}
                  category="Personal Care"
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

export default Personal_Care_Posts;
