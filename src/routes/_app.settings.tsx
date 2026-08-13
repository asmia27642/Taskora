import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — TASKORA" }] }),
  component: Settings,
});

function Settings() {
  const clearAll = () => {
    if (!confirm("Reset all TASKORA data? This cannot be undone.")) return;
    ["taskora-tasks-v1", "taskora-goals-v1", "taskora-profile"].forEach((k) => localStorage.removeItem(k));
    toast.success("Data cleared. Reload to see fresh defaults.");
  };
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Settings</h1>
      <div className="glass space-y-3 rounded-2xl p-6 shadow-card">
        <h2 className="font-semibold">Appearance</h2>
        <p className="text-sm text-muted-foreground">Use the theme toggle in the top bar to switch light/dark mode. Your preference is saved locally.</p>
      </div>
      <div className="glass space-y-3 rounded-2xl p-6 shadow-card">
        <h2 className="font-semibold">Data</h2>
        <p className="text-sm text-muted-foreground">All data is stored locally in your browser.</p>
        <Button variant="destructive" onClick={clearAll}>Reset all data</Button>
      </div>
    </div>
  );
}
