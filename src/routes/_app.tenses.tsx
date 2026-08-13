import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TENSES } from "@/data/tenses";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/_app/tenses")({
  head: () => ({
    meta: [
      { title: "English Tenses — TASKORA" },
      { name: "description", content: "Master all 12 English tenses with formulas, rules, examples and common mistakes." },
    ],
  }),
  component: TensesPage,
});

function TensesPage() {
  const defaultOpen = TENSES.slice(0, 4).map((t) => t.name);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-soft">
          <BookOpen className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">English Tenses</h1>
          <p className="text-muted-foreground">All 12 tenses with formulas, rules, examples, and common mistakes.</p>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={defaultOpen} className="space-y-3">
        {TENSES.map((t, i) => (
          <AccordionItem key={t.name} value={t.name} className="glass rounded-2xl border-none px-5 shadow-card">
            <AccordionTrigger className="text-left hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">{i + 1}</span>
                <span className="font-display text-base font-semibold md:text-lg">{t.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="grid gap-4 md:grid-cols-2">
                <Section label="Definition">{t.definition}</Section>
                <Section label="Formula"><code className="rounded bg-muted px-2 py-1 text-sm">{t.formula}</code></Section>
                <Section label="Helping verbs">{t.helpingVerbs}</Section>
                <Section label="Structure"><code className="rounded bg-muted px-2 py-1 text-sm">{t.structure}</code></Section>
                <Section label="Rules"><ul className="list-disc pl-5">{t.rules.map((r) => <li key={r}>{r}</li>)}</ul></Section>
                <Section label="Usage"><ul className="list-disc pl-5">{t.usage.map((r) => <li key={r}>{r}</li>)}</ul></Section>
                <Section label="Affirmative"><Example>{t.affirmative}</Example></Section>
                <Section label="Negative"><Example>{t.negative}</Example></Section>
                <Section label="Interrogative"><Example>{t.interrogative}</Example></Section>
                <Section label="Notes">{t.notes}</Section>
                <div className="md:col-span-2">
                  <Section label="Common mistakes">{t.commonMistakes}</Section>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
function Example({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm">{children}</div>;
}
