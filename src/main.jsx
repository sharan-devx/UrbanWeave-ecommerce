import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom";
import { CartProvider } from "./Components/Context/CartProvider.jsx";
import { LoginProvider } from "./Components/Context/LoginProvider.jsx";

createRoot(document.getElementById("root")).render(
  <LoginProvider>
    <CartProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </CartProvider>
  </LoginProvider>
);
