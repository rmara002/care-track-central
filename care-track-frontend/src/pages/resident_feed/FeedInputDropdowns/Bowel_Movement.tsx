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
export default function Bowel_Movement() {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  const { user } = useAppSelector((state) => state.user);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  /**
   * Initializes a form with a `message` field using the `useForm` hook from the `react-hook-form` library.
   * The form uses the `zodResolver` from the `@hookform/resolvers/zod` library to validate the form data against the `personal_Care` schema.
   * The `defaultValues` option is set to initialize the `message` field with an empty string.
   */
  const form = useForm<personal_Care_type>({
    resolver: zodResolver(personal_Care),
    defaultValues: {
      message: "",
    },
  });
  const { handleSubmit } = form;
  /**
   * Handles the submission of a Bowel Movement form, including dispatching actions to post the form data and refresh the Bowel Movement data for the current resident.
   * @param values - The form values, including the `message` field.
   */
  const onSubmit = (values: personal_Care_type) => {
    const data = {
      residentId: Number(residentId),
      message: values.message,
    };

    dispatch(
      PostAsyncThunk("post-message")({ ...data, type: "bowel_movement" })
    ).then((resp) => {
      dispatch(
        getMessagesAsync({
          residentId: residentId,
          type: "bowel_movement",
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
     * Renders a form for entering a Bowel Movement message, including a Bristol Stool Chart image and a textarea for the message. If the user's status is "approve", it also renders a speech-to-text component and a submit button.
     */
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="py-2 border-t-2 mt-2"
      >
        <div className="flex flex-col gap-2 px-2 py-2 border-b-2">
          <h1 className="font-semibold">Bristol Stool Chart</h1>
          <img
            src="/poo_type.png"
            alt="Poo Type image"
            width={440}
            height={250}
            className="mx-auto"
          />
        </div>
        <div className="flex flex-col gap-2 ">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={7}
                    {...field}
                    className="min-h-20 focus-visible:ring-0 ring-0 border-0 shadow-none resize-none placeholder:text-gray-400"
                    placeholder="Enter the bowel type and details here..."
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
