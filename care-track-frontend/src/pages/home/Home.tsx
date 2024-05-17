import { Input } from "@/components/ui/input";
import ResidentCard from "./home_components/ResidentCard";
import { Loader2, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import Separator from "@/components/Separator";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchResidents } from "@/redux/features/AsyncThunk";
import { useEffect, useState } from "react";
export default function Home() {
  const [searchQuery, SetSearchQuery] = useState<string | null>();
  const { user } = useAppSelector((state) => state.user);
  const { residents, loading } = useAppSelector((state) => state.residents);

  const dispatch = useAppDispatch();
  /**
   * Sorts the `residents` array in reverse chronological order based on the `created_at` date.
   *
   * @param {Resident[]} residents - The array of resident objects to sort.
   * @returns {Resident[]} - The sorted array of residents.
   */

  const sortedResidents = residents.slice().sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Reversed order
  });

  /**
   * Filters the `sortedResidents` array based on the `searchQuery` value. If `searchQuery` is truthy, it returns a new array containing only the residents whose name (converted to lowercase) includes the `searchQuery` value (also converted to lowercase). Otherwise, it returns the original `sortedResidents` array.
   *
   * @param {string} searchQuery - The search query to filter the residents by.
   * @param {Resident[]} sortedResidents - The array of residents to filter.
   * @returns {Resident[]} - The filtered array of residents.
   */
  const searchList = searchQuery
    ? sortedResidents.filter((resident) => {
        return resident.name.toLowerCase().includes(searchQuery);
        // eslint-disable-next-line no-mixed-spaces-and-tabs
      })
    : sortedResidents;

  /**
   * Handles the search input change event and updates the search query state.
   *
   * @param e - The React change event object for the input element.
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    const user_value = e.target.value.toLowerCase();
    SetSearchQuery(user_value);
  };

  /**
   * Fetches the list of residents when the user is available.
   *
   * This effect is used to fetch the list of residents from the server when the user is available. It dispatches the `fetchResidents` action to the Redux store, which triggers the asynchronous fetch operation.
   *
   * @param {Object} user - The current user object.
   * @returns {void}
   */
  useEffect(() => {
    if (user) {
      dispatch(fetchResidents());
    }
  }, [user]);
  return (
    <>
      {/* <Header /> */}
      <Separator>
        <h2 className="text-lg font-normal tracking-wide text-center sm:text-start  ">
          Residents
        </h2>
      </Separator>
      {/* Renders a search input and a list of resident cards based on the
      search results. * The search input allows the user to filter the list of
      residents. * If there are no search results, a "Not Found" message is
      displayed. * If the data is still loading, a loading spinner is shown. */}
      <div className="max-w-lg">
        <div className="flex flex-col space-y-3 items-center sm:items-start">
          <div className="flex items-center gap-x-10 border relative w-[90%] sm:w-[50%] h-8 focus-within:border-gray-500 px-2  rounded group">
            <Label
              htmlFor="search"
              className="group-hover:text-gray-700 duration-300 transition-colors ease-in-out absolute ml-1"
            >
              <Search className="w-4 h-4 text-gray-500  " />
            </Label>
            <Input
              id="search"
              className="ml-4 shadow-none  ring-0 border-0 focus:border-0 focus-visible:ring-0 active:border-0 focus:ring-0 active:ring-0 "
              placeholder="Search Resident"
              type="search"
              onChange={(e) => handleSearch(e)}
            />
          </div>
          <div className="flex flex-col space-y-2 max-w-2xl">
            {loading ? (
              <Loader />
            ) : searchList.length === 0 ? (
              <NotFound />
            ) : (
              searchList.map((resident, i) => (
                <>
                  <ResidentCard
                    url={`/${resident.id}`}
                    key={i}
                    name={resident.name}
                    dob={resident?.birthday}
                    room={resident.room_number}
                    id={resident.id}
                    icon={resident?.icon}
                  />
                </>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Renders a loading spinner component centered in the viewport.
 * This component is typically used to indicate that data is being loaded.
 */
const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="w-4 h-4 animate-spin items-center" />
    </div>
  );
};
/**
 * Renders a centered message indicating that no residents were found.
 * This component is typically used when a search query returns no results.
 */
export const NotFound = () => {
  return (
    <div className="flex items-center justify-center">
      <span>Not Found Any Resident!</span>
    </div>
  );
};
