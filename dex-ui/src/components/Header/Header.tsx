import { Box, Button, Icon } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { SiWalletconnect } from "react-icons/si";
import { useSigner } from "../../context/SignerContext";
import { useAppDispatch } from "../../hooks";
import useCustomToast from "../../hooks/useCustomToast";
import useFetchMetaMaskData from "../../hooks/useFetchMetaMaskData";
import styles from "./Header.module.css";

const Header = () => {
  const [error, setError] = useState<string>("");
  const dispatch = useAppDispatch();
  const toast = useCustomToast();
  const { signer, provider, setSigner, setProvider } = useSigner();

  // Use the custom hook here
  useFetchMetaMaskData(signer, provider, dispatch);

  const onWalletConnect = async () => {
    try {
      if (!window.ethereum) {
        const errorMessage = "Metamask is not installed";
        setError(errorMessage);
        toast({
          status: "error",
          title: error,
        });
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signerObject = await provider.getSigner();
      setProvider(provider);
      setSigner(signerObject);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          status: "error",
          title: "Connection Error",
          description: err.message,
        });
      } else {
        setError("An unknown error occurred.");
        toast({
          status: "error",
          title: "Unknown Error",
          description: "An unknown error occurred.",
        });
      }
      console.error("Error connecting to MetaMask", err);
    }
  };

  return (
    <Box
      w={"100%"}
      textColor={"slategray"}
      fontSize={"large"}
      fontWeight={"bold"}
      textAlign={"center"}
      fontFamily={"cursive"}
    >
      <p>
        {" "}
        Simple DEX -{" "}
        <span className={styles.italicsText}>
          A Decentralized Exchange for Sepolia network
        </span>
      </p>
      {!signer && !provider &&
        <Box my={"10px"}>
          <Button colorScheme="yellow" onClick={onWalletConnect}>
            <Icon as={SiWalletconnect} fontSize={"large"} m={"5px"} />
            Connect Metamask
          </Button>
        </Box>
      }
    </Box>
  );
};

export default Header;
