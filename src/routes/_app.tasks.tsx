import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { bucketOf, useTasks, type Task } from "@/lib/tasks-store";
import { TaskCard } from "@/components/app/task-card";
import { TaskDialog } from "@/components/app/task-dialog";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({ meta: [{ title: "Task Manager — TASKORA" }, { name: "description", content: "Manage tasks with priorities, categories, due dates and smart buckets." }] }),
  component: TasksPage,
});

type TabKey = "all" | "today" | "tomorrow" | "pending" | "completed" | "overdue";

function filterByTab(tasks: Task[], tab: TabKey) {
  if (tab === "all") return tasks;
  if (tab === "pending") return tasks.filter((t) => t.status === "pending");
  if (tab === "completed") return tasks.filter((t) => t.status === "completed");
  return tasks.filter((t) => bucketOf(t) === tab);
}

function TasksPage() {
  const tasks = useTasks();
  const [tab, setTab] = useState<TabKey>("all");
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");
  const [openNew, setOpenNew] = useState(false);

  const filtered = useMemo(() => {
    let list = filterByTab(tasks, tab);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s));
    }
    if (priority !== "all") list = list.filter((t) => t.priority === priority);
    list = [...list].sort((a, b) => {
      if (sort === "newest") return b.createdAt.localeCompare(a.createdAt);
      if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
      if (sort === "priority") {
        const rank = { High: 0, Medium: 1, Low: 2 } as const;
        return rank[a.priority] - rank[b.priority];
      }
      if (sort === "due") return (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");
      return 0;
    });
    return list;
  }, [tasks, tab, q, priority, sort]);

  const counts = {
    all: tasks.length,
    today: tasks.filter((t) => bucketOf(t) === "today").length,
    tomorrow: tasks.filter((t) => bucketOf(t) === "tomorrow").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter((t) => bucketOf(t) === "overdue").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Task Manager</h1>
          <p className="text-muted-foreground">Everything you need to plan and complete your work.</p>
        </div>
      </div>

      <div className="glass flex flex-col gap-3 rounded-2xl p-4 shadow-card md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks..." className="pl-9" />
        </div>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="priority">By priority</SelectItem>
            <SelectItem value="due">By due date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
        <TabsList className="flex w-full flex-wrap gap-1 bg-muted/60 p-1">
          {(["all", "today", "tomorrow", "pending", "completed", "overdue"] as TabKey[]).map((k) => (
            <TabsTrigger key={k} value={k} className="flex-1 capitalize data-[state=active]:bg-background">
              {k} <span className="ml-1 text-xs text-muted-foreground">({counts[k]})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-muted-foreground shadow-card">
              No tasks here yet. Add one with the button below.
            </div>
          ) : (
            filtered.map((t) => <TaskCard key={t.id} task={t} />)
          )}
        </TabsContent>
      </Tabs>

      <Button
        onClick={() => setOpenNew(true)}
        aria-label="Add task"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90"
      >
        <Plus className="h-6 w-6" />
      </Button>
      <TaskDialog open={openNew} onOpenChange={setOpenNew} />
    </div>
  );
}
