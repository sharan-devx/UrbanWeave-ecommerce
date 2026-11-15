import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./App.css";
import "./Components/Store/store.css";
import Header from "./Components/Header";
import Routing from "./Components/Routing";
import Footer from "./Components/Footer";
import { WishlistProvider } from "./Components/Store/WishlistProvider";
import { StoreToastProvider } from "./Components/Store/StoreToastProvider";

function App() {
    return (
        <WishlistProvider>
            <StoreToastProvider>
                <Header />
                <Routing />
                <Footer />
            </StoreToastProvider>
        </WishlistProvider>
    );
}

export default App;
