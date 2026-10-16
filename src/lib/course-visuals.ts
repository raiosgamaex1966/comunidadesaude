import { Activity, Apple, Brain, BookText, Building2, Calculator, HandHeart, HeartPulse, Hospital, Landmark, MapPinned, Pill, ScanLine, Syringe, type LucideIcon } from "lucide-react";

const BY_SLUG: Record<string, LucideIcon> = {
  "lingua-portuguesa": BookText,
  "raciocinio-logico-matematico": Calculator,
  "sistema-unico-de-saude": Hospital,
  "legislacao-federal": Landmark,
  "legislacao-estadual": MapPinned,
  "legislacao-municipal": Building2,
};

const BY_PROFESSION: Record<string, LucideIcon> = {
  "Radiologia Médica": ScanLine,
  "Enfermagem": HeartPulse,
  "Técnico de Enfermagem": Syringe,
  "Fisioterapeuta": Activity,
  "Nutricionista": Apple,
  "Farmacêutico": Pill,
  "Assistente Social": HandHeart,
  "Psicólogo": Brain,
};

const GRADIENTS: Record<string, string> = {
  comum: "linear-gradient(135deg, #0d555b, #2bb3a8)",
  legislacao: "linear-gradient(135deg, #243f6b, #4f86c6)",
  especifico: "linear-gradient(135deg, #14614a, #46b58a)",
};

export function courseVisual(c: { slug: string; area: string; profession: string | null }) {
  return {
    Icon: BY_SLUG[c.slug] ?? (c.profession ? BY_PROFESSION[c.profession] : undefined) ?? BookText,
    gradient: GRADIENTS[c.area] ?? GRADIENTS.comum,
  };
}
