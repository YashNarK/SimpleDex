// src/features/info/infoSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InfoState {
  lpTokenInCirculation: number;
  ethPerToken: number | string;
  tokenPerEth: number | string;
  contractNCT: number;
  contractETH: number;
}

const name = "info";

const initialState: InfoState = {
  lpTokenInCirculation: 0,
  ethPerToken: 0,
  tokenPerEth: 0,
  contractNCT: 0,
  contractETH: 0,
};

const reducers = {
  setInfo(state: InfoState, action: PayloadAction<Partial<InfoState>>) {
    return { ...state, ...action.payload };
  },
  resetInfo(): InfoState {
    return initialState;
  },
};

const infoSlice = createSlice({
  name,
  initialState,
  reducers,
});

export const { setInfo, resetInfo } = infoSlice.actions;

const infoReducer = infoSlice.reducer;
export default infoReducer;
