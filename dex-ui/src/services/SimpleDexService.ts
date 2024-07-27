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
    // Set the provider for interacting with the blockchain
    this.provider = provider;
    // Optional signer for executing transactions that require authorization
    this.signer = signer;
    // Initialize the DEX contract instance with the provided ABI and address
    // Use signer if available for transactions, otherwise use provider for read-only operations
    this.simpleDEXContract = new ethers.Contract(
      SIMPLE_DEX_ADDRESS,
      SIMPLE_DEX_ABI,
      this.signer || this.provider
    );
    // Initialize the token contract instance with the provided ABI and address
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
    // Approve the DEX contract to transfer the specified token amount on behalf of the user
    const approveTx = await this.tokenContract.approve(
      SIMPLE_DEX_ADDRESS,
      tokenAmount
    );
    // Wait for the approval transaction to be mined
    await approveTx.wait();
    // Call the addLiquidity function on the DEX contract with the specified token and ETH amounts
    return this.simpleDEXContract.addLiquidity(tokenAmount, {
      value: ethAmount,
    });
  }

  // Remove liquidity from the contract
  async removeLiquidity(
    liquidityAmount: ethers.BigNumberish
  ): Promise<ethers.TransactionResponse> {
    // Call the removeLiquidity function on the DEX contract with the specified liquidity amount
    return this.simpleDEXContract.removeLiquidity(liquidityAmount);
  }

  // Swap ETH for tokens
  async swapEthToToken(
    ethAmount: ethers.BigNumberish
  ): Promise<ethers.TransactionResponse> {
    // Call the swapEthToToken function on the DEX contract with the specified ETH amount
    return this.simpleDEXContract.swapEthToToken({ value: ethAmount });
  }

  // Swap tokens for ETH
  async swapTokenToEth(
    tokenAmount: ethers.BigNumberish
  ): Promise<ethers.TransactionResponse> {
    // Approve the DEX contract to transfer the specified token amount on behalf of the user
    const approveTx = await this.tokenContract.approve(
      SIMPLE_DEX_ADDRESS,
      tokenAmount
    );
    // Wait for the approval transaction to be mined
    await approveTx.wait();
    // Call the swapTokenToEth function on the DEX contract with the specified token amount
    return this.simpleDEXContract.swapTokenToEth(tokenAmount);
  }

  // Get the amount of output tokens for a given input amount
  async getAmountOfTokens(
    inputAmount: ethers.BigNumberish,
    inputReserve: ethers.BigNumberish,
    outputReserve: ethers.BigNumberish
  ): Promise<ethers.BigNumberish> {
    // Call the getAmountOfTokens function on the DEX contract with the specified input amount, input reserve, and output reserve
    return this.simpleDEXContract.getAmountOfTokens(
      inputAmount,
      inputReserve,
      outputReserve
    );
  }

  // READ ONLY SERVICES

  // Get the number of tokens held by the contract
  async getTokensInContract(): Promise<ethers.BigNumberish> {
    // Call the getTokensInContract function on the DEX contract
    return this.simpleDEXContract.getTokensInContract();
  }

  // Get the number of ETH held by the contract
  async getETHsInContract(): Promise<ethers.BigNumberish> {
    // Call the getETHsInContract function on the DEX contract
    return this.simpleDEXContract.getETHsInContract();
  }

  // Get the owner of the contract
  async getOwner(): Promise<string> {
    // Call the owner function on the DEX contract
    return await this.simpleDEXContract.owner();
  }

  // Get the symbol of the token
  async getSymbol(): Promise<string> {
    // Call the symbol function on the token contract
    return await this.simpleDEXContract.symbol();
  }

  // Get the name of the token
  async getName(): Promise<string> {
    // Call the name function on the token contract
    return await this.simpleDEXContract.name();
  }

  // Get the total supply of the token
  async getTotalSupply(): Promise<ethers.BigNumberish> {
    // Call the totalSupply function on the DEX contract
    return await this.simpleDEXContract.totalSupply();
  }

  // Get the decimals of the token
  async getDecimals(): Promise<number> {
    // Call the decimals function on the token contract
    return await this.simpleDEXContract.decimals();
  }

  // NON CONTRACT OR GENERAL BLOCKCHAIN SERVICES

  // Wait for a transaction to be mined and check its status
  async waitForTransaction(hash: string) {
    let result = false;
    try {
      // Wait for the transaction with the specified hash to be mined
      const receipt = await this.provider.waitForTransaction(hash);
      // Check the status of the transaction receipt
      if (receipt && receipt.status === 1) {
        result = true;
      } else {
        // Throw an error if the transaction failed
        throw new Error("Transaction failed");
      }
    } catch (err) {
      // Log and rethrow any errors that occur while waiting for the transaction
      console.error("Error waiting for transaction:", err);
      throw err;
    } finally {
      // Return the result indicating whether the transaction succeeded
      return result;
    }
  }
}

export default SimpleDexService;
