import { useEffect } from "react";
import SimpleDexService from "../services/SimpleDexService";
import utilityService from "../services/UtilityService";
import { setInfo } from "../features/info/infoSlice";
import alchemyProvider from "../blockchainData/alchemyProvider";
import { ethers } from "ethers";
import { AppDispatch } from "../store";

const useFetchDexData = (
  provider: ethers.BrowserProvider | null,
  signer: ethers.Signer | null,
  dispatch: AppDispatch
) => {
  console.log("called dex");
  useEffect(() => {
    const fetchData = async () => {
      if (!alchemyProvider) return;

      const simpleDexService = new SimpleDexService(
        provider || alchemyProvider,
        provider && signer ? signer : undefined
      );

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

        dispatch(
          setInfo({
            ethPerToken: ETH_per_NCT,
            tokenPerEth: NCT_per_ETH,
            lpTokenInCirculation: circulatingLP_inNumber,
            contractNCT: contractNCT_inNumber,
            contractETH: contractETH_inNumber,
          })
        );
      } catch (error) {
        console.error("Failed to fetch contract data:", error);
      }
    };

    fetchData();
  }, [provider, signer, dispatch]);
};

export default useFetchDexData;
