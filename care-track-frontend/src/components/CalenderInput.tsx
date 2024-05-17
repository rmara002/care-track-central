/**
 * A reusable calendar input component that allows the user to select a date.
 *
 * The component uses the Radix UI Popover component to display a DayPicker calendar
 * when the user clicks on the input button. The selected date is formatted and
 * passed back to the parent component via the `setDate` function.
 *
 * @param {any} date - The currently selected date.
 * @param {any} setDate - A function to update the selected date in the parent component.
 * @returns {JSX.Element} - The calendar input component.
 */
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";

import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Button } from "./ui/button";

const CalenderInput = ({ date, setDate }: { date: any; setDate: any }) => {
  function formatDate(inputDate: any): any {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed, so we add 1
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            " pl-3 text-left font-normal w-[70%] ",
            !date && " text-muted-foreground"
          )}
        >
          {date ? format(date, "PPP") : <span>Pick a Date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-white p-0 z-10" align="start">
        <DayPicker
          mode="single"
          // selected={date}
          onSelect={(date) => setDate(formatDate(date))}
          captionLayout="dropdown"
          disabled={[{ after: new Date() }]}
          fromYear={1900}
          toYear={2025}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalenderInput;
