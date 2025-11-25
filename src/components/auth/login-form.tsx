'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth/client"
import { appRoutes } from "@/app-routes"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { FooterLinks } from "./footer-links"
import { SocialBtn } from "./social-btn"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()


  const _signInEmailPassword = (email: string, password: string) => {
    authClient.signIn.email({
      email,
      password,
      callbackURL: searchParams.get("redirect") || appRoutes.appDashboard,
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
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-mono">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            _signInEmailPassword(e.currentTarget.email.value, e.currentTarget.password.value)
          }}>
            <FieldGroup>
              <Field>
                <SocialBtn provider="google" title="Login with Google" />
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href={appRoutes.forgetPassword}
                    className="ml-auto text-sm underline-offset-4 hover:underline text-blue-400"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Login'}</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href={appRoutes.register}>Sign up</Link>
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
