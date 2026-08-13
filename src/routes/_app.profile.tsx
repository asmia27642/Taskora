import { createFileRoute } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — TASKORA" }] }),
  component: Profile,
});

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    const raw = localStorage.getItem("taskora-profile");
    if (raw) { const p = JSON.parse(raw); setName(p.name ?? ""); setEmail(p.email ?? ""); }
  }, []);
  const save = () => { localStorage.setItem("taskora-profile", JSON.stringify({ name, email })); toast.success("Profile saved"); };
  const initials = (name || "T U").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Profile</h1>
      <div className="glass rounded-2xl p-6 shadow-card">
        <div className="mb-6 flex items-center gap-4">
          <Avatar className="h-16 w-16"><AvatarFallback className="bg-gradient-brand text-primary-foreground">{initials}</AvatarFallback></Avatar>
          <div><h2 className="font-semibold">{name || "Your name"}</h2><p className="text-sm text-muted-foreground">{email || "you@example.com"}</p></div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="grid gap-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <Button className="bg-gradient-brand text-primary-foreground" onClick={save}>Save profile</Button>
        </div>
      </div>
    </div>
  );
}
