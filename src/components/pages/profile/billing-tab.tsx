'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Toggle } from "@/components/ui/toggle";

export const BillingTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Manage your subscription and billing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 rounded-lg bg-linear-to-r from-primary/10 to-primary/5 border">
            <div>
              <p className="text-sm text-muted-foreground">Your Plan</p>
              <p className="text-2xl font-bold">Pro</p>
              <p className="text-lg font-semibold text-primary">$29/mo</p>
            </div>
            <Button size="lg">Manage Subscription</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
          <CardDescription>Your current usage statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold">1,245</p>
              <p className="text-sm text-muted-foreground">Connections Sent</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold">3,567</p>
              <p className="text-sm text-muted-foreground">Messages Sent</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold">8,901</p>
              <p className="text-sm text-muted-foreground">Profile Visits</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
};