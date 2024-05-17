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
export default function PC_Hygiene() {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();

  /**
   * Initializes a form with a resolver and default values for a personal care type.
   * The form is used to handle the submission of a personal care hygiene message.
   *
   * @param personal_Care_type - The type of the personal care data.
   * @returns - A form object with the specified resolver and default values.
   */

  const form = useForm<personal_Care_type>({
    resolver: zodResolver(personal_Care),
    defaultValues: {
      message: "",
    },
  });
  const { handleSubmit } = form;
  /**
   * Handles the submission of a personal care hygiene message.
   *
   * @param values - An object containing the message text to be posted.
   * @returns - A Promise that resolves when the message has been posted and the personal care hygiene data has been fetched.
   */
  const onSubmit = (values: personal_Care_type) => {
    const data = {
      residentId: Number(residentId),
      message: values.message,
    };

    dispatch(
      PostAsyncThunk("post-message")({ ...data, type: "personal_care_hygiene" })
    ).then(() => {
      dispatch(
        getMessagesAsync({
          residentId: residentId,
          type: "personal_care_hygiene",
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
     * Renders a form for posting a message, with optional speech-to-text functionality and a submit button.
     * The form is controlled by the `form` object passed as a prop, and the `onSubmit` function is called when the form is submitted.
     * If the user's status is "approve", a speech-to-text component and a submit button are rendered.
     */
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="py-2">
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
                    (Examples of what to write: support in bathing and grooming,
                      skin care routines, oral hygiene performed, continence care, and any changes in hygiene needs.)"
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
                className=" w-fit px-6 border-gray-400 "
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
