/**
 * The main entry point of the React application.
 *
 * This component sets up the router and the toast notification system.
 *
 * The `RouterProvider` component is used to render the application's routing configuration, defined in the `routing` module.
 *
 * The `Toaster` component is used to display toast notifications at the top-right of the screen.
 */

import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { routing } from "./routing/routing";
function App() {
  return (
    <>
      <RouterProvider router={routing} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
