import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "@/components/app/logo";

export const Route = createFileRoute("/_app/about")({
  head: () => ({ meta: [{ title: "About — TASKORA" }, { name: "description", content: "About TASKORA — Plan, Achieve, Learn, Grow." }] }),
  component: () => (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-bold md:text-4xl">About TASKORA</h1>
      <div className="glass rounded-2xl p-8 shadow-card">
        <Logo size={56} />
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          TASKORA is a modern productivity workspace designed to help you <span className="text-foreground font-medium">Plan</span>,
          <span className="text-foreground font-medium"> Achieve</span>,
          <span className="text-foreground font-medium"> Learn</span> and
          <span className="text-foreground font-medium"> Grow</span> — every single day.
        </p>
        <p className="mt-4 text-muted-foreground">
          Manage tasks with smart buckets, set weekly and monthly goals with visual progress, and master all 12 English tenses in one calm, beautiful place.
        </p>
      </div>
    </div>
  ),
});
