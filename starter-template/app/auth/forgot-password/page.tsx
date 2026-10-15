import { redirect } from "next/navigation";

export default function ForgotPasswordPage() {
  // Password recovery is handled by the starter's phone verification flow.
  redirect("/auth/phone");
}
