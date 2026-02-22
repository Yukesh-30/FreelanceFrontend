const BASE_URL = "http://localhost:8080"

const API_PATH = {
    AUTH: {
        LOGIN: `${BASE_URL}/api/auth/login`,
        REGISTER: `${BASE_URL}/api/auth/register`,
        FORGET_PASSWORD: `${BASE_URL}/api/auth/forget-password`,
        RESET_PASSWORD: `${BASE_URL}/api/auth/reset-password`,
    },
    USERS: {
        GET_USER: (id) => `${BASE_URL}/api/users/${id}`
    },
    FREELANCER: {
        GET_DETAILS: (id) => `${BASE_URL}/api/freelancer/details/${id}`,
        UPDATE_DETAILS: (id) => `${BASE_URL}/api/freelancer/details/${id}`,
        UPDATE_SKILLS: (id) => `${BASE_URL}/api/freelancer/details-skills/${id}`
    }
}

export { BASE_URL, API_PATH }