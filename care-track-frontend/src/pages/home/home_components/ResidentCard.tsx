import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  deleteResident,
  fetchResidents,
  updateResident,
} from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { format } from "date-fns";
import { Pencil, Trash, UserCircleIcon } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
interface Props {
  name: string | null;
  dob: Date;
  room: number | string;
  url?: string;
  icon: string;
  id: number;
}
const ResidentCard: React.FC<Props> = ({ name, dob, room, url, id, icon }) => {
  const { user } = useAppSelector((state) => state.user);
  const [file, setFile] = useState<File | null>(null);
  const location = useLocation();
  const dispatch = useAppDispatch();

  const isShowTrash = location.pathname === "/" && user?.role == 1;

  /**
   * Handles the deletion of a resident. Confirmation is required.
   */
  const handledDelete = () => {
    /**
     * Confirmation dialog to ensure the user wants to delete
     * the resident.
     */
    const confirmed = window.confirm(
      "Are you sure you want to delete this resident?"
    );

    /**
     * If the user confirmed the deletion, delete the resident
     * and update the list of residents on success.
     */
    if (confirmed) {
      dispatch(deleteResident({ id })).then((res: any) => {
        if (!res.error) {
          dispatch(fetchResidents());
          toast.success("Resident Deleted Successfully");
        } else {
          toast.error("Error Deleting Resident");
        }
      });
    }
  };

  /**
   * Handles the file input change event.
   * @param {any} event The event object of the change event.
   */
  const handleFileChange = (event: any) => {
    // Get the selected file
    const selectedFile = event.target.files[0];

    // If the file is not null, update the state with it
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  /**
   * Handles the update resident form submission.
   * @param {any} event The event object of the form submission.
   */
  const handleUpdate = (event: any) => {
    event.preventDefault();
    // Submit the form to update the resident
    dispatch(updateResident({ id, file }))
      .then((response: any) => {
        // If the request was successful, reload the page and show success message
        if (response?.payload.status == 201) {
          toast.success("Profile Updated Successfully");
          window.location.reload();
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        toast.error("Error Updating Resident");
      });
  };

  return (
    //  * Renders a resident card component with an image, name, date of birth, room number, and an optional trash icon.
    //  * The component also includes a dialog for updating the resident profile, including the ability to upload a new profile image.
    //  *
    //  * @param {string} url - The URL to navigate to when the resident card is clicked.
    //  * @param {string} icon - The URL of the resident's profile image.
    //  * @param {string} name - The name of the resident.
    //  * @param {Date} dob - The date of birth of the resident.
    //  * @param {string} room - The room number of the resident.
    //  * @param {boolean} isShowTrash - Whether to display the trash icon for deleting the resident.
    //  * @param {function} handledDelete - The function to call when the trash icon is clicked.
    //  * @param {function} handleFileChange - The function to call when a new profile image is uploaded.
    //  * @param {function} handleUpdate - The function to call when the "Update" button is clicked in the profile update dialog.
    //  * @param {File} file - The new profile image file, if any.

    <div
      className={` ${isShowTrash && "flex justify-around items-center mx-3"}`}
    >
      <div
        // to={url}
        className={`flex cursor-pointer items-center space-x-4 p-2 border hover:bg-secondary rounded group duration-300 transition-colors ease-in-out mx-4 flex-col sm:flex-row ${
          isShowTrash && "w-[90%]"
        }`}
      >
        <div className="relative">
          {icon ? (
            <img alt="" src={icon} className="w-5 h-5 rounded-full " />
          ) : (
            <UserCircleIcon className="text-gray-500  w-5 h-5 group-hover:text-gray-700 duration-300 transition-colors ease-in-out" />
          )}
          {location.pathname == `/` && (
            <Dialog>
              <DialogTrigger asChild>
                <Pencil className="w-3 h-3 absolute top-[60%] left-[60%]" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] border-2 border-dashed border-gray-200  ">
                <DialogHeader>
                  <DialogTitle>Update Resident Profile</DialogTitle>
                </DialogHeader>
                <div className="relative">
                  {file ? (
                    <img
                      alt=""
                      src={URL.createObjectURL(file)}
                      className="w-40 rounded-full h-40 m-auto mb-10"
                    />
                  ) : icon ? (
                    <img
                      alt=""
                      src={icon}
                      className="w-40 rounded-full h-40 m-auto mb-10"
                    />
                  ) : (
                    <UserCircleIcon className="text-gray-500  w-40 h-40 m-auto mb-10" />
                  )}

                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer absolute top-[72%] left-[60%]"
                  >
                    <Pencil className="w-5 h-5" />
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <DialogTrigger asChild>
                  <Button variant={"outline"} onClick={handleUpdate}>
                    Update
                  </Button>
                </DialogTrigger>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Link to={url ? url : ""}>
          <p className="font-medium">
            {name} | D.O.B: {dob && format(dob, "PPP")} | Room {room}
          </p>
        </Link>
      </div>
      {isShowTrash && (
        <Trash
          className="text-gray-500 w-4 h-4 group-hover:text-gray-700 duration-300 transition-colors ease-in-out cursor-pointer"
          onClick={handledDelete}
        />
      )}
    </div>
  );
};
export default ResidentCard;
