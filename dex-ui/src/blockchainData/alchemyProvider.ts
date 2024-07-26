// dex-ui\src\blockchainData\alchemyProvider.ts

import { ethers } from "ethers";

const ALCHEMY_URL = `https://eth-sepolia.g.alchemy.com/v2/Pl6KGMMMQQNTAs4Fz_CqxcNpcP6_DQ-U`;

const alchemyProvider = new ethers.JsonRpcProvider(ALCHEMY_URL);

export default alchemyProvider;
