import { LessonShell } from "./LessonShell";
import { VideoPlayer } from "./VideoPlayer";
import { KeyTakeaways } from "./KeyTakeaways";
import { Checklist } from "./Checklist";
import { EcosystemDiagram } from "@/components/interactive/EcosystemDiagram";
import { TeamCards } from "@/components/interactive/TeamCards";
import { ExpectationsCard } from "@/components/interactive/ExpectationsCard";
import { ContractCompare } from "@/components/interactive/ContractCompare";
import { PropFirmRules } from "@/components/interactive/PropFirmRules";
import { TradeDiagram } from "@/components/interactive/TradeDiagram";
import { ManualTradingSim } from "@/components/interactive/ManualTradingSim";
import { EmergencyTree } from "@/components/interactive/EmergencyTree";
import { StatusPanelMock } from "@/components/interactive/StatusPanelMock";
import { DailyProcedures } from "@/components/interactive/DailyProcedures";
import { getChecklist } from "@/content/checklists";
import type { Lesson } from "@/content/types";
import type { StudentState } from "@/lib/progress";

export function LessonBody({ lesson, state }: { lesson: Lesson; state: StudentState }) {
  const completed = !!state.lessons[lesson.slug]?.completed;
  return (
    <LessonShell lesson={lesson} completed={completed}>
      {lesson.videoId && <VideoPlayer youtubeId={lesson.videoId} />}
      {lesson.body && <p className="text-base leading-relaxed text-fg-muted">{lesson.body}</p>}
      <KeyTakeaways items={lesson.takeaways} />
      <Interactive lesson={lesson} state={state} />
      {lesson.checklistKey && (() => {
        const c = getChecklist(lesson.checklistKey)!;
        const initial = state.checklists[lesson.slug] ?? {};
        return <Checklist checklist={c} lessonSlug={lesson.slug} initial={initial} />;
      })()}
    </LessonShell>
  );
}

function Interactive({ lesson, state }: { lesson: Lesson; state: StudentState }) {
  switch (lesson.interactive) {
    case "ecosystem":
      return <EcosystemDiagram />;
    case "team":
      return <TeamCards />;
    case "expectations":
      return <ExpectationsCard />;
    case "contract-compare":
    case "risk-calculator":
      return <ContractCompare />;
    case "prop-firm-rules":
      return <PropFirmRules />;
    case "trade-diagram":
      return <TradeDiagram />;
    case "manual-trading":
      return <ManualTradingSim />;
    case "emergency-tree":
      return <EmergencyTree />;
    case "exit-checklist":
      return null; // checklistKey path handles this
    case "status-panel":
      return <StatusPanelMock />;
    case "daily-procedures":
      return <DailyProcedures />;
    case "deployment-sim":
      return null; // deployment-sim has its own page
    default:
      return null;
  }
}
