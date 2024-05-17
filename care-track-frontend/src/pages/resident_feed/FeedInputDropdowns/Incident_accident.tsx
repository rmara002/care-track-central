import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { accident, accident_type } from "@/lib/validation_feed_post";
import { PostAsyncThunk, getMessagesAsync } from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
export default function Incident_accident() {
  const { user } = useAppSelector((state) => state.user);
  const { residentId } = useParams();
  const dispatch = useAppDispatch();
  /**
   * Initializes a form with default values for an accident/incident report.
   * The form uses the `zodResolver` to validate the form values against the `accident` schema.
   * The default values include fields for reporting, date, location, what happened, category, witnesses, person completing the form, whether the injured person went back to work, duration of absence, treatment, injury type, and who was involved.
   */
  const form = useForm<accident_type>({
    resolver: zodResolver(accident),
    defaultValues: {
      reporting: "",
      date: new Date(),
      location: "",
      happend: "",
      category: "",
      witness: "",
      person_completing: "",
      injuried_person_work: "",
      injuried_person_no_work: "",
      treatment: "",
      injury_type: "",
      Who_was_involved: "",
      completed: "",
    },
  });
  const { handleSubmit } = form;
  /**
   * Handles the submission of the incident/accident form.
   *
   * @param values - The form values, including details about the incident/accident.
   * @returns - Dispatches actions to post the incident/accident message and refresh the incident/accident message list.
   */
  const onSubmit = (values: accident_type) => {
    const formattedMessage = `
  1.1 What are you reporting? ${values.reporting || "N/A"}
  1.2 When did it happen? ${values.date ? format(values.date, "PPP") : "N/A"}
  1.3 Where did it happen? ${values.location || "N/A"}
  1.4 What happened? ${values.happend || "N/A"}
  1.5 What category best describes the incident? ${values.category || "N/A"}
  1.6 Witnesses: ${values.witness || "N/A"}
  2.1 Who was involved? ${values.Who_was_involved || "N/A"}
  2.2 What type of injury / illness / disease has been sustained? ${
    values.injury_type || "N/A"
  }
  2.3 What treatment was provided? ${values.treatment || "N/A"}
  2.4 Did the injured person go straight back to work afterwards? ${
    values.injuried_person_work || "N/A"
  }
  2.5 Duration of absence (if any): ${values.injuried_person_no_work || "N/A"}
  3.1 Details of the person completing this form: ${
    values.person_completing || "N/A"
  }
  3.2 Date form completed: ${values.completed || "N/A"}
  `?.trim();

    const data = {
      residentId: Number(residentId),
      message: formattedMessage,
    };
    dispatch(
      PostAsyncThunk("post-message")({
        ...data,
        type: "incident_accident_form",
      })
    ).then(() => {
      dispatch(
        getMessagesAsync({
          residentId: residentId,
          type: "incident_accident_form",
        })
      );
      form.setValue("reporting", "");
      form.setValue("date", new Date());
      form.setValue("location", "");
      form.setValue("happend", "");
      form.setValue("category", "");
      form.setValue("witness", "");
      form.setValue("person_completing", "");
      form.setValue("injuried_person_work", "");
      form.setValue("injuried_person_no_work", "");
      form.setValue("treatment", "");
      form.setValue("injury_type", "");
      form.setValue("Who_was_involved", "");
      form.setValue("completed", "");
    });
  };
  return (
    /**
     * This component renders a form for reporting work-related incidents, accidents, and near misses. It includes sections for capturing details about the incident, the person involved, and the person completing the form. The form uses the `react-hook-form` library for form management and validation.
     */
    <div>
      <Form {...form}>
        <form className="py-2" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="border-y-2 p-2 py-1">
            <h1 className="font-medium text-md">Instructions:</h1>
            <ul className="list-decimal ml-4 text-sm ">
              <li>
                Please use this form to report all work-related injuries,
                diseases, ill health and near misses.
              </li>
              <li>
                Complete the form immediately after the incident or arrange for
                someone to do it on your behalf.
              </li>
            </ul>
          </div>

          <div className="border-b-2 py-1 px-2">
            <h2>Section 1 - About The Incident</h2>
          </div>
          <div className="py-3">
            <div className="flex w-full max-w-lg justify-center items-center gap-1.5 px-2">
              <FormField
                control={form.control}
                name="reporting"
                render={({ field }) => (
                  <FormItem className="flex items-start sm:items-center justify-between gap-x-2 w-full flex-col my-3 sm:flex-row">
                    <FormLabel>
                      <span className="font-normal"> 1.1</span> What are you
                      reporting?
                    </FormLabel>
                    <div className="flex items-center gap-x-2">
                      <FormControl>
                        <Input
                          type="text"
                          placeholder=""
                          className='w-full max-w-[120px] h-7 rounded  resize-none "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="px-2" />
                      <FormDescription className="italic">
                        (Explanation of terms)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full max-w-sm justify-center items-center gap-1.5 px-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex items-start sm:items-center justify-between gap-x-2 w-full flex-col my-3 sm:flex-row">
                    <FormLabel>
                      <span className="font-normal"> 1.2</span> When did it
                      happen?
                    </FormLabel>
                    <div className="flex items-center gap-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="px-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full max-w-sm justify-center items-center gap-1.5 px-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex items-start sm:items-center justify-between gap-x-2 w-full flex-col my-3 sm:flex-row">
                    <FormLabel>
                      <span className="font-normal"> 1.3</span> Where did it
                      happen?
                    </FormLabel>
                    <div className="flex items-center gap-x-2">
                      <FormControl>
                        <Input
                          type=""
                          placeholder=""
                          className='w-full max-w-[120px] h-7 rounded  resize-none "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="px-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full justify-center items-center gap-1.5 px-2">
              <FormField
                control={form.control}
                name="happend"
                render={({ field }) => (
                  <FormItem className="flex gap-x-2 w-full flex-col my-3 sm:flex-row">
                    <div className="flex flex-col my-3 gap-2 max-w-[28ch]">
                      <FormLabel>
                        <span className="font-normal"> 1.4</span> What happened?
                      </FormLabel>
                      <FormDescription className="max-w-prose pl-6">
                        Please describe the near miss, accident, incident,
                        dangerous occurence etc., including events that lead to
                        it, and details about any equipment, substances or
                        materials involved.
                      </FormDescription>
                    </div>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Textarea
                          rows={7}
                          {...field}
                          className="w-[400px] resize-none min-h-20"
                          placeholder="Post the details here..."
                        />
                      </FormControl>
                      <FormMessage className="px-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full justify-center items-center gap-1.5 px-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex items-start sm:items-center   gap-x-2 w-full flex-col my-3 sm:flex-row">
                    <FormLabel>
                      <span className="font-normal"> 1.5</span> What category
                      best describes the incident?
                    </FormLabel>
                    <div className="flex items-center gap-x-2">
                      <FormControl>
                        <Input
                          type=""
                          placeholder=""
                          className='  h-7 rounded  resize-none "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="px-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full justify-center items-center gap-1.5 px-2">
              <FormField
                control={form.control}
                name="witness"
                render={({ field }) => (
                  <FormItem className="flex gap-x-2 w-full flex-col my-3 sm:flex-row">
                    <div className="flex flex-col my-3 gap-2 max-w-[28ch]">
                      <FormLabel>
                        <span className="font-normal"> 1.6</span> Witnesses
                      </FormLabel>
                      <FormDescription className="max-w-prose pl-6">
                        Name(s) and contact details of anyone who witnessed the
                        incident.
                      </FormDescription>
                    </div>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Textarea
                          rows={7}
                          {...field}
                          className="w-[400px] resize-none min-h-20"
                          placeholder="Post the details here..."
                        />
                      </FormControl>
                      <FormMessage className="px-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border-y-2 py-1 px-2">
            <h2>Section 2 - About The Person Involved (if applicable)</h2>
          </div>
          <div className="py-3 space-y-5">
            <div className="flex w-full justify-center items-center gap-1.5 px-2">
              <FormField
                control={form.control}
                name="Who_was_involved"
                render={({ field }) => (
                  <FormItem className="flex gap-x-2 w-full flex-col my-3 sm:flex-row">
                    <div className="flex flex-col my-3 gap-2 max-w-[28ch]">
                      <FormLabel>
                        <span className="font-normal"> 2.1</span> Who was
                        involved?
                      </FormLabel>
                      <FormDescription className="max-w-prose pl-6">
                        Name, role and contact details (include staff number and
                        function name).) Please include the full address for any
                        volunteer or third party injured (e.g. Contractor,
                        visitor, member of the public etc.).
                      </FormDescription>
                    </div>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Textarea
                          rows={7}
                          {...field}
                          className="w-[400px] resize-none min-h-20"
                          placeholder="Post the details here..."
                        />
                      </FormControl>
                      <FormMessage className="px-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className=" my-2 px-6 mx-auto  ">
              <h1 className="bg-muted text-md font-semibold">
                If Near Miss reported - please go to section 3 after completing
                2.1 above.
              </h1>
            </div>
            <div className="flex w-full justify-center items-center gap-1.5 px-2">
              <FormField
                control={form.control}
                name="injury_type"
                render={({ field }) => (
                  <FormItem className="flex flex-col my-3 w-full">
                    <FormLabel>
                      <span className="font-normal"> 2.2</span> What type of
                      injury / illness / disease has been sustained?
                    </FormLabel>
                    <div className="flex flex-col my-3 gap-x-2">
                      <div className="flex gap-x-2">
                        <FormDescription className=" max-w-[240px] pl-6">
                          Please include which part / side of the body was
                          affected.
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            rows={7}
                            {...field}
                            className="w-[400px] resize-none min-h-20"
                            placeholder="Post the details here..."
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="px-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className=" my-2 px-6 mx-auto  ">
              <h1 className="bg-muted text-md font-semibold">
                For injuries only:
              </h1>
            </div>
            <div className="flex w-full justify-center items-center gap-1.5 px-2">
              <FormField
                control={form.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem className="flex flex-col my-3 w-full">
                    <FormLabel>
                      <span className="font-normal"> 2.3</span> What treatment
                      was provided?
                    </FormLabel>
                    <div className="flex flex-col my-3 gap-x-2">
                      <div className="flex gap-x-2">
                        <FormDescription className=" max-w-[240px] pl-6">
                          Please include whether first aid and/or hospital
                          treatment was needed
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            rows={7}
                            {...field}
                            className="w-[400px] resize-none min-h-20"
                            placeholder="Post the details here..."
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="px-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full max-w-[29rem] justify-center items-center gap-1.5 px-2">
              <FormField
                control={form.control}
                name="injuried_person_work"
                render={({ field }) => (
                  <FormItem className="flex items-start sm:items-center justify-between gap-x-2 w-full flex-col my-3 sm:flex-row">
                    <FormLabel className="flex gap-x-1">
                      <span className="font-normal"> 2.4</span>{" "}
                      <h2 className="leading-4">
                        Did the injured person go straight back to work
                        afterwards?
                      </h2>
                    </FormLabel>
                    <div className="flex items-center gap-x-2">
                      <FormControl>
                        <Input
                          type=""
                          placeholder=""
                          className='w-[200px] h-7 rounded  resize-none "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="px-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full max-w-[29rem] justify-center items-center gap-1.5 px-2 pl-7">
              <FormField
                control={form.control}
                name="injuried_person_no_work"
                render={({ field }) => (
                  <FormItem className="flex items-start sm:items-center justify-between gap-x-2 w-full flex-col my-3 sm:flex-row">
                    <FormLabel className="text-sm font-normal">
                      If no please given duration of absence if known
                    </FormLabel>
                    <div className="flex items-center gap-x-2">
                      <FormControl>
                        <Input
                          type=""
                          placeholder=""
                          className='w-[200px] h-7 rounded  resize-none "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="px-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border-y-2 py-1 px-2">
            <h2>Section 3 - Person Completing this Form</h2>
          </div>
          <div className="p-2">
            <div className="flex w-full justify-center items-center gap-1.5 ">
              <FormField
                control={form.control}
                name="person_completing"
                render={({ field }) => (
                  <FormItem className="flex flex-col my-3 w-full">
                    <FormLabel className=" font-normal">
                      <h1 className="leading-5">
                        3.1
                        <span className="font-semibold ml-1">
                          Details of the person completing this form{" "}
                        </span>
                        (if different to those given in box 2.1 above) Name,
                        role and contact details (include staff number and
                        Function name). If you are a volunteer or third party
                        (e.g. a contractor) please include your full address
                      </h1>
                    </FormLabel>
                    <div className="flex flex-col my-3 w-full gap-x-2">
                      <FormControl>
                        <Textarea
                          rows={7}
                          {...field}
                          className=" resize-none min-h-20"
                          placeholder=""
                        />
                      </FormControl>
                      <FormMessage className="px-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex w-full max-w-sm justify-center items-center gap-1.5 p-2">
            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex items-start sm:items-center justify-between gap-x-2 w-full flex-col my-3 sm:flex-row">
                  <FormLabel>
                    <span className="font-normal"> 3.2</span> Date form
                    completed:
                  </FormLabel>
                  <div className="flex items-center gap-x-2">
                    <FormControl>
                      <Input
                        type=""
                        placeholder=""
                        className='w-full max-w-[200px] h-7 rounded  resize-none "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="px-2" />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col my-3 gap-2 py-2">
            {user?.status === "approve" && (
              <div className="self-end px-4">
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
    </div>
  );
}
