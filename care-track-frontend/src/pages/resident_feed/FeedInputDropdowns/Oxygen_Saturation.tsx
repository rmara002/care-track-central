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
export default function Oxygen_Saturation() {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  const { user } = useAppSelector((state) => state.user);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  /**
   * Initializes a form with a weight field using the `useForm` hook.
   * The form uses the `zodResolver` to validate the weight field against the `weight` schema.
   * The form's default value for the weight field is an empty string.
   */
  const form = useForm<weight_type>({
    resolver: zodResolver(weight),
    defaultValues: {
      weight: "",
    },
  });
  const { handleSubmit } = form;
  /**
   * Handles the submission of the oxygen saturation form.
   *
   * @param values - The form values, including the weight (oxygen saturation) value.
   * @returns void
   */
  const onSubmit = (values: weight_type) => {
    const oxygenSaturationWithUnit = `${values.weight}% SpO2`;

    const data = {
      residentId: Number(residentId),
      message: oxygenSaturationWithUnit,
    };
    dispatch(
      PostAsyncThunk("post-message")({ ...data, type: "oxygen_saturation" })
    ).then(() => {
      dispatch(
        getMessagesAsync({
          residentId: residentId,
          type: "oxygen_saturation",
        })
      );
      form.setValue("weight", "");
      setTranscript("");
      setIsListening(false);
    });
  };

  useEffect(() => {
    form.setValue("weight", transcript);
  }, [transcript, form]);
  return (
    /**
     * Renders a form for inputting oxygen saturation (SpO2) values.
     * The form includes an input field for the weight value and a "Post" button that is only visible if the user's status is "approve".
     * The form also includes a speech recognition feature that allows the user to input the SpO2 value by speaking.
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

            <span>%SpO2</span>
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
