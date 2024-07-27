// dex-ui\src\services\refreshData.ts
import SimpleDexService from "./SimpleDexService";
import utilityService from "./UtilityService";
import { AppDispatch } from "../store";
import { setInfo } from "../features/info/infoSlice";
import { setBalances } from "../features/metamask/metamaskSlice";
import { ethers } from "ethers";
import {
  NCT_CONTRACT_ABI,
  NCT_CONTRACT_ADDRESS,
  SIMPLE_DEX_ABI,
  SIMPLE_DEX_ADDRESS,
} from "../blockchainData/blockchainData";

/**
 * Refreshes data related to the DEX and updates the Redux store with the new information.
 * @param provider - The ethers provider used to interact with the blockchain.
 * @param signer - The ethers signer used to authorize transactions and access user-specific data.
 * @param dispatch - The Redux dispatch function used to update the state.
 */
export const refreshDexData = async (
  provider: ethers.Provider,
  signer: ethers.Signer,
  dispatch: AppDispatch
) => {
  // Create an instance of SimpleDexService to interact with the DEX contract
  const simpleDexService = new SimpleDexService(provider, signer);

  try {
    // Fetch the total supply of LP tokens from the DEX contract
    const circulatingLP = await simpleDexService.getTotalSupply();
    // Convert the total supply of LP tokens from BigInt to a float
    const circulatingLP_inNumber =
      utilityService.convertBigIntToFloat(circulatingLP);

    // Fetch the amount of ETH held by the DEX contract
    const contractETH = await simpleDexService.getETHsInContract();
    // Convert the ETH amount from BigInt to a float
    const contractETH_inNumber =
      utilityService.convertBigIntToFloat(contractETH);

    // Fetch the amount of NCT tokens held by the DEX contract
    const contractNCT = await simpleDexService.getTokensInContract();
    // Convert the NCT amount from BigInt to a float
    const contractNCT_inNumber =
      utilityService.convertBigIntToFloat(contractNCT);

    // Calculate the amount of ETH per NCT token
    const ETH_per_NCT = contractNCT_inNumber
      ? utilityService.calculateSwapOutputAmount(
          1, // Input amount is 1 NCT token
          contractNCT_inNumber,
          contractETH_inNumber
        )
      : "NA"; // Return "NA" if no NCT tokens are held by the contract

    // Calculate the amount of NCT tokens per ETH
    const NCT_per_ETH = contractETH_inNumber
      ? utilityService.calculateSwapOutputAmount(
          1, // Input amount is 1 ETH
          contractETH_inNumber,
          contractNCT_inNumber
        )
      : "NA"; // Return "NA" if no ETH is held by the contract

    // Create a payload object with the fetched and calculated data
    const payload = {
      ethPerToken: ETH_per_NCT,
      tokenPerEth: NCT_per_ETH,
      lpTokenInCirculation: circulatingLP_inNumber,
      contractNCT: contractNCT_inNumber,
      contractETH: contractETH_inNumber,
    };

    // Dispatch the action to update the Redux store with the new data
    dispatch(setInfo(payload));
  } catch (error) {
    // Log any errors that occur during data fetching
    console.error("Failed to fetch contract data:", error);
  }
};

/**
 * Refreshes MetaMask-related data and updates the Redux store with the new balances.
 * @param provider - The ethers provider used to interact with the blockchain.
 * @param signer - The ethers signer used to authorize transactions and access user-specific data.
 * @param dispatch - The Redux dispatch function used to update the state.
 */
export const refreshMetaMaskData = async (
  provider: ethers.Provider,
  signer: ethers.Signer,
  dispatch: AppDispatch
) => {
  try {
    // Fetch the user's Ethereum address from the signer
    const address = await signer.getAddress();
    // Fetch the ETH balance of the user's address
    const balance = await provider.getBalance(address);
    // Convert the ETH balance from BigInt to a float
    const ethBalance = utilityService.convertBigIntToFloat(balance);

    // Create a contract instance for interacting with the NCT token contract
    const nctContract = new ethers.Contract(
      NCT_CONTRACT_ADDRESS, // Address of the NCT contract
      NCT_CONTRACT_ABI, // ABI of the NCT contract
      provider // Use provider for read-only operations
    );
    // Fetch the NCT token balance of the user's address
    const nctBalanceBigNumber = await nctContract.balanceOf(address);
    // Convert the NCT token balance from BigInt to a float
    const nctBalance = utilityService.convertBigIntToFloat(nctBalanceBigNumber);

    // Create a contract instance for interacting with the Simple DEX contract
    const simpleDexContract = new ethers.Contract(
      SIMPLE_DEX_ADDRESS, // Address of the Simple DEX contract
      SIMPLE_DEX_ABI, // ABI of the Simple DEX contract
      provider // Use provider for read-only operations
    );
    // Fetch the LP token balance of the user's address
    const lpTokenBalanceBigNumber = await simpleDexContract.balanceOf(address);
    // Convert the LP token balance from BigInt to a float
    const lpTokenBalance = utilityService.convertBigIntToFloat(
      lpTokenBalanceBigNumber
    );

    // Create a payload object with the fetched balances
    const payload = {
      ethBalance: ethBalance,
      nctBalance: nctBalance,
      lpTokenBalance: lpTokenBalance,
    };

    // Dispatch the action to update the Redux store with the new balances
    dispatch(setBalances(payload));
  } catch (error) {
    // Log any errors that occur during data fetching
    console.error("Failed to fetch MetaMask data:", error);
  }
};
