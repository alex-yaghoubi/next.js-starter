import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import VerifySignupForm from "./verify-signup-form";

export default async function VerifySignupPage({
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
    <VerifySignupForm
      phoneNumber={phoneNumber}
      initialError={params.error}
    />
  );
}
