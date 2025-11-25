'use client'
import { appRoutes } from "@/app-routes"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth/client"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { FooterLinks } from "./footer-links"

export function ResetPasswordForm({
  className,
  token,
  ...props
}: React.ComponentProps<"div"> & { token: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const _resetPassword = (newPassword: string) => {
    authClient.resetPassword({
      newPassword,
      token,
      fetchOptions: {
        onError: (context) => {
          toast.error(context.error.message)
        },
        onSuccess(context) {
          toast.success("Password reset successfully")
          router.push(appRoutes.login)
        },
        onRequest: () => {
          setLoading(true)
        },
        onResponse: () => {
          setLoading(false)
        },
      },
    })
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-left">
          <CardTitle className="text-xl font-mono">Enter your new password</CardTitle>
          <CardDescription className="text-xs">
            Enter your new password to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            _resetPassword(e.currentTarget.password.value)
          }}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => {
                    e.currentTarget.setCustomValidity('');
                    const password = e.currentTarget.value;
                    const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;
                    if (password !== confirmPassword.value) {
                      confirmPassword.setCustomValidity('Passwords do not match');
                    } else {
                      confirmPassword.setCustomValidity('');
                    }
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  onChange={(e) => {
                    e.currentTarget.setCustomValidity('');
                    const confirmPassword = e.currentTarget.value;
                    const password = document.getElementById('password') as HTMLInputElement;
                    if (confirmPassword !== password.value) {
                      password.setCustomValidity('Passwords do not match');
                    } else {
                      password.setCustomValidity('');
                    }
                  }}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>{loading ? 'Loading...' : <>Continue <ArrowRight /></>}</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FooterLinks />
    </div>
  )
}
