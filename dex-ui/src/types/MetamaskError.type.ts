// dex-ui\src\types\MetamaskError.type.ts
// Define a type for MetaMask-related errors
type MetaMaskError = {
  // Numeric error code specific to MetaMask errors
  code: number;

  // Descriptive message providing details about the error
  message: string;

  // Optional field for additional data related to the error, if any
  data?: unknown;
};

export default MetaMaskError;
