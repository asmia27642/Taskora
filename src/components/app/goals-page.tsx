import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { goalsStore, useGoals, type Goal } from "@/lib/goals-store";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  period: "weekly" | "monthly";
  title: string;
  description: string;
}

export function GoalsPage({ period, title, description }: Props) {
  const goals = useGoals(period);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [form, setForm] = useState({ title: "", description: "", progress: 0 });

  const openNew = () => { setEditing(null); setForm({ title: "", description: "", progress: 0 }); setOpen(true); };
  const openEdit = (g: Goal) => { setEditing(g); setForm({ title: g.title, description: g.description ?? "", progress: g.progress }); setOpen(true); };

  const save = () => {
    if (!form.title.trim()) return toast.error("Title required");
    if (editing) {
      goalsStore.update(editing.id, { title: form.title, description: form.description, progress: form.progress });
      toast.success("Goal updated");
    } else {
      goalsStore.add({ title: form.title, description: form.description, progress: form.progress, period });
      toast.success("Goal added");
    }
    setOpen(false);
  };

  const avg = goals.length ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button onClick={openNew} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
          <Plus className="mr-1 h-4 w-4" /> New goal
        </Button>
      </div>

      <div className="glass rounded-2xl p-6 shadow-card">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Average progress across {goals.length} goals</span>
          <span className="font-display text-2xl font-bold">{avg}%</span>
        </div>
        <Progress value={avg} className="h-3" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((g) => (
          <div key={g.id} className="group glass rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{g.title}</h3>
                {g.description && <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>}
              </div>
              <div className="flex opacity-0 transition group-hover:opacity-100">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-info" onClick={() => openEdit(g)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => { goalsStore.remove(g.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span><span>{g.progress}%</span>
              </div>
              <Progress value={g.progress} />
              <input
                type="range" min={0} max={100} value={g.progress}
                onChange={(e) => goalsStore.update(g.id, { progress: Number(e.target.value) })}
                className="mt-3 w-full accent-[oklch(var(--primary))]"
              />
            </div>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="glass col-span-full rounded-2xl p-10 text-center text-muted-foreground shadow-card">
            No {period} goals yet. Add one to get started.
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit goal" : "New goal"}</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-2"><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
            <div className="grid gap-2"><Label>Progress ({form.progress}%)</Label>
              <input type="range" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} className="accent-[oklch(var(--primary))]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-gradient-brand text-primary-foreground" onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
