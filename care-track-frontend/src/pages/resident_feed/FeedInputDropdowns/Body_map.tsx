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
import { ImageFocalPoint } from "@lemoncode/react-image-focal-point";
import "@lemoncode/react-image-focal-point/style.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Speech from "./Speech";

export default function Body_map() {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [focalPoint, setFocalPoint] = useState({ x: 0, y: 0 });

  const { user } = useAppSelector((state) => state.user);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  /**
   * Initializes a form with a resolver and default values for the `personal_Care_type` type.
   * The form is used to handle the submission of a message and focal point on a body map image.
   */
  const form = useForm<personal_Care_type>({
    resolver: zodResolver(personal_Care),
    defaultValues: {
      message: "",
    },
  });
  const { handleSubmit } = form;
  /**
   * Handles the submission of a form that includes a message and a focal point on a body map image.
   *
   * @param values - An object containing the form values, including the message and the focal point coordinates.
   * @returns - A Promise that resolves when the form submission is complete.
   */
  const onSubmit = (values: personal_Care_type) => {
    const data = {
      residentId: Number(residentId),
      message: values.message + "~" + `${focalPoint.x}&${focalPoint.y}`,
    };

    dispatch(
      PostAsyncThunk("post-message")({ ...data, type: "body_map" })
    ).then((res) => {
      dispatch(
        getMessagesAsync({
          residentId: residentId,
          type: "body_map",
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
     * Renders a form with a body map image and a textarea for the user to input a message about a body part. If the user's status is "approve", it also renders a speech-to-text component and a submit button.
     */
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="py-2 border-t-2 mt-2"
      >
        <div className="flex flex-col gap-2 px-2 py-2 border-b-2">
          <h1 className="font-semibold">Drag the spot on the Body Map:</h1>
          <ImageFocalPoint
            src="/body_map.png"
            alt="Poo Type image"
            className="mx-auto w-full h-full"
            onChange={setFocalPoint}
          />
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea rows={7}
                    {...field}
                    className="min-h-20 focus-visible:ring-0 ring-0 border-0 shadow-none resize-none placeholder:text-gray-400"
                    placeholder="Mark and describe any observed redness, bruises, cuts, grazes,
                    or other markings on the body. Note the location, size, color, and any possible causes or related incidents..."
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
