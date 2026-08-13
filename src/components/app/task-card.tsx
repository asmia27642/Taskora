import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar, Flag } from "lucide-react";
import { bucketOf, tasksStore, type Task } from "@/lib/tasks-store";
import { useState } from "react";
import { TaskDialog } from "./task-dialog";
import { toast } from "sonner";

const priorityColors: Record<string, string> = {
  Low: "bg-info/15 text-info border-info/30",
  Medium: "bg-warning/15 text-warning-foreground border-warning/40",
  High: "bg-destructive/15 text-destructive border-destructive/30",
};

export function TaskCard({ task }: { task: Task }) {
  const [editOpen, setEditOpen] = useState(false);
  const bucket = bucketOf(task);
  const statusBadge = {
    completed: { label: "Completed", cls: "bg-success/15 text-success border-success/30" },
    overdue: { label: "Overdue", cls: "bg-destructive/15 text-destructive border-destructive/30" },
    today: { label: "Today", cls: "bg-info/15 text-info border-info/30" },
    tomorrow: { label: "Tomorrow", cls: "bg-primary/15 text-primary border-primary/30" },
    pending: { label: "Pending", cls: "bg-warning/15 text-warning-foreground border-warning/40" },
    upcoming: { label: "Upcoming", cls: "bg-muted text-muted-foreground border-border" },
  }[bucket];

  return (
    <>
      <div className="group glass rounded-2xl p-4 shadow-card transition hover:shadow-soft">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.status === "completed"}
            onCheckedChange={() => tasksStore.toggle(task.id)}
            className="mt-1"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={`font-medium ${task.status === "completed" ? "text-muted-foreground line-through" : ""}`}>
                {task.title}
              </h3>
              <Badge variant="outline" className={statusBadge.cls}>{statusBadge.label}</Badge>
              <Badge variant="outline" className={priorityColors[task.priority]}>
                <Flag className="mr-1 h-3 w-3" />{task.priority}
              </Badge>
              {task.category && <Badge variant="secondary">{task.category}</Badge>}
            </div>
            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {task.dueDate && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Due {task.dueDate}{task.dueTime ? ` · ${task.dueTime}` : ""}
                </span>
              )}
              <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-info hover:text-info" onClick={() => setEditOpen(true)} aria-label="Edit task">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => { tasksStore.remove(task.id); toast.success("Task deleted"); }}
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <TaskDialog open={editOpen} onOpenChange={setEditOpen} task={task} />
    </>
  );
}
