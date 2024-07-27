// src/global.d.ts

// Importing Eip1193Provider from ethers library
import { Eip1193Provider } from "ethers"

// Declaring global types to extend the Window interface
declare global {
    // Extending the Window interface to include `ethereum` property
    interface Window {
        // `ethereum` is an instance of Eip1193Provider, which is an interface for Ethereum provider
        ethereum: Eip1193Provider
    }
}

// Note: The `Eip1193Provider` interface typically represents an Ethereum provider object,
// such as MetaMask, which allows web applications to interact with the Ethereum blockchain.
// By extending the Window interface, we can safely access `window.ethereum` throughout
// the application without TypeScript errors.
