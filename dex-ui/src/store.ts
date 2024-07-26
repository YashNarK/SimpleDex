// src\store.ts

// Import necessary functions and reducers from Redux Toolkit
import { configureStore } from "@reduxjs/toolkit";
import metamaskReducer from "./features/metamask/metamaskSlice";
import infoReducer from "./features/info/infoSlice";
import swapInputReducer from "./features/swap/swapInputSlice";
import liquidityInputReducer from "./features/liquidity/liquidityInputSlice";

// Configure the Redux store with reducers for different state slices
const store = configureStore({
  reducer: {
    metamask: metamaskReducer, // Metamask state slice
    info: infoReducer, // Info state slice
    swap: swapInputReducer,
    liquidity: liquidityInputReducer,
  },
});

// Define the RootState type, representing the entire state tree
export type RootState = ReturnType<typeof store.getState>;

// Define the AppDispatch type, representing the dispatch function
export type AppDispatch = typeof store.dispatch;

// Export the configured store
export default store;
