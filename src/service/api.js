const BASE_URL = "http://localhost:8080"

const API_PATH = {
    AUTH:{
        LOGIN: `${BASE_URL}/auth/login`,
        REGISTER: `${BASE_URL}/auth/register`,
    }
}

export {BASE_URL, API_PATH}