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

const Oxygen_Saturation_Post = () => {
  /**
   * Fetches the oxygen saturation posts for the current resident and dispatches an action to update the feed posts state.
   *
   * This effect is triggered when the component mounts or when the `residentId` parameter changes. It dispatches the `getMessagesAsync` action to fetch the oxygen saturation posts for the current resident.
   *
   * @param residentId - The ID of the current resident.
   * @param dispatch - The Redux dispatch function.
   */
  const { oxygenSaturationPosts, loading } = useAppSelector(
    (state) => state.feedPosts
  );
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getMessagesAsync({
        residentId: residentId,
        type: "oxygen_saturation",
      })
    );
  }, [dispatch, residentId]);
  /**
   * Handles the deletion of an oxygen saturation message for a given resident.
   *
   * @param residentId - The ID of the resident associated with the oxygen saturation data.
   * @param messageId - The ID of the message to be deleted.
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
          type: "oxygen_saturation",
        })
      );
    });
  };

  /**
   * Updates an oxygen saturation message for a given resident.
   *
   * @param residentId - The ID of the resident associated with the oxygen saturation data.
   * @param messageId - The ID of the message to be updated.
   * @param newMessage - The new message content to be updated.
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
          type: "oxygen_saturation",
        })
      );
    });
  };
  /**
   * Renders a feed post component for displaying oxygen saturation data.
   *
   * @param oxygenSaturationPosts - An array of oxygen saturation data objects, or null if no data is available.
   * @param residentId - The ID of the resident associated with the oxygen saturation data.
   * @param onDelete - A function to handle deleting a feed post.
   * @param onUpdate - A function to handle updating a feed post.
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
        {oxygenSaturationPosts && oxygenSaturationPosts?.length > 0 ? (
          <div className="flex space-y-2 flex-col gap-2">
            {oxygenSaturationPosts?.map((post, i) => {
              return (
                <Feed_post_Design
                  key={i}
                  category="Oxygen Saturation"
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

export default Oxygen_Saturation_Post;
