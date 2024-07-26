import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "./store.ts";
import { SignerProvider } from "./context/SignerContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <ChakraProvider>
        <SignerProvider>
          <App />
        </SignerProvider>
      </ChakraProvider>
    </Provider>
);
