import { FeedPostInterface } from "@/lib/types";
import {
  DeleteAsyncThunk,
  UpdateAsyncThunk,
  getMessagesAsync,
} from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Feed_post_Design from "../feed_components/Feed_post_Design";
import Loading from "@/components/Loading";

const Body_Map_Post = () => {
  /**
   * Fetches the body map posts for the specified resident.
   *
   * This effect is triggered when the `residentId` parameter changes. It dispatches the `getMessagesAsync` action to fetch the body map posts for the given resident.
   *
   * @param residentId - The ID of the resident whose body map posts should be fetched.
   * @returns A promise that resolves when the body map posts have been fetched.
   */
  const { bodyMapPosts, loading } = useAppSelector((state) => state.feedPosts);
  const [bodyMap, setBodyMap] = useState<FeedPostInterface[]>([]);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getMessagesAsync({
        residentId: residentId,
        type: "body_map",
      })
    );
  }, [dispatch, residentId]);

  /**
   * Deletes a body map message for the specified resident.
   *
   * @param residentId - The ID of the resident whose body map message should be deleted.
   * @param messageId - The ID of the body map message to be deleted.
   * @returns A promise that resolves when the message has been successfully deleted.
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
          type: "body_map",
        })
      );
    });
  };

  /**
   * Updates a body map message for a given resident.
   *
   * @param messageId - The ID of the message to be updated.
   * @param newMessage - The new message content.
   * @returns A promise that resolves when the message update is complete.
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
          type: "body_map",
        })
      );
    });
  };

  useEffect(() => {
    if (bodyMapPosts && bodyMapPosts?.length > 0) {
      setBodyMap(bodyMapPosts);
    } else {
      setBodyMap([]);
    }
  }, [bodyMapPosts]);

  /**
   * Renders a list of body map posts in the resident feed.
   *
   * @param bodyMap - An array of body map posts to display.
   * @param onDelete - A callback function to handle deleting a post.
   * @param onUpdate - A callback function to handle updating a post.
   * @returns A React component that displays the body map posts.
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
      {bodyMap?.length > 0 ? (
        <>
          {
            <div className="flex space-y-2 flex-col gap-2">
              {bodyMap?.map((post: any, i: any) => {
                return (
                  <Feed_post_Design
                    key={i}
                    category="Body Map"
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
          }
        </>
      ) : (
        "No Posts Currently"
      )}
    </div>
  );
};

export default Body_Map_Post;
