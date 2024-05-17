import { useEffect, useState } from "react";

/**
 * A custom React hook that retrieves the current user's data from local storage and maintains it in state.
 * This hook is designed to provide a convenient way to access and manage the current user's information
 * across the React application.
 *
 */

const useCurrentUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from local storage
    const userData = localStorage.getItem("user");
    if (userData) {
      // Parse user data from JSON string
      setUser(JSON.parse(userData));
    }
  }, []);

  return user;
};

export default useCurrentUser;
