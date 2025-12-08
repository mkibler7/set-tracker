import { Card } from "../ui/Card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
export default function AreaGraphTrainingVolume({
  data,
}: {
  data: Array<{ dateLabel: string; volume: number }>;
}) {
  return (
    <Card className="reptracker-chart h-80 flex items-center justify-center text-sm text-muted-foreground">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
        >
          {/* gradient for shaded area */}
          <defs>
            <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dateLabel"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis tickFormatter={(v) => v.toLocaleString()} width={60} />
          <Tooltip
            formatter={(value: any) => value.toLocaleString()}
            labelFormatter={(label: string) => label}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            fill="url(#volumeFill)" // ⬅ shaded under the line
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
