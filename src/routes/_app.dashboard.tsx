import { createFileRoute, Link } from "@tanstack/react-router";
import { bucketOf, useTasks } from "@/lib/tasks-store";
import { useGoals } from "@/lib/goals-store";
import { CheckCircle2, Clock, AlertTriangle, ListTodo, Target, CalendarRange, Plus, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TaskDialog } from "@/components/app/task-dialog";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — TASKORA" }, { name: "description", content: "Your productivity overview: tasks, goals, and progress." }] }),
  component: Dashboard,
});

function StatCard({ icon: Icon, label, value, tone }: any) {
  return (
    <div className="glass rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 font-display text-3xl font-bold">{value}</div>
    </div>
  );
}

function Dashboard() {
  const tasks = useTasks();
  const weekly = useGoals("weekly");
  const monthly = useGoals("monthly");
  const [newOpen, setNewOpen] = useState(false);

  const counts = {
    total: tasks.length,
    today: tasks.filter((t) => bucketOf(t) === "today").length,
    tomorrow: tasks.filter((t) => bucketOf(t) === "tomorrow").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter((t) => bucketOf(t) === "overdue").length,
  };

  const weeklyAvg = weekly.length ? Math.round(weekly.reduce((s, g) => s + g.progress, 0) / weekly.length) : 0;
  const monthlyAvg = monthly.length ? Math.round(monthly.reduce((s, g) => s + g.progress, 0) / monthly.length) : 0;

  const recent = [...tasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Welcome back 👋</h1>
          <p className="text-muted-foreground">Here's how your day is shaping up.</p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
          <Plus className="mr-1 h-4 w-4" /> New task
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={ListTodo} label="Total" value={counts.total} tone="bg-primary/15 text-primary" />
        <StatCard icon={Clock} label="Today" value={counts.today} tone="bg-info/15 text-info" />
        <StatCard icon={CalendarRange} label="Tomorrow" value={counts.tomorrow} tone="bg-accent text-accent-foreground" />
        <StatCard icon={Clock} label="Pending" value={counts.pending} tone="bg-warning/15 text-warning-foreground" />
        <StatCard icon={CheckCircle2} label="Completed" value={counts.completed} tone="bg-success/15 text-success" />
        <StatCard icon={AlertTriangle} label="Overdue" value={counts.overdue} tone="bg-destructive/15 text-destructive" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><Target className="h-4 w-4 text-primary" /> Weekly goals</h2>
            <Link to="/goals-weekly" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex-1">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>Average progress</span><span>{weeklyAvg}%</span></div>
              <Progress value={weeklyAvg} />
            </div>
          </div>
          <ul className="space-y-3">
            {weekly.slice(0, 3).map((g) => (
              <li key={g.id}>
                <div className="mb-1 flex items-center justify-between text-sm"><span className="truncate">{g.title}</span><span className="text-muted-foreground">{g.progress}%</span></div>
                <Progress value={g.progress} />
              </li>
            ))}
            {weekly.length === 0 && <p className="text-sm text-muted-foreground">No weekly goals yet.</p>}
          </ul>
        </div>

        <div className="glass rounded-2xl p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><CalendarRange className="h-4 w-4 text-primary" /> Monthly goals</h2>
            <Link to="/goals-monthly" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>Average progress</span><span>{monthlyAvg}%</span></div>
            <Progress value={monthlyAvg} />
          </div>
          <ul className="space-y-3">
            {monthly.slice(0, 3).map((g) => (
              <li key={g.id}>
                <div className="mb-1 flex items-center justify-between text-sm"><span className="truncate">{g.title}</span><span className="text-muted-foreground">{g.progress}%</span></div>
                <Progress value={g.progress} />
              </li>
            ))}
            {monthly.length === 0 && <p className="text-sm text-muted-foreground">No monthly goals yet.</p>}
          </ul>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 shadow-card lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold">Recent activity</h2>
          <ul className="divide-y divide-border/60">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.category ?? "General"} · {t.priority}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs ${t.status === "completed" ? "bg-success/15 text-success" : "bg-warning/15 text-warning-foreground"}`}>
                  {t.status}
                </span>
              </li>
            ))}
            {recent.length === 0 && <p className="text-sm text-muted-foreground">No tasks yet — add your first one.</p>}
          </ul>
        </div>

        <div className="glass rounded-2xl p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-semibold">Quick actions</h2>
          <div className="grid gap-2">
            <Button variant="outline" className="justify-start" onClick={() => setNewOpen(true)}><Plus className="mr-2 h-4 w-4" /> New task</Button>
            <Link to="/goals-weekly"><Button variant="outline" className="w-full justify-start"><Target className="mr-2 h-4 w-4" /> Add weekly goal</Button></Link>
            <Link to="/goals-monthly"><Button variant="outline" className="w-full justify-start"><CalendarRange className="mr-2 h-4 w-4" /> Add monthly goal</Button></Link>
            <Link to="/tenses"><Button variant="outline" className="w-full justify-start"><BookOpen className="mr-2 h-4 w-4" /> Study tenses</Button></Link>
          </div>
        </div>
      </div>

      <TaskDialog open={newOpen} onOpenChange={setNewOpen} />
    </div>
  );
}
