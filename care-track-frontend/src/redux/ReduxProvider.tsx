/**
 * Provides the Redux store to the React application.
 *
 * This component wraps the entire application with the Redux `Provider` component,
 * which makes the Redux store available to all child components.
 *
 * @param {ReactNode} children - The React components that will have access to the Redux store.
 * @returns {JSX.Element} - The Redux-provided application wrapped in the Provider component.
 */
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";

const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
