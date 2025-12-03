'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, Fragment, useCallback, useState } from "react";
// import { Toggle } from "@/components/ui/toggle";
import { LinkedInSessionStatus } from "@/components/linkedin-session-status";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import { authClient, useSession } from "@/lib/auth/client";
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner";

export const ProfileTab = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user!;
  const [error, setError] = useState<{ [key: string]: string }>({})
  const [success, setSuccess] = useState<{ [key: string]: string }>({})

  const _saveProfileInformation = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setError({});
    setSuccess({})
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const promise: Promise<any>[] = []
    if (user.email !== email) {
      promise.push(
        authClient.changeEmail({
          newEmail: email ?? user.email
        }).then(res => ({ ...res, key: 'email' }))
      )
    }

    if (user.name !== name) {
      promise.push(
        authClient.updateUser({
          name: name ?? user.name
        }).then(res => ({ ...res, key: 'name' }))
      )
    }

    const responses = await Promise.all(promise);
    for (const response of responses) {
      if (response.error) {
        setError(state => ({ ...state, [response.key]: response.error?.message ?? 'Something went wrong' }))
      } else {
        setSuccess(state => ({ ...state, [response.key]: `${response.key} updated successfully.` }))
      }
    }

  }, [user])
  const _updatePassword = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const currentPwd = formData.get("current-pwd") as string
    const newPwd = formData.get("new-pwd") as string
    const res = await authClient.changePassword({
      currentPassword: currentPwd,
      newPassword: newPwd,
      revokeOtherSessions: true
    });

    if (res.error) {
      toast.error(res.error.message)
    } else {
      toast.success(`Password updated successfully`)
    }
  }, [])
  if (isPending) {
    return <SkeletonProfileTab />
  }
  return (
    <div className="space-y-6">
      {/* LinkedIn Connection Card */}
      <Card>
        <CardHeader>
          <CardTitle>LinkedIn Connection</CardTitle>
          <CardDescription>Manage your connected LinkedIn account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                {user.image && <AvatarImage src={user.image} />}
                <AvatarFallback className="capitalize">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">John Doe</p>
                <div className="flex items-center gap-2 text-sm">
                  <LinkedInSessionStatus>
                    {(status) => (
                      <Fragment>
                        {status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                        <span className={cn(" font-medium", status ? "text-green-600" : "text-red-600")}>{status ? 'Connected' : 'Disconnected'}</span>
                      </Fragment>
                    )}
                  </LinkedInSessionStatus>
                </div>
              </div>
            </div>
            <LinkedInSessionStatus>
              {(status) => (
                status && (
                  <Button variant="outline" size="lg">
                    Reconnect Account
                  </Button>
                )
              )}
            </LinkedInSessionStatus>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <form onSubmit={_saveProfileInformation}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={user.name}
                  placeholder="Enter your name"
                  required
                />
                {error.name && <span className="text-xs italic text-destructive">{error.name}</span>}
                {success.name && <span className="text-xs italic text-green-600">{success.name}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  placeholder="Enter your email"
                  required
                />
                {error.email && <span className="text-xs text-destructive italic">{error.email}</span>}
                {success.email && <span className="text-xs  text-green-600 italic">{success.email}</span>}
              </div>
            </div>
            <Button type="submit">Save Changes</Button>
          </CardContent>
        </form>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <form onSubmit={_updatePassword}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  name="current-pwd"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  name="new-pwd"
                  placeholder="Enter new password"
                  required
                // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,8}$"

                />
              </div>
            </div>
            <Button type="submit">Update Password</Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
};


export const SkeletonProfileTab = () => {
  return (
    <div className="space-y-6">
      {/* LinkedIn Connection Card */}
      <Card>
        <CardHeader>
          <CardTitle>LinkedIn Connection</CardTitle>
          <CardDescription>Manage your connected LinkedIn account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" /> {/* Avatar */}
              <div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" /> {/* Name */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" /> {/* Status icon */}
                    <Skeleton className="h-4 w-24" /> {/* Status text */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" /> {/* Save button */}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    </div>
  )
};
