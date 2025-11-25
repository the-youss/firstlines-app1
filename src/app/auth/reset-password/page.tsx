import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { appRoutes } from "@/app-routes";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await (searchParams)).token;
  if (!token) {
    return redirect(appRoutes.login)
  }
  return <Suspense>
    <ResetPasswordForm token={token} />
  </Suspense>
}