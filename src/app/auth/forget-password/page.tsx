import { ForgetPasswordForm } from "@/components/auth/forget-password-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <ForgetPasswordForm />
    </Suspense>
  )
}