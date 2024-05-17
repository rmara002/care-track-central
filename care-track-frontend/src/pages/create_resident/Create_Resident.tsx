import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  create_resident,
  create_resident_type,
} from "@/lib/validation_feed_post";
import { createResident } from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Calendar } from "../../components/ui/calendar";
import { useState } from "react";
import { UserCircleIcon } from "lucide-react";
import Separator from "@/components/Separator";
import toast from "react-hot-toast";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
/**
 * The `Create_Resident` component is responsible for rendering a form to create a new resident. It uses the `react-hook-form` library to manage the form state and validation, and the `createResident` action from the Redux store to dispatch the creation of a new resident.
 *
 * The component checks the user's role and only displays the form if the user is an admin (role === 1). If the user is not an admin, it displays a message indicating that only admins can access this page.
 *
 * The form includes the following fields:
 * - Name: a text input for the resident's name
 * - Birthday: a date picker for the resident's date of birth
 * - Room Number: a number input for the resident's room number
 * - Profile Icon: a file input for the resident's profile icon
 *
 * When the form is submitted, the `onSubmit` function is called, which dispatches the `createResident` action with the form values and the selected file. If the creation is successful, the user is navigated to the home page.
 */
export default function Create_Resident() {
  const { user } = useAppSelector((state) => state.user);
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /**
   * Initializes a form state with default values and a resolver for the `create_resident_type` schema.
   *
   * @param create_resident_type - The type of the form values, which includes `name`, `birthday`, and `roomNumber`.
   * @returns - A form state object with methods for managing the form's state and submission.
   */
  const form = useForm<create_resident_type>({
    resolver: zodResolver(create_resident),
    defaultValues: {
      name: "",
      birthday: new Date(),
      roomNumber: 0,
    },
  });

  const { handleSubmit } = form;
  /**
   * Handles the submission of the create resident form.
   *
   * @param values - The form values containing the resident's name and birthday.
   * @returns - A promise that resolves when the resident is created.
   */
  const onSubmit = async (values: create_resident_type) => {
    let payload = {
      ...values,
      file,
    };
    await dispatch(createResident(payload)).then((res: any) => {
      if (!res.error) {
        navigate("/");
      } else {
        toast.error(
          "Error creating resident. Please make sure to pick a profile picture."
        );
      }
    });
  };

  /**
   * Handles the change event of a file input field, setting the selected file in the component state.
   *
   * @param event - The change event object containing the selected file.
   */
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  // const user = 1;
  return (
    <div className="m-4 sm:m-0">
      <Separator>
        <h2 className="text-lg font-normal tracking-wide">Create A Resident</h2>
      </Separator>
      {user?.role === 1 ? (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="py-2">
            <div className="flex flex-col w-full gap-6 my-0">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="text-md">Resident Name</FormLabel>
                    <FormControl>
                      <Input
                        className="px-2"
                        placeholder="Resident Name"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="px-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="text-md">
                      Resident's Date of Birth
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild className=" ">
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              " pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <DayPicker
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => field.onChange(date)}
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={2025}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="text-md">
                      Resident's Room Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="flex-1"
                        placeholder="Room Number"
                        type="number"
                        // onChange={(event) => field.onChange(+event.target.value)}
                      />
                    </FormControl>
                    <FormMessage className="px-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="text-md">
                      Resident's Profile Icon
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="flex-1"
                        placeholder="Room Number"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </FormControl>
                    <FormMessage className="px-2" />
                  </FormItem>
                )}
              />
              <div className="text-start">
                {file ? (
                  <img
                    alt=""
                    src={URL.createObjectURL(file)}
                    className="w-40 mx-3 rounded-full h-40"
                  />
                ) : (
                  <UserCircleIcon className="text-gray-500 mx-3  w-40 rounded-full h-40" />
                )}
              </div>

              <div className="self-end px-4">
                <Button
                  type="submit"
                  size={"sm"}
                  variant={"outline"}
                  className=" w-fit px-6 border-gray-400"
                >
                  Create
                </Button>
              </div>
            </div>
          </form>
        </Form>
      ) : (
        <div className="flex items-center justify-center py-10 text-red-500 bg-muted my-10">
          Only Admin Can Access this Page
        </div>
      )}
    </div>
  );
}
