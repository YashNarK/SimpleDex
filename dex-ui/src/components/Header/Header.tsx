// dex-ui\src\components\Header\Header.tsx
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { FaFileContract } from "react-icons/fa";
import { MdOutlineGeneratingTokens } from "react-icons/md";
import { SiGithub, SiWalletconnect } from "react-icons/si";
import { useSigner } from "../../context/SignerContext";
import { useAppDispatch } from "../../hooks";
import useCustomToast from "../../hooks/useCustomToast";
import useFetchMetaMaskData from "../../hooks/useFetchMetaMaskData";
import MetaMaskError from "../../types/MetamaskError.type";
import styles from "./Header.module.css";

const Header = () => {
  // State to hold error messages
  const [error, setError] = useState<string>("");
  // Redux dispatch function for updating application state
  const dispatch = useAppDispatch();
  // Custom toast hook for displaying notifications
  const toast = useCustomToast();
  // Context hooks for accessing signer and provider
  const { signer, provider, setSigner, setProvider } = useSigner();

  // Custom hook to fetch MetaMask data and update Redux store
  useFetchMetaMaskData(signer, provider, dispatch);

  // Handler function for connecting the wallet
  const onWalletConnect = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        const errorMessage = "Metamask is not installed";
        setError(errorMessage);
        toast({
          status: "error",
          title: error,
        });
        return;
      }

      // Request MetaMask to connect to the user's accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Define Sepolia network configuration
      const sepoliaNetwork = {
        chainId: "0xaa36a7", // Hexadecimal chain ID for Sepolia
        chainName: "Sepolia Test Network",
        nativeCurrency: {
          name: "SepoliaETH",
          symbol: "SepoliaETH",
          decimals: 18,
        },
        rpcUrls: ["https://sepolia.infura.io/v3/"],
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
      };

      // Attempt to switch to the Sepolia network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: sepoliaNetwork.chainId }],
        });
        toast({
          status: "success",
          title: "Successfully Connected to Sepolia Network",
        });
      } catch (switchError) {
        const error = switchError as MetaMaskError;
        // Handle case where Sepolia network is not added to MetaMask
        if (error.code === 4902) {
          try {
            // Add Sepolia network to MetaMask
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [sepoliaNetwork],
            });
          } catch (addError) {
            const addErrorTyped = addError as MetaMaskError;
            // Handle errors when adding the network
            console.error("Error adding Sepolia network", addErrorTyped);
            setError(addErrorTyped.message);
            toast({
              status: "error",
              title: "Network Error",
              description: addErrorTyped.message,
            });
            return;
          }
        } else {
          // Handle other errors that occur while switching networks
          console.error("Error switching to Sepolia network", error);
          setError(error.message);
          toast({
            status: "error",
            title: "Network Error",
            description: error.message,
          });
          return;
        }
      }

      // Create a new provider instance for interacting with the Ethereum network
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Get the signer object from the provider
      const signerObject = await provider.getSigner();
      // Update context with the new provider and signer
      setProvider(provider);
      setSigner(signerObject);
    } catch (err) {
      // Handle errors during wallet connection
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
    <Box w={"100%"}>
      {/* HEADER SECTION */}
      <Box
        textColor={"slategray"}
        fontSize={"large"}
        fontWeight={"bold"}
        fontFamily={"cursive"}
        textAlign={"center"}
      >
        <p>
          {" "}
          Simple DEX -{" "}
          <span className={styles.italicsText}>
            A Decentralized Exchange for Sepolia network
          </span>
        </p>
      </Box>

      {/* CONNECT WALLET BUTTON */}
      {!signer && !provider && (
        <Box my={"10px"} textAlign={"center"}>
          <Button
            leftIcon={<SiWalletconnect />}
            colorScheme="yellow"
            onClick={onWalletConnect}
          >
            Connect Metamask
          </Button>
        </Box>
      )}

      {/* SOURCE CODE AND CONTRACT LINKS */}
      <Flex gap={2} flexDir={{base:"column", md:"row"}} justifyContent={"start"}>
        <Button
          variant={"outline"}
          as={Link}
          href="https://github.com/YashNarK/SimpleDex"
          isExternal
          leftIcon={<SiGithub />}
          colorScheme="cyan"
          _hover={{ textDecoration: "none" }}
        >
          Source Code
        </Button>
        <Button
          variant={"outline"}
          as={Link}
          href="https://sepolia.etherscan.io/token/0x94a3ea97513d12F7f123325B82cC1952B1Df137f"
          isExternal
          leftIcon={<MdOutlineGeneratingTokens />}
          colorScheme="teal"
          _hover={{ textDecoration: "none" }}
        >
          NCT Token Contract
        </Button>
        <Button
          variant={"outline"}
          as={Link}
          href="https://sepolia.etherscan.io/address/0x1C547bC1771165cE5cd60139D93CfE0a063637Bf"
          isExternal
          leftIcon={<FaFileContract />}
          colorScheme="blue"
          _hover={{ textDecoration: "none" }}
        >
          DEX Smart Contract
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;
