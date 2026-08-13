import { createFileRoute } from "@tanstack/react-router";
import { GoalsPage } from "@/components/app/goals-page";

export const Route = createFileRoute("/_app/goals-monthly")({
  head: () => ({ meta: [{ title: "Monthly Goals — TASKORA" }, { name: "description", content: "Track your monthly ambitions with visual progress." }] }),
  component: () => <GoalsPage period="monthly" title="Monthly Goals" description="Bigger bets, tracked over the month." />,
});
