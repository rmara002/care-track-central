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

const Weight_Post = () => {
  /**
   * Fetches the weight posts for the current resident and stores them in the application state.
   *
   * This effect is triggered when the `residentId` parameter changes. It dispatches the `getMessagesAsync` action to fetch the weight posts for the current resident and stores them in the application state.
   *
   * @param {string | undefined} residentId - The ID of the current resident.
   * @returns {void}
   */
  const { weightPosts, loading } = useAppSelector((state) => state.feedPosts);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getMessagesAsync({
        residentId: residentId,
        type: "weight",
      })
    );
  }, [dispatch, residentId]);

  /**
   * Deletes a weight post for a resident.
   *
   * @param {string | undefined} residentId - The ID of the resident.
   * @param {string} messageId - The unique identifier of the weight post.
   * @returns {Promise<void>} - A promise that resolves when the weight post has been deleted.
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
          type: "weight",
        })
      );
    });
  };
  /**
   * Updates a weight post message for a resident.
   *
   * @param {string | undefined} residentId - The ID of the resident.
   * @param {string} messageId - The unique identifier of the weight post.
   * @param {string} newMessage - The new message content for the weight post.
   * @returns {Promise<void>} - A promise that resolves when the weight post message has been updated.
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
          type: "weight",
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
     * Renders a list of weight posts for a resident feed.
     *
     * The component checks if `weightPosts` is not null, and if so, maps over the data to render a `Feed_post_Design` component for each post.
     * If `weightPosts` is null, it displays "No Posts Currently", and if it is undefined, it renders a `Loading` component.
     *
     * @param {Object[]} weightPosts - An array of weight post data objects.
     * @param {string} weightPosts[].message - The message content of the weight post.
     * @param {string} weightPosts[].created_at - The timestamp when the weight post was created.
     * @param {string} weightPosts[].id - The unique identifier of the weight post.
     * @param {string} residentId - The ID of the resident.
     * @param {string} weightPosts[].posted_by_name - The name of the user who posted the weight post.
     * @param {string} weightPosts[].posted_by - The ID of the user who posted the weight post.
     * @param {string} weightPosts[].updated_at - The timestamp when the weight post was last updated.
     * @param {function} onDelete - A callback function to handle deleting a weight post.
     * @param {function} onUpdate - A callback function to handle updating a weight post.
     */
    <div className="py-4">
      <div>
        {weightPosts && weightPosts?.length > 0 ? (
          <div className="flex space-y-2 flex-col gap-2">
            {weightPosts?.map((post, i) => {
              return (
                <Feed_post_Design
                  key={i}
                  category="Weight"
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

export default Weight_Post;
