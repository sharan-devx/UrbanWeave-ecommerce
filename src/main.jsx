import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./Components/Context/CartProvider.jsx";
import { LoginProvider } from "./Components/Context/LoginProvider.jsx";

createRoot(document.getElementById("root")).render(
  <LoginProvider>
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </LoginProvider>
);
