import {
  Box,
  Code,
  Divider,
  Flex,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useSigner } from "../../context/SignerContext";
import { useAppDispatch, useAppSelector } from "../../hooks";
import useFetchDexData from "../../hooks/useFetchDexData";

// Define the props type for CryptoStat component
type CryptoStatPropsType = {
  label: string; // Label to describe the statistic
  number: string | number; // Value of the statistic, can be a number or string
};

// CryptoStat component to display individual statistics
const CryptoStat = ({ label, number }: CryptoStatPropsType) => {
  return (
    <Box
      border={"1px"} // Border style for the stat box
      borderColor={"lavender"} // Border color for the stat box
      borderRadius={"2xl"} // Rounded corners for the stat box
      flex={1} // Flex property to allow the stat box to grow
      py={"10px"} // Padding on the Y-axis
    >
      <Stat>
        <StatLabel>{label}</StatLabel> // Label for the statistic
        <StatNumber>{number}</StatNumber> // Value of the statistic
      </Stat>
    </Box>
  );
};

// Info component to display wallet and DEX information
const Info = () => {
  // Extract DEX-related data from the Redux store
  const { ethPerToken, tokenPerEth, lpTokenInCirculation, contractETH, contractNCT } = useAppSelector(
    (state) => state.info
  );
  
  // Extract wallet-related data from the Redux store
  const { ethBalance, lpTokenBalance, nctBalance, address, network } = useAppSelector((state) => state.metamask);

  // Redux dispatch function for updating application state
  const dispatch = useAppDispatch();
  
  // Access signer and provider from context
  const { signer, provider } = useSigner();

  // Use the custom hook to fetch and update DEX data
  useFetchDexData(provider, signer, dispatch);

  return (
    <Box
      borderRadius={"2xl"} // Rounded corners for the info container
      border={"1px"} // Border style for the info container
      borderColor={"Highlight"} // Border color for the info container
      p={"10px"} // Padding inside the info container
      textAlign={"center"} // Center-align text within the container
      h={"100%"} // Full height of the container
      alignContent={"center"} // Center-align content within the container
    >
      {/* Wallet Information Section */}
      <Heading as={"h2"} my={"10px"} color={"steelblue"}>
        Your Wallet Information
      </Heading>
      <Flex
        flexDir={{
          base: "column", // Stack items vertically on small screens
          md: "row", // Stack items horizontally on medium and larger screens
        }}
        justifyContent={"center"} // Center-align items horizontally
        gap={"10px"} // Gap between items
      >
        {/* Display wallet address */}
        <Code
          my={"10px"} // Margin on the Y-axis
          fontSize={{
            base: "sm", // Smaller font size on small screens
            md: "xl", // Larger font size on medium and larger screens
          }}
        >
          {address}
        </Code>
        {/* Display network name if available */}
        {network && (
          <Code
            colorScheme={"blue"} // Blue color scheme for network code
            my={"10px"} // Margin on the Y-axis
            fontSize={{
              base: "sm", // Smaller font size on small screens
              md: "xl", // Larger font size on medium and larger screens
            }}
          >
            {network}
          </Code>
        )}
      </Flex>
      <Flex
        flexDir={{
          base: "column", // Stack items vertically on small screens
          md: "row", // Stack items horizontally on medium and larger screens
        }}
        justifyContent={"space-around"} // Space out items evenly
        my={"10px"} // Margin on the Y-axis
        gap={"5px"} // Gap between items
      >
        {/* Display individual wallet statistics */}
        <CryptoStat label="ETH in Wallet" number={ethBalance} />
        <CryptoStat label="NCT in Wallet" number={nctBalance} />
        <CryptoStat label="SDT LP Tokens in Wallet" number={lpTokenBalance} />
      </Flex>

      <Divider my={"10px"} /> {/* Divider between sections */}

      {/* DEX Information Section */}
      <Heading as={"h2"} my={"10px"} color={"steelblue"}>
        DEX Information
      </Heading>
      <Flex
        flexDir={{
          base: "column", // Stack items vertically on small screens
          md: "row", // Stack items horizontally on medium and larger screens
        }}
        justifyContent={"space-around"} // Space out items evenly
        my={"10px"} // Margin on the Y-axis
        gap={"5px"} // Gap between items
      >
        {/* Display individual DEX statistics */}
        <CryptoStat label="ETH in Contract" number={contractETH} />
        <CryptoStat label="NCT in Contract" number={contractNCT} />
        <CryptoStat label="ETH per NCT" number={ethPerToken} />
        <CryptoStat label="NCT per ETH" number={tokenPerEth} />
        <CryptoStat
          label="SDT LP Tokens in circulation"
          number={lpTokenInCirculation}
        />
      </Flex>
    </Box>
  );
};

export default Info;
