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

const Food_Intake_Post = () => {
  /**
   * Fetches the food intake posts for the current resident and sets the loading state.
   *
   * This effect is triggered when the component mounts or when the `residentId` parameter changes.
   * It dispatches the `getMessagesAsync` action to fetch the food intake posts for the current resident.
   *
   * @param residentId - The ID of the current resident.
   * @param dispatch - The Redux dispatch function.
   */
  const { foodIntakePosts, loading } = useAppSelector(
    (state) => state.feedPosts
  );

  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getMessagesAsync({
        residentId: residentId,
        type: "food_intake",
      })
    );
  }, [dispatch, residentId]);

  /**
   * Deletes a food intake message for a resident.
   *
   * @param residentId - The ID of the resident whose food intake message is being deleted.
   * @param messageId - The ID of the food intake message to be deleted.
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
          type: "food_intake",
        })
      );
    });
  };

  /**
   * Updates a food intake message for a resident.
   *
   * @param residentId - The ID of the resident whose food intake message is being updated.
   * @param messageId - The ID of the food intake message to be updated.
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
          type: "food_intake",
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
   * Renders a list of food intake posts for a resident.
   *
   * @param foodIntakePosts - An array of food intake posts, or null if no posts exist.
   * @param residentId - The ID of the resident whose food intake posts are being displayed.
   * @param onDelete - A callback function to handle deleting a food intake post.
   * @param onUpdate - A callback function to handle updating a food intake post.
   * @returns A React component that displays the food intake posts.
   */
  return (
    <div className="py-4">
      <div>
        {foodIntakePosts && foodIntakePosts?.length > 0 ? (
          <div className="flex space-y-2 flex-col gap-2">
            {foodIntakePosts?.map((post, i) => {
              return (
                <Feed_post_Design
                  key={i}
                  category="Food Intake"
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

export default Food_Intake_Post;
