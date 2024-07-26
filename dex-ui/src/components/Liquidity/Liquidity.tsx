import { Box, Button, Divider } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useSigner } from "../../context/SignerContext";
import {
  resetLiquidityInput,
  setLiquidityInput,
} from "../../features/liquidity/liquidityInputSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import useCustomToast from "../../hooks/useCustomToast";
import {
  refreshDexData,
  refreshMetaMaskData,
} from "../../services/refreshData";
import SimpleDexService from "../../services/SimpleDexService";
import utilityService from "../../services/UtilityService";
import CryptoInput from "../shared/CryptoInput";
import { useState } from "react";

const Liquidity = () => {
  // hooks
  const { lpTokenBalance, ethBalance, nctBalance } = useAppSelector(
    (s) => s.metamask
  );
  const { ethAmount, nctAmount, lpTokenAmount } = useAppSelector(
    (s) => s.liquidity
  );
  const { contractETH, contractNCT, lpTokenInCirculation } = useAppSelector(
    (s) => s.info
  );

  const dispatch = useAppDispatch();
  const toast = useCustomToast();

  const [expectedETH, setExpectedETH] = useState(0);
  const [expectedNCT, setExpectedNCT] = useState(0);

  const { signer, provider } = useSigner();

  // helpers

  const onAddLiquidity = () => {
    let error: string = "";
    let description = "";
    if (ethAmount == 0) {
      error = "ETH Amount must be greater than 0";
    } else if (nctAmount == 0) {
      error = "NCT Amount must be greater than 0";
    }
    else if (lpTokenInCirculation) {
      const requiredAmount = (ethAmount * contractNCT) / contractETH;

      if (nctAmount <= requiredAmount) {
        error = `The NCT input amount must be greater than ${requiredAmount} for the provided ETH value of ${ethAmount}`;
        description =
          "Amount of tokens sent is less than the minimum tokens required";
      }
    }

    const ethInBigInt = utilityService.convertFloatToBigInt(ethAmount);
    const nctInBigInt = utilityService.convertFloatToBigInt(nctAmount);
    if (!error)
      if (provider && signer) {
        const simpleDexService = new SimpleDexService(provider, signer);
        deposit(simpleDexService, ethInBigInt, nctInBigInt);
      } else {
        error: "Connect your metamask Wallet first";
      }

    if (error)
      toast({
        title: error,
        status: "error",
        description,
      });
  };

  const deposit = async (
    simpleDexService: SimpleDexService,
    eth: ethers.BigNumberish,
    nct: ethers.BigNumberish
  ) => {
    try {
      const resp = await simpleDexService.addLiquidity(nct, eth);

      toast({
        title: "Transaction submitted. Awaiting confirmation...",
        description: `Transaction hash: ${resp.hash}`,
        status: "info",
        duration: 5000,
      });

      // AWAIT TX CONFIRMATION BEFORE DATA REFRESH
      const TxConfirm = await resp.wait();
      if (provider && signer && TxConfirm) {
        await refreshDexData(provider, signer, dispatch);
        await refreshMetaMaskData(provider, signer, dispatch);
        dispatch(resetLiquidityInput());

        toast({ title: "Successfully added liquidity", status: "success" });
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        toast({ title: err.message, status: "error" });
      } else {
        console.error(err);
        toast({
          title: "An unknown error occured",
          status: "error",
        });
      }
    }
  };

  const onRedeem = async () => {
    let error = "";
    if (lpTokenAmount == 0) error = "LP Token value must be greater than 0";
    else if (lpTokenInCirculation == 0) error = "No LP Token issued yet";

    if (error) toast({ title: error, status: "error" });

    const simpleDexService =
      provider && signer && new SimpleDexService(provider, signer);

    const resp = await simpleDexService?.removeLiquidity(
      utilityService.convertFloatToBigInt(lpTokenAmount)
    );
    toast({
      title: `Redeem request is submitted...`,
      status: "info",
      duration: 5000,
      description: `Transaction hash:${resp?.hash}`,
    });
    const TxConfirm = await resp?.wait();
    if (TxConfirm && provider && signer) {
      await refreshDexData(provider, signer, dispatch);
      await refreshMetaMaskData(provider, signer, dispatch);
      dispatch(resetLiquidityInput());
      setExpectedETH(0);
      setExpectedNCT(0);
      toast({ title: "Successfully Redeemed", status: "success" });
    }
  };

  return (
    <Box
      borderRadius={"2xl"}
      border={"1px"}
      borderColor={"Highlight"}
      p={"10px"}
      textAlign={"center"}
      h={"100%"}
      alignContent={"center"}
    >
      <Box my={"10px"} textAlign={"center"}>
        <CryptoInput
          label="ETH (amount)"
          placeholder="ETH (amount)"
          value={ethAmount}
          onValueChange={(valueAsString) => {
            dispatch(
              setLiquidityInput({ ethAmount: parseFloat(valueAsString) })
            );
          }}
        />
        <CryptoInput
          label="NCT (amount)"
          placeholder="NCT (amount)"
          precision={3}
          step={1}
          value={nctAmount}
          onValueChange={(valueAsString) => {
            dispatch(
              setLiquidityInput({ nctAmount: parseFloat(valueAsString) })
            );
          }}
        />
        <Button
          colorScheme="green"
          isDisabled={ethBalance == 0 || nctBalance == 0}
          onClick={onAddLiquidity}
        >
          Add Liquidity / Deposit
        </Button>
      </Box>
      <Divider />
      <Box my={"10px"} textAlign={"center"}>
        <CryptoInput
          label="SDT LP Token (amount)"
          placeholder="SDT LP Token (amount)"
          precision={8}
          step={0.01}
          value={lpTokenAmount}
          max={lpTokenBalance}
          onValueChange={(valueAsString) => {
            dispatch(
              setLiquidityInput({ lpTokenAmount: parseFloat(valueAsString) })
            );
            const { ethAmount, tokenAmount } =
              utilityService.calculateRedeemOutput(
                parseFloat(valueAsString),
                lpTokenInCirculation,
                contractETH,
                contractNCT
              );
            setExpectedETH(ethAmount);
            setExpectedNCT(tokenAmount);
          }}
        />
        <Box my={"5px"} fontSize={"large"}>
          <p>Expected Redeem Value:</p>
          <p>{expectedETH} ETH</p>
          <p>{expectedNCT} NCT</p>
        </Box>

        <Button
          colorScheme="red"
          isDisabled={lpTokenBalance == 0}
          onClick={onRedeem}
        >
          Remove Liquidity / Redeem
        </Button>
      </Box>
    </Box>
  );
};

export default Liquidity;
