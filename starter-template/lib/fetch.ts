import "server-only";
import axios from "axios";
import { auth } from "./auth";

/**
 * Example authenticated server-side request.
 * Configure an API you control before calling this helper.
 */
export async function fetchProtected() {
  const baseUrl = process.env.APPOINTMENT_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("APPOINTMENT_API_BASE_URL is required to access the example API.");
  }

  const session = await auth();
  const token = session?.user?.token;
  if (!token) {
    throw new Error("Authentication is required to access the protected API.");
  }

  const url = new URL("/protected", baseUrl);
  const response = await axios.get(url.toString(), {
    headers: { Authorization: "Bearer " + token },
  });
  return response.data;
}
