import axios from "axios";

const api = axios.create({
    baseURL: "https://urbanweave-api.onrender.com",
});

export default api;
