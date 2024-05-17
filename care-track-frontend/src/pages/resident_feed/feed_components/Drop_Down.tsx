import React from "react";
type Option = {
  value: string;
  label: string;
};
interface Props {
  onSelect: (value: string) => void;
}
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export const Drop_Down: React.FC<Props> = ({ onSelect }) => {
  const options: Option[] = [
    { value: "personal-care", label: "Personal Care" },
    { value: "personal-care-hygiene", label: "Personal Care & Hygiene" },
    { value: "food-intake", label: "Food Intake" },
    { value: "fluid-intake", label: "Fluid Intake" },
    { value: "weight", label: "Weight" },
    { value: "oxygen-saturation", label: "Oxygen Saturation" },
    { value: "pulse-rate", label: "Pulse Rate" },
    { value: "temperature", label: "Temperature" },
    { value: "blood-sugar-level", label: "Blood Sugar Level" },
    { value: "bowel-movement", label: "Bowel Movement" },
    { value: "body-map", label: "Body Map" },
    { value: "incident-accident", label: "Incident & Accident Form" },
  ];
  /**
   * Renders a dropdown menu component for selecting an option.
   *
   * The dropdown is implemented using the `Select` component from the Radix UI library.
   * It displays a placeholder value of "Personal Care" and allows the user to select from
   * a list of options provided in the `options` prop.
   *
   * When the user selects an option, the `onSelect` callback function is called with the
   * selected option's value.
   *
   * @param {Object} props - The component props.
   * @param {Array<{ value: string, label: string }>} props.options - The available options to display in the dropdown.
   * @param {(value: string) => void} props.onSelect - The callback function to call when an option is selected.
   * @returns {JSX.Element} - The rendered dropdown menu component.
   */
  return (
    <Select onValueChange={(e) => onSelect(e)}>
      <SelectTrigger id="menu " className="py-1 h-fit mt-2">
        <SelectValue placeholder="Personal Care" />
      </SelectTrigger>
      <SelectContent position="item-aligned">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
