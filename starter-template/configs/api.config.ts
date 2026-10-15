// Only call an appointment backend explicitly configured by the application owner.
// Never silently send generated-app traffic to an Octavia production service.
const BASE_URL = process.env.APPOINTMENT_API_BASE_URL || "";

// API Endpoints
export const GET_TEST_URL = `${BASE_URL}/test`; //GET

export const USERS_CHECK_PHONE_NUMBER = `${BASE_URL}/appointment/user/users/checkPhoneNumber`;
export const USERS_SEND_CODE = "/api/users/send-code";
export const USERS_VERIFY = "/api/users/verify";
export const USERS_REGISTER = "/api/users/register";
export const LOGIN = "/api/auth/login";
