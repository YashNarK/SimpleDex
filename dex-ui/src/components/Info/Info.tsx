// dex-ui/src/components/Info/Info.tsx
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
  label: string;
  number: string | number;
};

// CryptoStat component to display individual statistics
const CryptoStat = ({ label, number }: CryptoStatPropsType) => {
  return (
    <Box
      border={"1px"}
      borderColor={"lavender"}
      borderRadius={"2xl"}
      flex={1}
      py={"10px"}
    >
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber>{number}</StatNumber>
      </Stat>
    </Box>
  );
};

// Info component to display wallet and DEX information
const Info = () => {
  const { ethPerToken, tokenPerEth, lpTokenInCirculation, contractETH,contractNCT } = useAppSelector(
    (state) => state.info
  );
  const { ethBalance, lpTokenBalance, nctBalance, address, network } =
    useAppSelector((state) => state.metamask);

  const dispatch = useAppDispatch();
  const { signer, provider } = useSigner();


  // Use the custom hook here
  useFetchDexData(provider, signer, dispatch);
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
      {/* Wallet Information */}
      <Heading as={"h2"} my={"10px"} color={"steelblue"}>
        Your Wallet Information
      </Heading>
      <Flex
        flexDir={{
          base: "column",
          md: "row",
        }}
        justifyContent={"center"}
        gap={"10px"}
      >
        {" "}
        <Code
          my={"10px"}
          fontSize={{
            base: "sm",
            md: "xl",
          }}
        >
          {address}
        </Code>
        {network && (
          <Code
            colorScheme={"blue"}
            my={"10px"}
            fontSize={{
              base: "sm",
              md: "xl",
            }}
          >
            {network}
          </Code>
        )}
      </Flex>
      <Flex
        flexDir={{
          base: "column",
          md: "row",
        }}
        justifyContent={"space-around"}
        my={"10px"}
        gap={"5px"}
      >
        <CryptoStat label="ETH in Wallet" number={ethBalance} />
        <CryptoStat label="NCT in Wallet" number={nctBalance} />
        <CryptoStat label="SDT LP Tokens in Wallet" number={lpTokenBalance} />
      </Flex>

      <Divider my={"10px"} />

      {/* DEX Information */}
      <Heading as={"h2"} my={"10px"} color={"steelblue"}>
        DEX Information
      </Heading>
      <Flex
        flexDir={{
          base: "column",
          md: "row",
        }}
        justifyContent={"space-around"}
        my={"10px"}
        gap={"5px"}
      >
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
