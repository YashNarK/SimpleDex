import { ethers } from "ethers";

class UtilityService {
  constructor() {}
  public convertBigIntToFloat(input: ethers.BigNumberish): number {
    return parseFloat(ethers.formatUnits(input, 18));
  }
  public convertFloatToBigInt(input: number): ethers.BigNumberish {
    return ethers.parseUnits(input.toString(), 18);
  }
  public convertBigIntToNumber(input: ethers.BigNumberish): number {
    return ethers.toNumber(input);
  }
  public calculateSwapOutputAmount(
    inputAmount: number,
    inputReserve: number,
    outputReserve: number
  ) {
    inputAmount *= 0.99;
    const afterSwapoutputReserve =
      (inputReserve * outputReserve) / (inputAmount + inputReserve);
    return outputReserve - afterSwapoutputReserve;
  }

  public calculateRedeemOutput(
    liquidityAmount: number,
    liquidityInCirculation: number,
    ethReserve: number,
    tokenReserve: number
  ): { ethAmount: number; tokenAmount: number } {
    if (liquidityAmount < 0 ) {
      throw new Error("Invalid liquidity amount or total supply");
    }

    // Calculate ETH and Token amounts
    const ethAmount = (ethReserve * liquidityAmount) / liquidityInCirculation;
    const tokenAmount = (tokenReserve * liquidityAmount) / liquidityInCirculation;

    return { ethAmount, tokenAmount };
  }
}

const utilityService = new UtilityService();
export default utilityService;
