import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/redux/hooks";
import { format } from "date-fns";
import { Pencil, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import UpdateDialog from "./UpdateDialog";
interface Props {
  category: string;
  posted_by: Number | string;
  message: string;
  timestamp: Date;
  messageId: string;
  residentId: string | undefined;
  updated_at: Date;
  posted_by_name: string;
  onDelete: (residentId: string | undefined, messageId: string) => void;
  onUpdate: (messageId: string, newMessage: string) => void;
}
/**
 * Renders a feed post design component for the resident feed.
 *
 * @param category - The category of the feed post (e.g. "Incident & Accident", "Body Map").
 * @param message - The message content of the feed post.
 * @param timestamp - The timestamp when the feed post was created.
 * @param messageId - The unique identifier of the feed post message.
 * @param residentId - The unique identifier of the resident associated with the feed post.
 * @param posted_by - The unique identifier of the user who posted the feed post.
 * @param updated_at - The timestamp when the feed post was last updated.
 * @param posted_by_name - The name of the user who posted the feed post.
 * @param onDelete - A callback function to delete the feed post.
 * @param onUpdate - A callback function to update the feed post.
 * @returns The rendered feed post design component.
 */
const Feed_post_Design: React.FC<Props> = ({
  category,
  message,
  timestamp,
  messageId,
  residentId,
  posted_by,
  updated_at,
  posted_by_name,
  onDelete,
  onUpdate,
}) => {
  const { user } = useAppSelector((state) => state.user);
  const [newMessage, setNewMessage] = useState<string>("");
  const [focalPoint, setFocalPoint] = useState<any>({ x: 0, y: 0 });

  const handleDelete = () => {
    const userConfirmation = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (userConfirmation) {
      onDelete(residentId, messageId);
    }
  };

  useEffect(() => {
    if (category == "Incident & Accident") {
      const string = message.replace(/\n +/g, "\n");
      setNewMessage(string);
    } else if (category == "Body Map") {
      setNewMessage(message?.split("~")?.[0]);
      const points = message?.split("~")?.[1];
      setFocalPoint({ x: points?.split("&")?.[0], y: points?.split("&")?.[1] });
    } else {
      setNewMessage(message);
    }
  }, [category, message]);

  const handleUpdate = () => {
    if (category == "Body Map") {
      const points = message?.split("~")?.[1];
      const finalMessage = newMessage + "~" + `${points}`;
      onUpdate(messageId, finalMessage);
    } else {
      onUpdate(messageId, newMessage);
    }
  };

  return (
    <div className=" bg-muted p-3">
      <div className="flex items-center justify-between mb-4 flex-col gap-4 sm:flex-row sm:gap-0">
        <div className="border px-3 bg-white">
          <span>{category}</span>
        </div>
        <div className="flex items-center gap-x-2">
          {user?.status === "approve" && posted_by === user.id && (
            <>
              <UpdateDialog
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleUpdate={handleUpdate}
              />
              <Button
                size={"sm"}
                variant={"outline"}
                className="flex items-center gap-x-1 py-0"
                onClick={handleDelete}
              >
                <Trash className="w-4 h-4" /> <span>Delete Post</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mb-7">
        {category == "Incident & Accident"
          ? message
              .replace(/\n +/g, "\n")
              ?.split("\n")
              .map((single, index) => (
                <p key={index} className="text-black-500 max-w-prose">
                  {single}
                </p>
              ))
          : category == "Body Map"
          ? message?.split("~")?.[0]
          : message}

        {category == "Body Map" && (
          <div
            className="focal-image-box mt-4"
            style={{ position: "relative" }}
          >
            <img
              alt=""
              src="/body_map.png"
              className="focal-potrait-image"
              style={{
                objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
                transformOrigin: `${focalPoint.x}% ${focalPoint.y}%`,
                transform: `scale(6)`,
              }}
            />
            <div
              className="focal-spot"
              style={{
                left: `${focalPoint.x - 1}%`,
                top: `${focalPoint.y - 1}%`,
              }}
            />
          </div>
        )}
      </div>

      <div className="text-gray-500 flex flex-col text-md font-medium">
        <div className="flex items-center text-xs	 sm:text-[17px]">
          Posted By: {posted_by_name}
          <Separator
            className="bg-gray-500 mx-1 h-4 w-0.5"
            orientation="vertical"
          />
          Date Posted: {timestamp && format(timestamp, "dd-MM-yyyy")}
          <Separator
            className="bg-gray-500 mx-1 h-4 w-0.5"
            orientation="vertical"
          />
          Time Posted: {timestamp && format(timestamp, "HH:mm")}
        </div>
        {updated_at !== timestamp && (
          <div>
            Time Edited: {updated_at && format(updated_at, "dd-MM-yyyy")},{" "}
            {updated_at && format(updated_at, "HH:mm")}
          </div>
        )}
      </div>
    </div>
  );
};
export default Feed_post_Design;
