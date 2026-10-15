import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import PhoneForm from "./phone-form";

export default async function PhonePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return <PhoneForm initialError={params.error} />;
}