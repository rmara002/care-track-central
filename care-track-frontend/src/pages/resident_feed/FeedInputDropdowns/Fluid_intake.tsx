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
import { Textarea } from "@/components/ui/textarea";
import { fluid_intake, fluid_intake_type } from "@/lib/validation_feed_post";
import { PostAsyncThunk, getMessagesAsync } from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Speech from "./Speech";
export default function Fluid_intake() {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  const { user } = useAppSelector((state) => state.user);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  /**
   * Initializes a form with a resolver and default values for the `fluid_intake_type` type.
   * The form is used to capture fluid intake details, including the amount drank and any additional text.
   * The resolver is used to validate the form input against the `fluid_intake` schema.
   * The default values set the initial values for the `text` and `weight` fields.
   */
  const form = useForm<fluid_intake_type>({
    resolver: zodResolver(fluid_intake),
    defaultValues: {
      text: "",
      weight: "",
    },
  });
  const { handleSubmit } = form;
  /**
   * Handles the submission of a fluid intake form, including posting the fluid intake details to the server and updating the local state.
   *
   * @param values - An object containing the fluid intake details, including the amount drank and any additional text.
   * @returns - A Promise that resolves when the fluid intake details have been posted to the server and the local state has been updated.
   */
  const onSubmit = (values: fluid_intake_type) => {
    const fluidIntakeWithUnit = `${values.weight}ml`;

    const data = {
      residentId: Number(residentId),
      message: `${fluidIntakeWithUnit}, ${values.text}`,
    };
    dispatch(
      PostAsyncThunk("post-message")({ ...data, type: "fluid_intake" })
    ).then((res) => {
      dispatch(
        getMessagesAsync({
          residentId: residentId,
          type: "fluid_intake",
        })
      );
      setTranscript("");
      setIsListening(false);
      form.setValue("text", "");
      form.setValue("weight", "");
    });
  };
  useEffect(() => {
    form.setValue("text", transcript);
  }, [transcript, form]);
  return (
    /**
     * Renders a form for capturing fluid intake details, including the amount drank and any additional text.
     * The form includes a speech-to-text feature for the text input, and a submit button to post the details.
     * The form is only visible if the user has an "approve" status.
     */
    <Form {...form}>
      <form className="py-2" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="border-b-2 py-3">
          <div className="flex w-full max-w-sm items-center gap-1.5  px-2">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem className="flex items-center gap-x-2">
                  <FormLabel>Amount Drank: </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder=""
                      className='w-full max-w-[60px] h-7 rounded  resize-none "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="px-2" />
                </FormItem>
              )}
            />
            ml
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={7}
                    {...field}
                    className="min-h-20 focus-visible:ring-0 ring-0 border-0 shadow-none resize-none"
                    placeholder="Post the details here...
                    (Examples of what to write: what type of fluid's consumed,
                      any assistance given with drinking, and any refusal or difficulties in drinking.)"
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
