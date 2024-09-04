import axios from "axios";

const axiosInstance = () => {
    return axios.create({
        baseURL: process.env.NODE_ENV == "development" ? "http://localhost:3000" : process.env.NEXTAUTH_URL
    })
}

export default axiosInstance