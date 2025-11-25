import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { appRoutes } from "@/lib/routes";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await (searchParams)).token;
  if (!token) {
    return redirect(appRoutes.login)
  }
  return <ResetPasswordForm token={token} />
}