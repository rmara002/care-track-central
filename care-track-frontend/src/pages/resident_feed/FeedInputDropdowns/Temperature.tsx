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
export default function Temperature() {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  const { user } = useAppSelector((state) => state.user);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  /**
   * Initializes a form with a `weight` field, using the `zodResolver` to validate the field.
   * The form is initialized with a default value of an empty string for the `weight` field.
   */
  const form = useForm<weight_type>({
    resolver: zodResolver(weight),
    defaultValues: {
      weight: "",
    },
  });
  const { handleSubmit } = form;
  /**
   * Handles the submission of a temperature value for a resident.
   *
   * @param values - An object containing the temperature value to be submitted.
   * @param values.weight - The temperature value in degrees Celsius.
   * @returns {Promise<void>} - A promise that resolves when the temperature value has been successfully submitted.
   */

  const onSubmit = (values: weight_type) => {
    const temperatureWithUnit = `${values.weight}°C`;

    const data = {
      residentId: Number(residentId),
      message: temperatureWithUnit,
    };
    dispatch(
      PostAsyncThunk("post-message")({ ...data, type: "temperature" })
    ).then(() => {
      setTranscript("");
      setIsListening(false);
      form.setValue("weight", "");
      dispatch(
        getMessagesAsync({
          residentId: residentId,
          type: "temperature",
        })
      );
    });
  };
  useEffect(() => {
    form.setValue("weight", transcript);
  }, [transcript, form]);

  return (
    /**
     * Renders a form with a temperature input field and an optional speech-to-text feature.
     * The form is used to submit temperature data for a resident.
     * The speech-to-text feature is only available if the user's status is "approve".
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

            <div>
              <sup>o</sup>
              <span>C</span>
            </div>
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
