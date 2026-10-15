import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import VerifyLoginForm from "./verify-login-form";

export default async function VerifyLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string; error?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (session) {
    redirect("/");
  }

  const phoneNumber = params.phone;
  if (!phoneNumber) {
    redirect("/auth/phone");
  }

  return (
    <VerifyLoginForm
      phoneNumber={phoneNumber}
      initialError={params.error}
    />
  );
}
