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
export default function Weight() {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  const { user } = useAppSelector((state) => state.user);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  /**
   * Initializes a form state using the `useForm` hook, with the `weight_type` type as the form data shape.
   * The form is configured with a resolver using the `zodResolver` function from the `@hookform/resolvers/zod` library, which validates the form data against the `weight` schema.
   * The form is also initialized with a default value of an empty string for the `weight` field.
   */
  const form = useForm<weight_type>({
    resolver: zodResolver(weight),
    defaultValues: {
      weight: "",
    },
  });
  const { handleSubmit } = form;
  /**
   * Handles the submission of the weight form. It creates a data object with the resident ID and the weight message, which is the weight value followed by the "kg" unit. It then dispatches an action to post the weight message, and then dispatches another action to get the updated weight message. Finally, it resets the transcript and listening state, and clears the weight field in the form.
   *
   * @param values - The weight value submitted in the form.
   */
  const onSubmit = (values: weight_type) => {
    const weightWithUnit = `${values.weight} kg`;

    const data = {
      residentId: Number(residentId),
      message: weightWithUnit,
    };
    dispatch(PostAsyncThunk("post-message")({ ...data, type: "weight" })).then(
      () => {
        dispatch(
          getMessagesAsync({
            residentId: residentId,
            type: "weight",
          })
        );
        setTranscript("");
        setIsListening(false);
        form.setValue("weight", "");
      }
    );
  };
  useEffect(() => {
    form.setValue("weight", transcript);
  }, [transcript, form]);
  return (
    /**
     * Renders a form with a weight input field and an optional speech-to-text feature.
     * The form is used to submit the user's weight, which is displayed in kilograms.
     * If the user's status is "approve", a speech-to-text feature and a "Post" button are also rendered.
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

            <span>KG</span>
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
