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

const Fluid_Intake_Post = () => {
  /**
   * Fetches the fluid intake posts for the current resident and stores them in the Redux store.
   * This effect is triggered when the component mounts or when the `residentId` parameter changes.
   */
  const { fluidIntakePosts, loading } = useAppSelector(
    (state) => state.feedPosts
  );
  // console.log(weightPosts)
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getMessagesAsync({
        residentId: residentId,
        type: "fluid_intake",
      })
    );
  }, [dispatch, residentId]);
  /**
   * Deletes a fluid intake message for a resident.
   *
   * @param residentId - The ID of the resident whose fluid intake message is being deleted.
   * @param messageId - The ID of the fluid intake message to be deleted.
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
          type: "fluid_intake",
        })
      );
    });
  };
  /**
   * Updates the fluid intake message for a resident.
   *
   * @param residentId - The ID of the resident whose fluid intake message is being updated.
   * @param messageId - The ID of the fluid intake message to be updated.
   * @param newMessage - The new message to be set for the fluid intake post.
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
          type: "fluid_intake",
        })
      );
    });
  };
  // console.log(personalCarePosts)
  /**
   * Renders a component that displays a list of fluid intake posts for a resident.
   *
   * The component fetches the fluid intake posts for the resident and renders them using the `Feed_post_Design` component.
   * If there are no posts, it displays a "No Posts Currently" message. If the posts are still being fetched, it displays a loading indicator.
   *
   * @param residentId - The ID of the resident whose fluid intake posts are being displayed.
   * @param onDelete - A function to be called when a post is deleted.
   * @param onUpdate - A function to be called when a post is updated.
   * @returns A React component that displays the fluid intake posts for the resident.
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
        {fluidIntakePosts && fluidIntakePosts?.length > 0 ? (
          <div className="flex space-y-2 flex-col gap-2">
            {fluidIntakePosts?.map((post, i) => {
              return (
                <Feed_post_Design
                  key={i}
                  category="Fluid Intake"
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

export default Fluid_Intake_Post;
