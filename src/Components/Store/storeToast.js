import { createContext, useContext } from "react";

export const StoreToastContext = createContext(() => {});

// const toast = useStoreToast(); toast("Saved"); toast("Failed", "danger");
export const useStoreToast = () => useContext(StoreToastContext);
