import CalenderInput from "@/components/CalenderInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { editResident, getCarePlan } from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ResidentFieldProps {
  fieldName: string;
  id: string;
  user_name: string | number | null;
  update_at: Date;
  initialValue?: string | number | null | "";
}
const Resident_field: React.FC<ResidentFieldProps> = ({
  fieldName,
  initialValue,
  update_at,
  id,
}) => {
  const { user } = useAppSelector((state) => state.user);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  const [dateOfBirth, setDateOfBirth] = useState<any>("");
  const [inputValues, setInputValues] = useState(initialValue);
  const [editMode, setEditMode] = useState(false);
  /**
   * Handles the edit action for a resident field.
   *
   * This function is called when the user wants to edit the value of a resident field. It sets the edit mode to true, allowing the user to modify the field value.
   */
  const handleEdit = () => {
    setEditMode(true);
  };

  /**
   * Handles changes to the input value for a resident field.
   *
   * This function is called when the user modifies the value of an input field. It updates the `inputValues` state with the new value from the input.
   *
   * @param e - The React `ChangeEvent` object containing the new input value.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    setInputValues(e.target.value);
  };
  /**
   * Handles the update action for a resident field.
   *
   * This function is called when the user wants to update the value of a resident field. It sets the edit mode to false, dispatches an action to edit the resident with the updated field value, and then dispatches an action to get the updated care plan for the resident.
   *
   * @param {Function} dispatch - The Redux dispatch function.
   * @param {string} residentId - The ID of the resident whose field is being updated.
   * @param {string} id - The ID of the resident field being updated.
   * @param {string} inputValues - The new value for the resident field.
   */
  const handleUpdate = async () => {
    const dateFormatRegex =
      /^[A-Z][a-z]{2}, [A-Z][a-z]{2} \d{2}, \d{4}, \d{2}:\d{2}:\d{2} (AM|PM)$/;
    const isDateFormatValid = dateFormatRegex.test(inputValues);

    if (id === "birthday" && isDateFormatValid) {
      setEditMode(false);
    } else {
      setEditMode(false);
      dispatch(
        editResident({ residentId: Number(residentId), [id]: inputValues })
      ).then((resp) => {
        dispatch(getCarePlan(Number(residentId)));
      });
    }
  };

  //  * Renders a resident field component that displays and allows editing of a resident's field.
  //  * The component handles different input types (text, date) based on the field ID.
  //  * It also displays the last updated timestamp and provides edit and update functionality.
  //  *
  //  * @param {string} fieldName - The name of the resident field.
  //  * @param {string} id - The unique identifier of the resident field.
  //  * @param {boolean} editMode - Indicates whether the field is in edit mode.
  //  * @param {Function} handleChange - Callback function to handle changes to the field value.
  //  * @param {Function} handleEdit - Callback function to handle the edit action.
  //  * @param {Function} handleUpdate - Callback function to handle the update action.
  //  * @param {Date | null} update_at - The timestamp of the last update to the resident field.
  //  * @param {object | null} user - The current user object, used to determine if the "Update" button should be displayed.

  function reverseFormatDate(inputDate: any): any {
    const [year, month, day] = inputDate.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Karachi",
    };
    return date.toLocaleString("en-US", options);
  }

  useEffect(() => {
    if (id == "birthday" && inputValues) {
      setDateOfBirth(reverseFormatDate(inputValues));
    }
  }, [id]);

  useEffect(() => {
    if (id == "birthday" && dateOfBirth !== "") {
      setInputValues(dateOfBirth);
    }
  }, [dateOfBirth]);

  return (
    <div className="flex flex-col py-1 px-2 justify-between border-b">
      <div className="space-y-1">
        <div
          className={`flex items-start gap-x-2 ${
            editMode ? "flex-col sm:flex-row" : ""
          }`}
        >
          <h1 className="text-lg font-semibold text-gray-700">{fieldName}:</h1>
          {editMode ? (
            id === "birthday" ? (
              <CalenderInput date={dateOfBirth} setDate={setDateOfBirth} />
            ) : (
              <Textarea
                id={id}
                name={id}
                value={inputValues ?? ""}
                onChange={handleChange}
                className="w-full"
              />
            )
          ) : (
            <h1 className="text-lg font-semibold capitalize">{initialValue}</h1>
          )}
        </div>
        {user?.status === "approve" && (
          <div className="border border-gray-400 h-7 flex items-center w-fit overflow-hidden">
            <Button variant={"ghost"} onClick={handleEdit}>
              <Label htmlFor={fieldName} className="flex items-center gap-2">
                <Pencil className="w-4 h-4" /> <span>Edit</span>
              </Label>
            </Button>
            {editMode && (
              <>
                <Separator
                  className="bg-gray-400 mx-1 h-7"
                  orientation="vertical"
                />
                <Button type="button" onClick={handleUpdate} variant={"ghost"}>
                  Update
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-end">
        <span className="text-md">
          {update_at && (
            <div>
              Updated At: {format(update_at, "dd-MM-yyyy")},
              {format(update_at, "HH:mm")}
            </div>
          )}
        </span>
      </div>
    </div>
  );
};

export default Resident_field;
