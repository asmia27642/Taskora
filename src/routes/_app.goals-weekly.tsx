import { createFileRoute } from "@tanstack/react-router";
import { GoalsPage } from "@/components/app/goals-page";

export const Route = createFileRoute("/_app/goals-weekly")({
  head: () => ({ meta: [{ title: "Weekly Goals — TASKORA" }, { name: "description", content: "Set and track your weekly outcomes with live progress." }] }),
  component: () => <GoalsPage period="weekly" title="Weekly Goals" description="Focus on the outcomes that matter this week." />,
});
