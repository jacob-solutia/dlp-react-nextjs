import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          Solutia · React Day 2
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          Next.js Workshop Starter
        </h1>
        <p className="text-lg text-muted-foreground">
          Everything is wired up — App Router, Drizzle + SQLite, better-auth, and
          shadcn/ui. Follow the slides and build out the dashboard.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demo credentials</CardTitle>
          <CardDescription>Seeded into the local SQLite database.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 font-mono text-sm">
          <div>demo@solutia.test</div>
          <div>password123</div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Some routes (like <code>/login</code> and parts of the dashboard) are
        yours to build during the workshop — a 404 there is expected until you
        create them.
      </p>
    </main>
  );
}
