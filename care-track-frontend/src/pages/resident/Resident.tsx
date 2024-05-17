import Loading from "@/components/Loading";
import { Separator } from "@/components/ui/separator";
import { getCarePlan } from "@/redux/features/AsyncThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { format } from "date-fns";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Resident_field from "./resident_components/Resident_field";
import { CarePlan } from "@/lib/types";

export default function Resident() {
  /**
   * Retrieves the care plan for the resident with the specified ID, and updates the application state with the retrieved data.
   * This code is executed when the component is first rendered, and whenever the `residentId` parameter changes.
   * If the `residentId` is not provided, no care plan will be retrieved.
   * While the care plan is being retrieved, a `Loading` component is displayed.
   */
  const { residentId } = useParams();

  const dispatch = useAppDispatch();
  const { carePlan, loading } = useAppSelector((state) => state.carePlan);

  useEffect(() => {
    if (residentId) {
      dispatch(getCarePlan(Number(residentId)));
    }
  }, [residentId]);

  if (loading) {
    return <Loading />;
  }
  const carePlanFields = [
    { key: "name", fieldName: "Resident Name" },
    { key: "birthday", fieldName: "Resident Date of Birth" },
    { key: "age", fieldName: "Resident Age" },
    { key: "roomNumber", fieldName: "Room Number" },
    { key: "medical_history", fieldName: "Medical History" },
    { key: "allergies", fieldName: "Allergies" },
    { key: "medications", fieldName: "Medications" },
    { key: "key_contacts", fieldName: "Key Contacts" },
    { key: "support", fieldName: "How We Support Resident" },
    { key: "behavior", fieldName: "Communication & Behaviour" },
    { key: "personal_care", fieldName: "Personal Care" },
    { key: "mobility", fieldName: "Mobility & Manual Handing" },
    { key: "sleep", fieldName: "Sleep" },
    { key: "nutrition", fieldName: "Nutrition" },
  ];
  return (
    /**
     * Renders a section of the Resident page that displays the resident's care plan details.
     * The section includes various fields such as name, date of birth, age, medical history, allergies, room number, medications, key contacts, support, communication & behavior, personal care, mobility, sleep, and nutrition.
     * The fields are displayed using the `Resident_field` component, which shows the field name, the user who last updated the field, and the date of the last update.
     * If the `carePlan` prop is not provided or is `null`, a "Not Found the Resident" message is displayed instead.
     */
    <div>
      {carePlan ? (
        <div>
          <Separator className="my-4 bg-gray-300 h-[1.5px] py-[1px] px-0 " />
          <div className="border border-gray-400 mx-2">
            {carePlan ? (
              <div className="flex flex-col">
                {carePlanFields.map((field) => {
                  return (
                    <Resident_field
                      key={field.key}
                      user_name={carePlan?.updated_by}
                      update_at={
                        carePlan?.updates?.[field.key as keyof CarePlan]
                      }
                      id={field.key}
                      fieldName={field.fieldName}
                      initialValue={
                        field?.key === "birthday"
                          ? carePlan?.[field?.key as keyof CarePlan] &&
                            format(
                              carePlan?.[field?.key as keyof CarePlan],
                              "dd-MM-yyy"
                            )
                          : carePlan?.[field.key as keyof CarePlan]
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <div className="py-4">
                <Loading />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center my-10">
          <h2>Resident Not Found</h2>
        </div>
      )}
    </div>
  );
}
