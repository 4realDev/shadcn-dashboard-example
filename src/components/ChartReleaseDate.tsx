import { transformTracksToChartData } from "@/lib/chart";
import { useMemo } from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { ChartContainer, ChartTooltip, type ChartConfig } from "./ui/chart";
import type { DeezerTrackWithAlbumInfo } from "@/api/modules/deezer/deezer.types";

// ─── types ────────────────────────────────────────────────────────────────────

type ChartReleaseTimelineProps = {
  tracks: DeezerTrackWithAlbumInfo[];
};

// ─── config ───────────────────────────────────────────────────────────────────

const chartConfig = {
  count: {
    label: "Releases",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// ─── custom tooltip ───────────────────────────────────────────────────────────

// shadcn's ChartTooltipContent doesn't support showing the song names list
// so we need a custom tooltip component
type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    payload: {
      date: string;
      count: number;
      titles: string[];
    };
  }[];
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const { date, count, titles } = payload[0].payload;

  return (
    <div
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-xl
                    min-w-40">
      {/* date header */}
      <p className="text-xs font-semibold text-zinc-400 mb-2">{date}</p>
      {/* count */}
      <p className="text-sm font-bold text-white mb-2">
        {count} release{count > 1 ? "s" : ""}
      </p>
      {/* song names */}
      <ul className="space-y-1">
        {titles.map((title) => (
          <li
            key={title}
            className="text-xs text-zinc-400 truncate max-w-50">
            · {title}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ─── main component ───────────────────────────────────────────────────────────

export const ChartReleaseTimeline = ({ tracks }: ChartReleaseTimelineProps) => {
  // memoized — only recalculates when tracks change
  const chartData = useMemo(() => transformTracksToChartData(tracks), [tracks]);

  if (!chartData.length) return null;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Release Timeline</CardTitle>
        <CardDescription>Monthly releases</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-75 w-full">
          <LineChart data={chartData}>
            <CartesianGrid
              vertical={false}
              stroke="hsl(var(--border))"
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={40}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              // show only the year when ticks overlap
              tickFormatter={(value: string) => value.slice(0, 4)}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false} // only whole numbers — you can't release 0.5 songs
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />

            {/* custom tooltip — shows song names on hover */}
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
              content={<CustomTooltip />}
            />

            <Line
              dataKey="count"
              type="monotone"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={{ fill: "var(--color-count)", r: 3 }}
              activeDot={{ r: 5, fill: "var(--color-count)" }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
