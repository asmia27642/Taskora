import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/app/logo";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckSquare, Target, BookOpen, BarChart3, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TASKORA — Plan • Achieve • Learn • Grow" },
      { name: "description", content: "A modern productivity workspace: tasks, weekly & monthly goals, English tenses learning, and progress analytics — all in one beautiful app." },
      { property: "og:title", content: "TASKORA — Plan • Achieve • Learn • Grow" },
      { property: "og:description", content: "Tasks, goals, learning and analytics in one modern workspace." },
    ],
  }),
  component: Home,
});

const features = [
  { icon: CheckSquare, title: "Task Manager", desc: "Capture, prioritize, and complete work with smart buckets: Today, Tomorrow, Pending, Overdue." },
  { icon: Target, title: "Weekly & Monthly Goals", desc: "Set outcomes, track progress %, and stay aligned with what matters most." },
  { icon: BookOpen, title: "English Tenses", desc: "Master all 12 English tenses with formulas, rules, examples, and common mistakes." },
  { icon: BarChart3, title: "Progress Analytics", desc: "See your streaks, completion rates and momentum at a glance." },
];

function Home() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/dashboard">
            <Button className="bg-gradient-brand text-primary-foreground hover:opacity-90">
              Open app <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pt-10 pb-20 text-center md:pt-20">
        <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Plan • Achieve • Learn • Grow
        </div>
        <h1 className="animate-fade-in-up mt-6 font-display text-5xl font-bold tracking-tight md:text-7xl">
          Your productivity, <br className="hidden md:block" />
          <span className="text-gradient-brand">beautifully organised.</span>
        </h1>
        <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          TASKORA brings your tasks, weekly and monthly goals, English tenses learning, and progress analytics into one calm, modern workspace.
        </p>
        <div className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90">
              Get started free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/tenses">
            <Button size="lg" variant="outline">Explore tenses</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 shadow-card transition hover:shadow-glow">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 bg-background/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground md:flex-row">
          <Logo size={28} />
          <p>© {new Date().getFullYear()} TASKORA. Plan • Achieve • Learn • Grow.</p>
        </div>
      </footer>
    </div>
  );
}
