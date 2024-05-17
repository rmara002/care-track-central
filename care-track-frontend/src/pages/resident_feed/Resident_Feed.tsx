import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import Blood_sugar_level from "./FeedInputDropdowns/Blood_sugar_level";
import Body_map from "./FeedInputDropdowns/Body_map";
import Bowel_Movement from "./FeedInputDropdowns/Bowel_Movement";
import Fluid_intake from "./FeedInputDropdowns/Fluid_intake";
import Food_Intake from "./FeedInputDropdowns/Food_Intake";
import Incident_accident from "./FeedInputDropdowns/Incident_accident";
import Oxygen_Saturation from "./FeedInputDropdowns/Oxygen_Saturation";
import PC_Hygiene from "./FeedInputDropdowns/PC_Hygiene";
import Personal_Care from "./FeedInputDropdowns/Personal_Care";
import Pulse_rate from "./FeedInputDropdowns/Pulse_rate";
import Temperature from "./FeedInputDropdowns/Temperature";
import Weight from "./FeedInputDropdowns/Weight";
import { Drop_Down } from "./feed_components/Drop_Down";
import Blood_Sugar_Post from "./PostsComponents/Blood_Sugar_Post";
import Body_Map_Post from "./PostsComponents/Body_Map_Post";
import Bowel_Movement_Post from "./PostsComponents/Bowel_Movement_Post";
import Fluid_Intake_Post from "./PostsComponents/Fluid_Intake_Post";
import Food_Intake_Post from "./PostsComponents/Food_Intake_Post";
import Incident_Accident_Post from "./PostsComponents/Incident_Accident_Post";
import Oxygen_Saturation_Post from "./PostsComponents/Oxygen_Saturation_Post";
import PC_Hygiene_Post from "./PostsComponents/PC_Hygiene_Post";
import Personal_Care_Posts from "./PostsComponents/Personal_Care_Posts";
import Pulse_Rate_Posts from "./PostsComponents/Pulse_Rate_Post";
import Temperature_Posts from "./PostsComponents/Temperature_Posts";
import Weight_Post from "./PostsComponents/Weight_Post";

/**
 * The `Resident_Feed` component is the main entry point for the resident feed functionality in the application. It manages the state of the selected component and renders the appropriate component based on the user's selection.

 * The component uses a `COMPONENT_MAP` object to map the selected component value to the corresponding JSX element, and a `POST_COMPONENT_MAP` object to map the selected component to the corresponding post component.

 * The `handleSelect` function is used to update the `selectedComponent` state when the user selects a different component from the dropdown.

 * The component renders a separator, a dropdown for selecting the component, and the selected component and post component based on the user's selection.
 */
const Resident_Feed = () => {
  const [selectedComponent, setSelectedComponent] =
    useState<string>("personal-care");

  const handleSelect = (value: string) => {
    setSelectedComponent(value);
  };

  const COMPONENT_MAP: Record<string, JSX.Element> = {
    "personal-care": <Personal_Care />,
    "personal-care-hygiene": <PC_Hygiene />,
    "food-intake": <Food_Intake />,
    "fluid-intake": <Fluid_intake />,
    weight: <Weight />,
    "oxygen-saturation": <Oxygen_Saturation />,
    "pulse-rate": <Pulse_rate />,
    temperature: <Temperature />,
    "blood-sugar-level": <Blood_sugar_level />,
    "bowel-movement": <Bowel_Movement />,
    "body-map": <Body_map />,
    "incident-accident": <Incident_accident />,
  };

  const POST_COMPONENT_MAP: Record<string, JSX.Element> = {
    "personal-care": <Personal_Care_Posts />,
    "personal-care-hygiene": <PC_Hygiene_Post />,
    "food-intake": <Food_Intake_Post />,
    "fluid-intake": <Fluid_Intake_Post />,
    weight: <Weight_Post />,
    "oxygen-saturation": <Oxygen_Saturation_Post />,
    "pulse-rate": <Pulse_Rate_Posts />,
    temperature: <Temperature_Posts />,
    "blood-sugar-level": <Blood_Sugar_Post />,
    "bowel-movement": <Bowel_Movement_Post />,
    "body-map": <Body_Map_Post />,
    "incident-accident": <Incident_Accident_Post />,
  };

  return (
    <div>
      <Separator className="my-4 bg-gray-300 h-[1.5px] py-[1px] px-0 " />
      <div className="border border-gray-300  ">
        <div className="flex items-center gap-x-2 p-2">
          <span className="text-md font-medium">Post to :</span>
          <div className=" w-1/2 ">
            <Drop_Down onSelect={handleSelect} />
          </div>
        </div>
        {COMPONENT_MAP[selectedComponent]}
      </div>
      {POST_COMPONENT_MAP[selectedComponent]}
    </div>
  );
};

export default Resident_Feed;
