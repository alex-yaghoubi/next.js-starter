import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignupForm from "./signup-form";

export default async function SignupPage({
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
    <SignupForm phoneNumber={phoneNumber} initialError={params.error} />
  );
}
