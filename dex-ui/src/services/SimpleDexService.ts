// dex-ui\src\services\SimpleDexService.ts

import { ethers } from "ethers";
import {
  SIMPLE_DEX_ABI,
  SIMPLE_DEX_ADDRESS,
  NCT_CONTRACT_ADDRESS,
  NCT_CONTRACT_ABI,
} from "../blockchainData/blockchainData";

class SimpleDexService {
  private provider: ethers.Provider | ethers.BrowserProvider;
  private signer?: ethers.Signer;
  private simpleDEXContract!: ethers.Contract;
  private tokenContract!: ethers.Contract;

  constructor(
    provider: ethers.Provider | ethers.BrowserProvider,
    signer?: ethers.Signer
  ) {
    this.provider = provider;
    this.signer = signer;
    // Initially Read Only access is enough to display some data to users regarding the DEX
    this.simpleDEXContract = new ethers.Contract(
      SIMPLE_DEX_ADDRESS,
      SIMPLE_DEX_ABI,
      this.signer || this.provider
    );
    this.tokenContract = new ethers.Contract(
      NCT_CONTRACT_ADDRESS,
      NCT_CONTRACT_ABI,
      this.signer || this.provider
    );
  }

  // STATE CHANGE SERVICES

  // Add liquidity to the contract
  async addLiquidity(
    tokenAmount: ethers.BigNumberish,
    ethAmount: ethers.BigNumberish
  ): Promise<ethers.TransactionResponse> {
    // Estimate gas for approve transaction

    const approveTx = await this.tokenContract.approve(
      SIMPLE_DEX_ADDRESS,
      tokenAmount
    );
    await approveTx.wait();
    return this.simpleDEXContract.addLiquidity(tokenAmount, {
      value: ethAmount,
    });
  }

  // Remove liquidity from the contract
  async removeLiquidity(
    liquidityAmount: ethers.BigNumberish
  ): Promise<ethers.TransactionResponse> {
    return this.simpleDEXContract.removeLiquidity(liquidityAmount);
  }

  // Swap ETH for tokens
  async swapEthToToken(
    ethAmount: ethers.BigNumberish
  ): Promise<ethers.TransactionResponse> {
    return this.simpleDEXContract.swapEthToToken({ value: ethAmount });
  }

  // Swap tokens for ETH
  async swapTokenToEth(
    tokenAmount: ethers.BigNumberish
  ): Promise<ethers.TransactionResponse> {
    const approveTx = await this.tokenContract.approve(
      SIMPLE_DEX_ADDRESS,
      tokenAmount
    );
    await approveTx.wait();
    return this.simpleDEXContract.swapTokenToEth(tokenAmount);
  }

  // Get the amount of output tokens for a given input amount
  async getAmountOfTokens(
    inputAmount: ethers.BigNumberish,
    inputReserve: ethers.BigNumberish,
    outputReserve: ethers.BigNumberish
  ): Promise<ethers.BigNumberish> {
    return this.simpleDEXContract.getAmountOfTokens(
      inputAmount,
      inputReserve,
      outputReserve
    );
  }

  // READ ONLY SERVICES

  // Get the number of tokens held by the contract
  async getTokensInContract(): Promise<ethers.BigNumberish> {
    return this.simpleDEXContract.getTokensInContract();
  }

  // Get the number of ETH held by the contract
  async getETHsInContract(): Promise<ethers.BigNumberish> {
    return this.simpleDEXContract.getETHsInContract();
  }

  // Get the owner of the contract
  async getOwner(): Promise<string> {
    return await this.simpleDEXContract.owner();
  }

  // Get the symbol of the token
  async getSymbol(): Promise<string> {
    return await this.simpleDEXContract.symbol();
  }

  // Get the name of the token
  async getName(): Promise<string> {
    return await this.simpleDEXContract.name();
  }

  // Get the total supply of the token
  async getTotalSupply(): Promise<ethers.BigNumberish> {
    return await this.simpleDEXContract.totalSupply();
  }

  // Get the decimals of the token
  async getDecimals(): Promise<number> {
    return await this.simpleDEXContract.decimals();
  }

  // NON CONTRACT OR GENERAL BLOCKCHAIN SERVICES
  async waitForTransaction(hash: string) {
    let result = false;
    try {
      const receipt = await this.provider.waitForTransaction(hash);
      if (receipt && receipt.status === 1) {
        result = true;
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err) {
      console.error("Error waiting for transaction:", err);
      throw err;
    } finally {
      return result;
    }
  }
}
export default SimpleDexService;
