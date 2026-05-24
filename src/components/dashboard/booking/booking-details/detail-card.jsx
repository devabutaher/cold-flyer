import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DetailCard({ icon, title, children, action }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          {icon}
          {title}
          {action && <span className="ml-auto">{action}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-sm space-y-1.5">{children}</CardContent>
    </Card>
  );
}
