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

const PC_Hygiene_Post = () => {
  /**
   * Fetches the personal care and hygiene posts for the current resident and stores them in the application state.
   *
   * This effect is triggered when the component mounts or when the `residentId` parameter changes.
   *
   * @param residentId - The ID of the resident whose personal care and hygiene posts should be fetched.
   * @returns void
   */
  const { personalHygienePosts, loading } = useAppSelector(
    (state) => state.feedPosts
  );
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getMessagesAsync({
        residentId: residentId,
        type: "personal_care_hygiene",
      })
    );
  }, [dispatch, residentId]);
  /**
   * Deletes a personal care and hygiene post message.
   *
   * @param residentId - The ID of the resident associated with the post.
   * @param messageId - The ID of the post message to delete.
   * @returns A promise that resolves when the post message has been deleted.
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
          type: "personal_care_hygiene",
        })
      );
    });
  };
  /**
   * Updates a personal care and hygiene post message.
   *
   * @param residentId - The ID of the resident associated with the post.
   * @param messageId - The ID of the post message to update.
   * @param newMessage - The new message to update the post with.
   * @returns A promise that resolves when the post message has been updated.
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
          type: "personal_care_hygiene",
        })
      );
      // console.log("Here", personalHygienePosts);
    });
  };
  /**
   * Renders a feed post component for personal care and hygiene posts.
   *
   * @param personalHygienePosts - An array of personal care and hygiene post data, or null if no posts are available.
   * @param residentId - The ID of the resident associated with the posts.
   * @param onDelete - A function to handle deleting a post.
   * @param onUpdate - A function to handle updating a post.
   * @returns The rendered feed post component.
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
        {personalHygienePosts && personalHygienePosts?.length > 0 ? (
          <div className="flex space-y-2 flex-col gap-2">
            {personalHygienePosts?.map((post, i) => {
              return (
                <Feed_post_Design
                  key={i}
                  category="Personal Care & Hygiene"
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

export default PC_Hygiene_Post;
