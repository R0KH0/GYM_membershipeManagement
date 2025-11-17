import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatCard = ({ title, value, subtitle, subtitleColor = "neutral" }) => {
  const subtitleColorClass = {
    success: "text-status-active",
    error: "text-status-cancelled",
    neutral: "text-muted-foreground",
  }[subtitleColor];

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <p className={`text-sm mt-1 ${subtitleColorClass}`}>{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
