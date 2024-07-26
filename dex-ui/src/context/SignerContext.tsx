import React, { createContext, ReactNode, useContext, useState } from "react";
import { ethers } from "ethers";

interface SignerContextType {
  signer: ethers.Signer | null;
  provider: ethers.BrowserProvider | null;
  setSigner: (signer: ethers.Signer) => void;
  setProvider: (provider: ethers.BrowserProvider) => void;
}

const SignerContext = createContext<SignerContextType | undefined>(undefined);

export const useSigner = () => {
  const context = useContext(SignerContext);
  if (!context) {
    throw new Error("useSigner must be used within a SignerProvider");
  }
  return context;
};
interface SignerProviderProps {
  children: ReactNode;
}
export const SignerProvider: React.FC<SignerProviderProps> = ({ children }) => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  return (
    <SignerContext.Provider
      value={{ signer, provider, setSigner, setProvider }}
    >
      {children}
    </SignerContext.Provider>
  );
};
