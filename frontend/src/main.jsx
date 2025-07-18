import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import StoreContextProvider from "./context/StoreContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SmoothScrolling from "./hooks/useLenis.jsx";

const GOOGLE_CLIENT_ID =
  "1042421159074-1n7lefpku8ful3jqceqd7hgmham2hs1h.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <StoreContextProvider>
        {/* <SmoothScrolling> */}
        <App />
        {/* </SmoothScrolling> */}
      </StoreContextProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
