import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PasswordForm from "./password-form";

export default async function PasswordPage({
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
    <PasswordForm phoneNumber={phoneNumber} initialError={params.error} />
  );
}
