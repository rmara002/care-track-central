/**
 * Renders the main React application, wrapped in a Redux provider.
 *
 * This code is the entry point for the React application. It creates a root
 * React DOM element and renders the `<App />` component, which is the top-level
 * component of the application. The `<App />` component is wrapped in a
 * `<ReduxProvider />` component, which provides the Redux store to the
 * application.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ReduxProvider from "./redux/ReduxProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider>
      <App />
    </ReduxProvider>
  </React.StrictMode>
);
