'use client'
import { appRoutes } from "@/app-routes"
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
import { Environment } from "@/lib/environment"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { FooterLinks } from "./footer-links"
import { SocialBtn } from "./social-btn"


export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isProduction] = useState(Environment.isProduction())
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const _register = (name: string, email: string, password: string) => {
    authClient.signUp.email({
      email,
      password,
      name,
      fetchOptions: {
        onSuccess: () => {
          toast.info(`You have been registered successfully`)
          router.push(appRoutes.login)
        },
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
          <CardTitle className="text-xl font-mono">Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            _register(e.currentTarget.fullname.value, e.currentTarget.email.value, e.currentTarget.password.value)
          }}>
            <FieldGroup>
              <Field>
                <SocialBtn provider="google" title="Sign up with Google" />
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or create an account
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="fullname">Full Name</FieldLabel>
                <Input autoComplete="name" id="fullname" type="text" placeholder="John Doe" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  autoComplete="email"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  title="Please enter a valid email address"
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      autoComplete="new-password"
                      id="password"
                      type="password"
                      required
                      pattern={isProduction ? ".{8,}" : ".{3,}"}
                      title={`Password must be at least ${isProduction ? "8" : "3"} characters long`}
                      onChange={(e) => {
                        const pw = e.currentTarget.value
                        const confirmPw = document.getElementById('confirm-password') as HTMLInputElement
                        console.log(pw, confirmPw.value)
                        if (confirmPw && confirmPw.value !== pw) {
                          confirmPw.setCustomValidity('Passwords do not match')
                        } else {
                          confirmPw?.setCustomValidity('')
                        }
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      autoComplete="new-password"
                      id="confirm-password"
                      type="password"
                      required
                      pattern={isProduction ? ".{8,}" : ".{3,}"}
                      title={`Password must be at least ${isProduction ? "8" : "3"} characters long`}
                      onChange={(e) => {
                        const confirmPw = e.currentTarget.value
                        const pw = document.getElementById('password') as HTMLInputElement
                        console.log(pw.value, confirmPw)
                        if (pw && pw.value !== confirmPw) {
                          pw.setCustomValidity('Passwords do not match')
                        } else {
                          pw?.setCustomValidity('')
                        }
                      }}
                    />
                  </Field>
                </Field>
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Create Account'}</Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href={appRoutes.login}>Sign in</Link>
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
