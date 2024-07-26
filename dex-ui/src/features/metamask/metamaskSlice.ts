// src/features/metamask/metamaskSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MetamaskState {
  ethBalance: number;
  nctBalance: number;
  lpTokenBalance: number;
  address: string;
  network: string;
}
const name = "metamask";
const initialState: MetamaskState = {
  ethBalance: 0,
  nctBalance: 0,
  lpTokenBalance: 0,
  address: "Connect Your Wallet for more info",
  network: "",
};

const reducers = {
  setBalances(
    state: MetamaskState,
    action: PayloadAction<Omit<MetamaskState, "address" | "network">>
  ) {
    state.ethBalance = action.payload.ethBalance;
    state.nctBalance = action.payload.nctBalance;
    state.lpTokenBalance = action.payload.lpTokenBalance;
  },
  setNetwork(
    state: MetamaskState,
    action: PayloadAction<Pick<MetamaskState, "network">>
  ) {
    state.network = action.payload.network;
  },
  setAddress(
    state: MetamaskState,
    action: PayloadAction<Pick<MetamaskState, "address">>
  ) {
    state.address = action.payload.address;
  },
  resetMetamask(): MetamaskState {
    return initialState;
  },
};

const metamaskSlice = createSlice({
  name,
  initialState,
  reducers,
});

export const { setBalances, setAddress, setNetwork, resetMetamask } =
  metamaskSlice.actions;

const metamaskReducer = metamaskSlice.reducer;
export default metamaskReducer;
