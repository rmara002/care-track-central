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
export default function Pulse_rate() {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  const { user } = useAppSelector((state) => state.user);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  /**
   * Initializes a form state object using the `useForm` hook from the `react-hook-form` library.
   * The form state is initialized with a resolver that uses the `zodResolver` function from the `@hookform/resolvers/zod` library to validate the form values against the `weight` schema.
   * The form state is also initialized with a default value of an empty string for the `weight` field.
   */
  const form = useForm<weight_type>({
    resolver: zodResolver(weight),
    defaultValues: {
      weight: "",
    },
  });
  const { handleSubmit } = form;
  /**
   * Handles the submission of the pulse rate form.
   *
   * @param values - The form values, which include the pulse rate in beats per minute.
   * @returns - A Promise that resolves when the pulse rate is successfully posted and the pulse rate data is fetched.
   */
  const onSubmit = (values: weight_type) => {
    const pulseRateWithUnit = `${values.weight} pr bpm`;

    const data = {
      residentId: Number(residentId),
      message: pulseRateWithUnit,
    };
    dispatch(
      PostAsyncThunk("post-message")({ ...data, type: "pulse_rate" })
    ).then(() => {
      dispatch(
        getMessagesAsync({
          residentId: residentId,
          type: "pulse_rate",
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
     * Renders a form with a pulse rate input field and an optional speech-to-text and submit button.
     * The form is controlled by the `form` prop, which is expected to be a form state object.
     * The form submission is handled by the `onSubmit` function, which is passed as a prop.
     * The form also includes a speech-to-text feature and a submit button, which are conditionally rendered based on the user's status.
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

            <span>Pulse Rate Beats Per Minute</span>
          </div>
          {user?.status === "approve" && (
            <div className="self-end px-4">
              <Speech
                note={transcript}
                setNote={setTranscript}
                isListening={isListening}
                setIsListening={setIsListening}
              />{" "}
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
