'use client'
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
  FieldDescription,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth/client"
import { cn } from "@/lib/utils"
import { appRoutes } from "@/app-routes"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { FooterLinks } from "./footer-links"

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()


  const _requestForgetPassword = (email: string) => {
    authClient.resetPassword({
      email,
      redirectTo: appRoutes.appDashboard,
      fetchOptions: {
        onError: (context) => {
          toast.error(context.error.message)
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
          <CardTitle className="text-xl font-mono">Reset your password</CardTitle>
          <CardDescription className="text-xs">
            Enter your user account's email address and we will send you a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            _requestForgetPassword(e.currentTarget.email.value)
          }}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>{loading ? 'Loading...' : <>Continue <ArrowRight /></>}</Button>
                <FieldDescription className="text-center">
                  Remember your password? <Link href={appRoutes.login}>Sign in instead</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FooterLinks />
    </div>
  )
}
