import { appRoutes } from "@/app-routes";
import { PublicLayout } from "@/components/layouts/public";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, BarChart3, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const LandingPageIndex = () => {
  const features = [
    {
      icon: Zap,
      title: "Automate LinkedIn",
      description:
        "Auto-connect and visit profiles safely. Scale your outreach while staying within LinkedIn's limits.",
    },
    {
      icon: BarChart3,
      title: "Multi-step campaigns",
      description: "Build complex workflows with delays, follow-ups, and personalized messages at scale.",
    },
    {
      icon: Users,
      title: "Grow your Pipeline",
      description: "Turn cold leads into warm conversations. Track and optimize your outreach performance.",
    },
  ];

  const logos = ["Acme Corp", "TechStart", "GlobalCo", "Innovation Inc", "Future Labs"];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border border-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">New: AI-powered LinkedIn sequencing</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            #1 LinkedIn outreach <span className="bg-linear-to-r from-primary to-cyan-400 bg-clip-text text-transparent">automation</span> for sales people
          </h1>
          <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
            Connect and engage with prospects on auto-pilot. Scale your pipeline without sacrificing personalization or account safety.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="text-base" asChild>
              <Link href={appRoutes.register}>
                Try for free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              View Demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-24 bg-muted/50">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Everything you need to scale outreach</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <span className="text-sm font-medium">Trusted by 1,000+ founders</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            {logos.map((logo, index) => (
              <div key={index} className="flex items-center">
                <span className="text-lg font-semibold">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-4xl rounded-2xl border-2 border-primary/20 bg-primary/5 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to automate your LinkedIn outreach?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Start connecting with prospects today. No credit card required.
          </p>
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Get started for free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
};

