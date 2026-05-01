export type PieChartDataPoint = {
  name: string;
  value: number;
  fill: string;
};

export type PieChartConfig = {
  title: string;
  description: string;
  shortDescription: string;
  data: PieChartDataPoint[];
  config: ChartConfig;
  dataKey: string;
  nameKey: string;
  centerLabel?: string; // text in the middle of the donut
  centerValue?: string; // value in the middle of the donut
};

// components/charts/ChartPieInteractive.tsx
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const ChartPieInteractive = ({
  title,
  description,
  shortDescription,
  data,
  config,
  dataKey,
  nameKey,
  centerLabel,
  centerValue,
}: PieChartConfig) => {
  const showCenter = Boolean(centerLabel && centerValue);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">{description}</span>
          <span className="@[540px]/card:hidden">{shortDescription}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="aspect-square h-[250px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={60}
              outerRadius={80}
              strokeWidth={2}>
              {showCenter && (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle">
                  <tspan
                    x="50%"
                    dy="-0.5em"
                    className="fill-foreground text-2xl font-bold">
                    {centerValue}
                  </tspan>
                  <tspan
                    x="50%"
                    dy="1.5em"
                    className="fill-muted-foreground text-xs">
                    {centerLabel}
                  </tspan>
                </text>
              )}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey={nameKey} />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
