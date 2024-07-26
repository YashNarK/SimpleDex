import { useEffect } from "react";
import { ethers } from "ethers";
import { setAddress, setBalances, setNetwork } from "../features/metamask/metamaskSlice";
import utilityService from "../services/UtilityService";
import useCustomToast from "../hooks/useCustomToast";
import { NCT_CONTRACT_ADDRESS, NCT_CONTRACT_ABI, SIMPLE_DEX_ADDRESS, SIMPLE_DEX_ABI } from "../blockchainData/blockchainData";
import { AppDispatch } from "../store";

const useFetchMetaMaskData = (signer:ethers.Signer|null, provider:ethers.BrowserProvider|null, dispatch:AppDispatch) => {
  const toast = useCustomToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!signer || !provider) return;

      try {
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        const ethBalance = utilityService.convertBigIntToFloat(balance);
        const networkObject = await provider.getNetwork();
        const network = `${networkObject.name} (${networkObject.chainId})`;

        const nctContract = new ethers.Contract(
          NCT_CONTRACT_ADDRESS,
          NCT_CONTRACT_ABI,
          signer
        );
        const nctBalanceBigNumber = await nctContract.balanceOf(address);
        const nctBalance = utilityService.convertBigIntToFloat(nctBalanceBigNumber);

        const simpleDexContract = new ethers.Contract(
          SIMPLE_DEX_ADDRESS,
          SIMPLE_DEX_ABI,
          signer
        );
        const lpTokenBalanceBigNumber = await simpleDexContract.balanceOf(address);
        const lpTokenBalance = utilityService.convertBigIntToFloat(lpTokenBalanceBigNumber);

        dispatch(setAddress({ address }));
        dispatch(setBalances({
          ethBalance,
          nctBalance,
          lpTokenBalance,
        }));
        dispatch(setNetwork({ network }));

        toast({
          status: "success",
          title: "Connected",
          description: `Connected to MetaMask: ${address}`,
        });
      } catch (err) {
        if (err instanceof Error) {
          toast({
            status: "error",
            title: "Error",
            description: err.message,
          });
        } else {
          toast({
            status: "error",
            title: "Unknown Error",
            description: "An unknown error occurred.",
          });
        }
      }
    };

    fetchData();
  }, [signer, provider, dispatch, toast]);
};

export default useFetchMetaMaskData;
