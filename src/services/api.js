import axios from "axios";

const API = axios.create({
 baseURL: "https://glaze-backend-production-ad01.up.railway.app/api"
});

export default API; 