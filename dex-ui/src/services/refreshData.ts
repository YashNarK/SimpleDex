// src/services/refreshData.ts
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

export const refreshDexData = async (
  provider: ethers.Provider,
  signer: ethers.Signer,
  dispatch: AppDispatch
) => {
  const simpleDexService = new SimpleDexService(provider, signer);

  try {
    const circulatingLP = await simpleDexService.getTotalSupply();
    const circulatingLP_inNumber =
      utilityService.convertBigIntToFloat(circulatingLP);

    const contractETH = await simpleDexService.getETHsInContract();
    const contractETH_inNumber =
      utilityService.convertBigIntToFloat(contractETH);

    const contractNCT = await simpleDexService.getTokensInContract();
    const contractNCT_inNumber =
      utilityService.convertBigIntToFloat(contractNCT);

    const ETH_per_NCT = contractNCT_inNumber
      ? utilityService.calculateSwapOutputAmount(
          1,
          contractNCT_inNumber,
          contractETH_inNumber
        )
      : "NA";
    const NCT_per_ETH = contractETH_inNumber
      ? utilityService.calculateSwapOutputAmount(
          1,
          contractETH_inNumber,
          contractNCT_inNumber
        )
      : "NA";

    const payload = {
      ethPerToken: ETH_per_NCT,
      tokenPerEth: NCT_per_ETH,
      lpTokenInCirculation: circulatingLP_inNumber,
      contractNCT: contractNCT_inNumber,
      contractETH: contractETH_inNumber,
    };
    dispatch(setInfo(payload));
    console.log("dex:", payload);
  } catch (error) {
    console.error("Failed to fetch contract data:", error);
  }
};

export const refreshMetaMaskData = async (
  provider: ethers.Provider,
  signer: ethers.Signer,
  dispatch: AppDispatch
) => {
  try {
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    const ethBalance = utilityService.convertBigIntToFloat(balance);

    const nctContract = new ethers.Contract(
      NCT_CONTRACT_ADDRESS, // Replace with your NCT contract address
      NCT_CONTRACT_ABI, // Replace with your NCT ABI
      provider
    );
    const nctBalanceBigNumber = await nctContract.balanceOf(address);
    const nctBalance = utilityService.convertBigIntToFloat(nctBalanceBigNumber);

    const simpleDexContract = new ethers.Contract(
      SIMPLE_DEX_ADDRESS, // Replace with your Simple DEX contract address
      SIMPLE_DEX_ABI, // Replace with your DEX ABI
      provider
    );
    const lpTokenBalanceBigNumber = await simpleDexContract.balanceOf(address);
    const lpTokenBalance = utilityService.convertBigIntToFloat(
      lpTokenBalanceBigNumber
    );
    const payload = {
      ethBalance: ethBalance,
      nctBalance: nctBalance,
      lpTokenBalance: lpTokenBalance,
    };
    dispatch(setBalances(payload));
    console.log("metamask:", payload);
  } catch (error) {
    console.error("Failed to fetch MetaMask data:", error);
  }
};
