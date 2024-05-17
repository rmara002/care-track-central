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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { food_intake, food_intake_type } from "@/lib/validation_feed_post";
import { PostAsyncThunk, getMessagesAsync } from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Speech from "./Speech";
export default function Food_Intake() {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  const { user } = useAppSelector((state) => state.user);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  /**
   * Initializes a form with the `food_intake_type` type, using the `useForm` hook from the React Hook Form library.
   * The form has the following default values:
   * - `meal_type`: "breakfast"
   * - `text`: ""
   * - `weight`: ""
   * The form's field values are validated using the `zodResolver` function from the `@hookform/resolvers/zod` library, which resolves the `food_intake` Zod schema.
   */
  const form = useForm<food_intake_type>({
    resolver: zodResolver(food_intake),
    defaultValues: {
      meal_type: "breakfast",
      text: "",
      weight: "",
    },
  });
  const { handleSubmit } = form;
  /**
   * Handles the submission of a food intake form, dispatching actions to post the food intake message and refresh the food intake data.
   *
   * @param values - An object containing the form field values, including the meal type, text description, and weight percentage.
   * @returns - A Promise that resolves when the food intake message has been posted and the food intake data has been refreshed.
   */
  const onSubmit = (values: food_intake_type) => {
    const weightWithPercentage = `${values.weight}%`;
    const data = {
      residentId: Number(residentId),
      message: `${values.meal_type}, ${values.text}, ${weightWithPercentage}`,
    };
    dispatch(
      PostAsyncThunk("post-message")({ ...data, type: "food_intake" })
    ).then(() => {
      dispatch(
        getMessagesAsync({
          residentId: residentId,
          type: "food_intake",
        })
      );
      form.setValue("text", "");
      form.setValue("weight", "");
      form.setValue("meal_type", "breakfast");
      setTranscript("");
      setIsListening(false);
    });
  };

  useEffect(() => {
    form.setValue("text", transcript);
  }, [transcript, form]);
  return (
    /**
     * A form component that allows the user to input details about a meal, including the meal type, amount eaten, and additional text. The form also includes a speech-to-text feature for the user to dictate the details.
     */
    <Form {...form}>
      <form className="py-2" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name="meal_type"
          render={({ field }) => (
            <FormItem className="border-y-2 py-2 px-2 flex items-center gap-x-2">
              <FormLabel>Meal Type: </FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <ToggleGroupItem
                    value="breakfast"
                    aria-label="breakfast"
                    className="border h-7 px-2 rounded "
                  >
                    Breakfast
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="lunch"
                    aria-label="lunch"
                    className="border h-7 px-2 rounded "
                  >
                    Lunch
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="dinner"
                    aria-label="dinner"
                    className="border h-7 px-2 rounded "
                  >
                    Dinner
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="snack"
                    aria-label="snack"
                    className="border h-7 px-2 rounded "
                  >
                    Snack
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage className="px-2" />
            </FormItem>
          )}
        />

        <div className="border-b-2 py-3">
          <div className="flex w-full max-w-sm items-center gap-1.5  px-2">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem className="flex items-center gap-x-2">
                  <FormLabel>Amount Eaten:</FormLabel>
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
            %
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
                    (Examples of what to write: name of the food that was eaten, any dietary preferences adhered to,
                      appetite levels, assistance provided during meals, and any reactions to foods.)"
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
