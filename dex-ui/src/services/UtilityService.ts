// dex-ui\src\services\UtilityService.ts
import { ethers } from "ethers";

class UtilityService {
  constructor() {}

  // Convert a BigNumberish value to a float with 18 decimal places
  public convertBigIntToFloat(input: ethers.BigNumberish): number {
    // Convert BigNumberish to string and then parse it to float with 18 decimal places
    return parseFloat(ethers.formatUnits(input, 18));
  }

  // Convert a float to a BigNumberish value with 18 decimal places
  public convertFloatToBigInt(input: number): ethers.BigNumberish {
    // Convert float to string and then parse it to BigNumberish with 18 decimal places
    return ethers.parseUnits(input.toString(), 18);
  }

  // Convert a BigNumberish value to a number
  public convertBigIntToNumber(input: ethers.BigNumberish): number {
    // Convert BigNumberish to number
    return ethers.toNumber(input);
  }

  // Calculate the output amount of tokens for a given input amount using the constant product formula
  public calculateSwapOutputAmount(
    inputAmount: number,
    inputReserve: number,
    outputReserve: number
  ) {
    // Apply a 1% fee on the input amount
    inputAmount *= 0.99;
    // Calculate the output reserve after the swap
    const afterSwapOutputReserve =
      (inputReserve * outputReserve) / (inputAmount + inputReserve);
    // Calculate and return the output amount
    return outputReserve - afterSwapOutputReserve;
  }

  // Calculate the amount of ETH and tokens to be redeemed for a given liquidity amount
  public calculateRedeemOutput(
    liquidityAmount: number,
    liquidityInCirculation: number,
    ethReserve: number,
    tokenReserve: number
  ): { ethAmount: number; tokenAmount: number } {
    // Check for invalid liquidity amount
    if (liquidityAmount < 0) {
      throw new Error("Invalid liquidity amount or total supply");
    }

    // Calculate the amount of ETH to be redeemed
    const ethAmount = (ethReserve * liquidityAmount) / liquidityInCirculation;
    // Calculate the amount of tokens to be redeemed
    const tokenAmount = (tokenReserve * liquidityAmount) / liquidityInCirculation;

    // Return the calculated ETH and token amounts
    return { ethAmount, tokenAmount };
  }
}

// Create and export an instance of the UtilityService class
const utilityService = new UtilityService();
export default utilityService;
