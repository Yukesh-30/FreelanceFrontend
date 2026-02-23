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
    },
    GIGS: {
        CREATE: `${BASE_URL}/api/gigs/create`,
        GET_ALL_BY_FREELANCER: (id) => `${BASE_URL}/api/gigs/all-gigs/${id}`,
        GET_BY_ID: (id) => `${BASE_URL}/api/gigs/${id}`,
        DELETE: (id) => `${BASE_URL}/api/gigs/delete/${id}`,
        UPDATE: (id) => `${BASE_URL}/api/gigs/update/${id}`
    }
}

export { BASE_URL, API_PATH }