import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { type DashboardSummaryCardData } from "./DashboardSummaryCardsGrid";

export const DashboardSummaryCard = ({
  title,
  footerTitle,
  footerDescription,
  value,
  badge,
  icon,
}: DashboardSummaryCardData) => {
  return (
    <Card className="dark:*bg-card bg-linear-to-t from-primary/5 to-card shadow-xs">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {icon}
            {badge}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">{footerTitle}</div>
        <div className="text-muted-foreground">{footerDescription}</div>
      </CardFooter>
    </Card>
  );
};
