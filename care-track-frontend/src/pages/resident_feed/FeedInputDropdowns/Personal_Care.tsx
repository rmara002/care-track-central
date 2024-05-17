import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { personal_Care, personal_Care_type } from "@/lib/validation_feed_post";
import { PostAsyncThunk, getMessagesAsync } from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Speech from "./Speech";
export default function Personal_Care() {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  const { user } = useAppSelector((state) => state.user);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  /**
   * Initializes a form with a resolver for the `personal_Care_type` schema and a default value of an empty string for the `message` field.
   */
  const form = useForm<personal_Care_type>({
    resolver: zodResolver(personal_Care),
    defaultValues: {
      message: "",
    },
  });
  const { handleSubmit } = form;
  /**
   * Handles the submission of the personal care message form.
   *
   * @param values - The form values, including the message to be posted.
   * @returns - A promise that resolves when the message has been posted and the personal care messages have been refreshed.
   */
  const onSubmit = (values: personal_Care_type) => {
    const data = {
      residentId: Number(residentId),
      message: values.message,
    };

    dispatch(
      PostAsyncThunk("post-message")({ ...data, type: "personal_care" })
    ).then(() => {
      dispatch(
        getMessagesAsync({
          residentId: residentId,
          type: "personal_care",
        })
      );
      setTranscript("");
      setIsListening(false);
      form.setValue("message", "");
    });
  };

  useEffect(() => {
    form.setValue("message", transcript);
  }, [transcript, form]);

  return (
    /**
     * Renders a form with a textarea for posting details and a speech-to-text feature.
     * The form is only visible if the user's status is "approve".
     * The form submission is handled by the `onSubmit` function passed as a prop.
     */
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="py-2">
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={7}
                    {...field}
                    className="min-h-20 focus-visible:ring-0 ring-0 border-0 shadow-none resize-none"
                    placeholder="Detail the support provided...
                    (Examples of what to write: support provided, visits from health professionals, 
                      changes in emotional well-being, behavioral changes, participation in activities,
                      concerning behaviors (include context), reactions to medications, etc...)"
                  />
                </FormControl>
                <FormMessage className="px-2" />
              </FormItem>
            )}
          />
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
