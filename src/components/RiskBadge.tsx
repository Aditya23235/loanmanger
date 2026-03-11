import { Badge } from "@/components/ui/badge";
import type { RiskLevel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const riskStyles: Record<RiskLevel, string> = {
  Low: "bg-risk-low/15 text-risk-low border-risk-low/30",
  Medium: "bg-risk-medium/15 text-risk-medium border-risk-medium/30",
  High: "bg-risk-high/15 text-risk-high border-risk-high/30",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <Badge variant="outline" className={cn("font-semibold", riskStyles[level])}>
      {level}
    </Badge>
  );
}
