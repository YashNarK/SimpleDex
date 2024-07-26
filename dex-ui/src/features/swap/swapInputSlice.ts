// src/features/swap/swapSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SwapInputState {
  ethAmount: number;
  nctAmount: number;
}

const initialState: SwapInputState = {
  ethAmount: 0,
  nctAmount: 0,
};
const reducers = {
  setSwapInput(
    state: SwapInputState,
    action: PayloadAction<Partial<SwapInputState>>
  ) {
    return { ...state, ...action.payload };
  },
  resetSwapInput() {
    return initialState;
  },
};

const swapSlice = createSlice({
  name: "swap",
  initialState,
  reducers,
});

export const { setSwapInput, resetSwapInput } = swapSlice.actions;
const swapInputReducer = swapSlice.reducer;
export default swapInputReducer;
