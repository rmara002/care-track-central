import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { weight, weight_type } from "@/lib/validation_feed_post";
import { PostAsyncThunk, getMessagesAsync } from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Speech from "./Speech";
export default function Blood_sugar_level() {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  const { user } = useAppSelector((state) => state.user);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  /**
   * Initializes a form with a "weight" field using the `useForm` hook.
   * The form uses the `zodResolver` to validate the "weight" field against the `weight` schema.
   * The form is initialized with a default value of an empty string for the "weight" field.
   */
  const form = useForm<weight_type>({
    resolver: zodResolver(weight),
    defaultValues: {
      weight: "",
    },
  });
  const { handleSubmit } = form;
  /**
   * Handles the submission of a blood sugar level value.
   *
   * When the form is submitted, this function:
   * - Constructs a `bloodSugarWithUnit` string from the submitted `weight` value
   * - Creates a data object with the `residentId` and `bloodSugarWithUnit` message
   * - Dispatches the `post_blood_sugar_Post` action to save the blood sugar level
   * - Dispatches the `get_blood_sugar_Post` action to refresh the blood sugar data
   * - Clears the `transcript` and `isListening` state
   * - Resets the `weight` form field
   *
   * @param values - The form values, including the `weight` field
   */
  const onSubmit = (values: weight_type) => {
    const bloodSugarWithUnit = `${values.weight} mmol/L`;

    const data = {
      residentId: Number(residentId),
      message: bloodSugarWithUnit,
    };
    dispatch(
      PostAsyncThunk("post-message")({ ...data, type: "blood_sugar_level" })
    ).then(() => {
      dispatch(
        getMessagesAsync({
          residentId: residentId,
          type: "blood_sugar_level",
        })
      );
      setTranscript("");
      setIsListening(false);
      form.setValue("weight", "");
    });
  };

  useEffect(() => {
    form.setValue("weight", transcript);
  }, [transcript, form]);
  return (
    /**
     * Renders a form for entering a blood sugar level value.
     * The form includes an input field for the value and a "Post" button.
     * If the user's status is "approve", the form also includes a speech-to-text component and a "Post" button.
     */
    <Form {...form}>
      <form className="py-2" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center w-fit mx-auto gap-x-2">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder=""
                      className='max-w-[102px] resize-none "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="px-2" />
                </FormItem>
              )}
            />

            <span>mmoI/L</span>
          </div>
          {user?.status === "approve" && (
            <div className="self-end px-4">
              <Speech
                note={transcript}
                setNote={setTranscript}
                isListening={isListening}
                setIsListening={setIsListening}
              />

              <Button
                type="submit"
                size={"sm"}
                variant={"outline"}
                className=" w-fit px-6 border-gray-400"
              >
                Post
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
