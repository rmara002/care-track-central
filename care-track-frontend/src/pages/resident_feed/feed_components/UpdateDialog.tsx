import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginUser } from "@/lib/types";

interface propsInterface {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleUpdate: () => void;
}

const UpdateDialog = ({
  newMessage,
  setNewMessage,
  handleUpdate,
}: propsInterface) => {
  return (
    <Dialog>
      <DialogTrigger asChild className="">
        <Button
          size={"sm"}
          variant={"outline"}
          className="flex items-center gap-x-1 py-0"
        >
          <Pencil className="w-4 h-4" /> <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-2 border-dashed border-gray-200  ">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="mb-4">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full mt-1"
              rows={12}
            />
          </div>
        </div>
        <DialogTrigger asChild>
          <Button variant={"outline"} onClick={handleUpdate}>
            Update
          </Button>
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDialog;
