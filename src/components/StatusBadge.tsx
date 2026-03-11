import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyles: Record<ApplicationStatus, string> = {
  Submitted: "bg-info/15 text-info border-info/30",
  "Under Review": "bg-warning/15 text-warning border-warning/30",
  "Documents Pending": "bg-warning/15 text-warning border-warning/30",
  "Risk Assessed": "bg-accent/15 text-accent border-accent/30",
  Approved: "bg-success/15 text-success border-success/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge variant="outline" className={cn("font-semibold", statusStyles[status])}>
      {status}
    </Badge>
  );
}
