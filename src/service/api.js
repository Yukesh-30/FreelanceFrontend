const BASE_URL = "http://localhost:8080"

const API_PATH = {
    AUTH: {
        LOGIN: `${BASE_URL}/api/auth/login`,
        REGISTER: `${BASE_URL}/api/auth/register`,
        FORGET_PASSWORD: `${BASE_URL}/api/auth/forget-password`,
        RESET_PASSWORD: `${BASE_URL}/api/auth/reset-password`,
    },
    USERS: {
        GET_USER: (id) => `${BASE_URL}/api/users/${id}`,
        UPLOAD_PROFILE_PIC: `${BASE_URL}/api/users/profile-picture`
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
        UPDATE: (id) => `${BASE_URL}/api/gigs/update/${id}`,
        UPDATE_PACKAGE: (id) => `${BASE_URL}/api/gigs/package/${id}`,
        POST_MEDIA: (id) => `${BASE_URL}/api/gigs/${id}/media`,
        DELETE_MEDIA: `${BASE_URL}/api/gigs/media`
    },
    JOBS: {
        CREATE: `${BASE_URL}/api/jobs/`,
        GET_MY_JOBS: `${BASE_URL}/api/jobs/me`,
        GET_BY_ID: (id) => `${BASE_URL}/api/jobs/${id}`,
        UPDATE: (id) => `${BASE_URL}/api/jobs/${id}`,
        DELETE: (id) => `${BASE_URL}/api/jobs/${id}`,
    },
    CLIENT: {
        GET_MY_PROFILE: `${BASE_URL}/api/client/client-profile/me`,
        UPDATE_MY_PROFILE: `${BASE_URL}/api/client/client-profile/me`,
    }
}

export { BASE_URL, API_PATH }