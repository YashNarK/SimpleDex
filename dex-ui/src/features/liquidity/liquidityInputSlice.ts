// dex-ui\src\features\liquidity\liquidityInputSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LiquidityInputState {
  ethAmount: number;
  nctAmount: number;
  lpTokenAmount: number;
}

const initialState: LiquidityInputState = {
  ethAmount: 0,
  nctAmount: 0,
  lpTokenAmount: 0,
};

const reducers = {
  setLiquidityInput(
    state: LiquidityInputState,
    action: PayloadAction<Partial<LiquidityInputState>>
  ) {
    return { ...state, ...action.payload };
  },
  resetLiquidityInput() {
    return initialState;
  },
};

const liquiditySlice = createSlice({
  name: "liquidity",
  initialState,
  reducers,
});

export const { setLiquidityInput, resetLiquidityInput } =
  liquiditySlice.actions;

const liquidityInputReducer = liquiditySlice.reducer;
export default liquidityInputReducer;
