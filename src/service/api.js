const BASE_URL = "http://localhost:8080"

const API_PATH = {
    AUTH: {
        LOGIN: `${BASE_URL}/api/auth/login`,
        REGISTER: `${BASE_URL}/api/auth/register`,
        FORGET_PASSWORD: `${BASE_URL}/api/auth/forget-password`,
        RESET_PASSWORD: `${BASE_URL}/api/auth/reset-password`,
    }
}

export { BASE_URL, API_PATH }