import { Box, Button, Icon, Select } from "@chakra-ui/react";
import { RiTokenSwapFill } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useSigner } from "../../context/SignerContext";
import { useState } from "react";
import CryptoInput from "../shared/CryptoInput";
import {
  resetSwapInput,
  setSwapInput,
} from "../../features/swap/swapInputSlice";
import SimpleDexService from "../../services/SimpleDexService";
import utilityService from "../../services/UtilityService";
import {
  refreshDexData,
  refreshMetaMaskData,
} from "../../services/refreshData";
import useCustomToast from "../../hooks/useCustomToast";

const Swap = () => {
  // Access Redux state related to wallet and DEX information
  const { ethBalance, nctBalance } = useAppSelector((s) => s.metamask);
  const { ethPerToken, tokenPerEth, contractETH, contractNCT } = useAppSelector(
    (s) => s.info
  );
  const { ethAmount, nctAmount } = useAppSelector((s) => s.swap);

  // Manage the current swap mode (ETH to NCT or NCT to ETH)
  const [swapMode, setSwapMode] = useState<"e2n" | "n2e" | "">("");
  const { signer, provider } = useSigner();
  const dispatch = useAppDispatch();
  const [estimatedSwapOutput, setEstimatedSwapOutput] = useState(0);

  // Initialize SimpleDexService if provider and signer are available
  const simpleDexService =
    provider && signer && new SimpleDexService(provider, signer);

  const toast = useCustomToast();

  // Handle the swap action based on the selected mode
  const onSwap = async () => {
    let error = false;
    const swapActions: { [key: string]: () => Promise<void> } = {
      // Swap ETH to NCT
      e2n: async () => {
        if (ethAmount == 0) {
          error = true;
          toast({
            title: "ETH Amount must be greater than 0",
            status: "error",
          });
        } else {
          const resp = await simpleDexService?.swapEthToToken(
            utilityService.convertFloatToBigInt(ethAmount)
          );
          toast({
            title: `Swapping ${ethAmount} ETH for NCT`,
            status: "info",
            duration: 5000,
            description: `Transaction hash:${resp?.hash}`,
          });
          await resp?.wait();
        }
      },
      // Swap NCT to ETH
      n2e: async () => {
        if (nctAmount == 0) {
          error = true;
          toast({
            title: "NCT Amount must be greater than 0",
            status: "error",
          });
        } else {
          const resp = await simpleDexService?.swapTokenToEth(
            utilityService.convertFloatToBigInt(nctAmount)
          );
          toast({
            title: `Swapping ${nctAmount} NCT for ETH`,
            status: "info",
            duration: 5000,
            description: `Transaction hash:${resp?.hash}`,
          });

          await resp?.wait();
        }
      },
    };

    if (swapMode in swapActions) {
      await swapActions[swapMode as keyof typeof swapActions]();
      if (provider && signer && !error) {
        await refreshDexData(provider, signer, dispatch);
        await refreshMetaMaskData(provider, signer, dispatch);
        dispatch(resetSwapInput());
        setEstimatedSwapOutput(0);
        toast({
          title: "Transaction Completed Successfully",
          status: "success",
        });
      }
    }
  };

  // Render component
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
      {/* Swap Button */}
      <Button
        onClick={onSwap}
        isDisabled={
          !Boolean(signer) || ethPerToken == "NA" || tokenPerEth == "NA"
        }
        colorScheme="blue"
      >
        <Icon as={RiTokenSwapFill} fontSize={"large"} m={"5px"} /> Swap
      </Button>
      {/* Select Crypto Pair */}
      <Box
        mx={"auto"}
        my={"10px"}
        w={{
          base: "100%",
          md: "50%",
        }}
      >
        <Select
          placeholder="Select Crypto pair"
          value={swapMode || ""}
          onChange={(e) => {
            const selectedValue = e.target.value as "e2n" | "n2e" | "";
            setSwapMode(selectedValue);
            setEstimatedSwapOutput(0);
            dispatch(resetSwapInput());
          }}
        >
          {/* Option to swap ETH to NCT */}
          <option disabled={ethBalance == 0} value="e2n">
            ETH to NCT
          </option>
          {/* Option to swap NCT to ETH */}
          <option disabled={nctBalance == 0} value="n2e">
            NCT to ETH
          </option>
        </Select>
      </Box>
      {/* Input fields and estimated output */}
      {swapMode && swapMode == "n2e" && (
        <CryptoInput
          label="NCT Amount"
          placeholder="NCT Amount"
          precision={3}
          step={1}
          value={nctAmount}
          onValueChange={(valueAsString) => {
            dispatch(setSwapInput({ nctAmount: parseFloat(valueAsString) }));
            // Calculate estimated output for NCT to ETH swap
            const estimation = utilityService.calculateSwapOutputAmount(
              parseFloat(valueAsString),
              contractNCT,
              contractETH
            );
            setEstimatedSwapOutput(estimation);
          }}
        />
      )}
      {swapMode && swapMode == "e2n" && (
        <CryptoInput
          label="ETH Amount"
          placeholder="ETH Amount"
          value={ethAmount}
          onValueChange={(valueAsString) => {
            dispatch(setSwapInput({ ethAmount: parseFloat(valueAsString) }));
            // Calculate estimated output for ETH to NCT swap
            const estimation = utilityService.calculateSwapOutputAmount(
              parseFloat(valueAsString),
              contractETH,
              contractNCT
            );
            setEstimatedSwapOutput(estimation);
          }}
        />
      )}
      {/* Display estimated output */}
      {swapMode && (
        <Box>
          Estimated Output:{" "}
          {isNaN(estimatedSwapOutput) ? 0 : estimatedSwapOutput}
        </Box>
      )}
    </Box>
  );
};

export default Swap;
