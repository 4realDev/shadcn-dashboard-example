// TODO: UNDERSTAND

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/useMobile";
import { useEffect, useMemo } from "react";

export type ChartDataPoint = {
  date: string;
  [key: string]: string | number; // dynamic keys like "value1", "value2", etc.
};

export type TimeRangeOption = {
  value: string; // "90d"
  label: string; // "Last 3 months"
  days: number; // 90
};

export type AreaChartConfig = {
  title: string;
  description: string;
  shortDescription?: string;
  data: ChartDataPoint[];
  dataKeys: string[]; // e.g. ["value1", "value2"]
  timeRanges: TimeRangeOption[]; // e.g. [{ value: "90d", label: "Last 3 months", days: 90 }]
  defaultTimeRange: string; // e.g. "90d"
  referenceDate: string; // e.g. "2024-06-30"
  config: ChartConfig;
};

// export const description = "An interactive area chart";

export const ChartAreaInteractive = ({
  title,
  description,
  shortDescription,
  data,
  dataKeys,
  timeRanges,
  defaultTimeRange,
  referenceDate,
  config,
}: AreaChartConfig) => {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState(defaultTimeRange as TimeRangeOption["value"]);

  // Only want effect to fire when user switches between mobile and desktop, not every time time range changes
  // [isMobile] instead of [isMobile, timeRange, timeRanges] in dependency array
  useEffect(() => {
    if (isMobile) {
      // show smallest time range on mobile
      const smallest = [...timeRanges].sort((a, b) => a.days - b.days)[0];
      setTimeRange(smallest.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // for big data (>10k entries), complex filter logic/nested loops or rendering of JSX,
  // useMemo can optimize performance by memoizing result and only recalculating when dependency array changes
  // instead of recalculating ON EVERY RENDER
  const filteredData = useMemo(
    () =>
      data.filter((item) => {
        // only keep data points that fall within the selected time range
        // 1. convert string (e.g. "2024-06-30") to JS Date object for mathematical comparison
        const date = new Date(item.date);
        // 2. reference date (today) = end point of time range
        const ref = new Date(referenceDate);
        // 3. find current selected time range object in Select
        const selectedTimeRange = timeRanges.find(
          (timeRangeOption) => timeRangeOption.value === timeRange,
        );
        // 4. subtract selected time range (e.g. 90 days) from reference date (today) to get start point of selected time range
        const startDate = new Date(ref);
        startDate.setDate(ref.getDate() - (selectedTimeRange?.days ?? 90));
        // 5. only includes dates where the date falls after the start date
        return date >= startDate;
      }),
    [timeRange, data, referenceDate, timeRanges],
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {/* only visible if container >= 540px */}
          <span className="hidden @[540px]/card:block">{description}</span>
          {/* if container is < 540px hide text, otherwise show short description */}
          <span className="@[540px]/card:hidden">{shortDescription}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex">
            {timeRanges.map((range) => (
              <ToggleGroupItem
                key={range.value}
                value={range.value}>
                {range.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {timeRanges.map((range) => (
                <SelectItem
                  key={range.value}
                  value={range.value}
                  className="rounded-lg">
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={config}
          className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              {dataKeys.map((key) => (
                <linearGradient
                  key={key}
                  id={`fill-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1">
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string | number | Date) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value as string).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {dataKeys.map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="linear"
                fill={`url(#fill-${key})`}
                stroke={`var(--color-${key})`}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
