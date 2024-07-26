// Import the necessary hooks from react-redux
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// Import types for the application's dispatch function and root state
import { AppDispatch, RootState } from "./store";

// Create a custom hook for dispatching actions
// This hook is typed to use the AppDispatch type, ensuring type safety
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Create a custom hook for selecting state from the store
// This hook is typed to use the RootState type, ensuring type safety
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
