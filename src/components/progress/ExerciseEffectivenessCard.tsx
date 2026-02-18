import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import TimeFilterSelect from "./TimeFilterSelect";
import InsufficientDataOverlay from "./InsufficientDataOverlay";
import { useExerciseEffectiveness } from "@/hooks/useExerciseEffectiveness";
import { usePersistedTimeFilter } from "@/hooks/usePersistedTimeFilter";

const ExerciseEffectivenessCard = () => {
  const { filter, setFilter, customRange, setCustomRange } = usePersistedTimeFilter();
  const { data, isLoading, isPremium, isTrackingEnabled, hasData } = useExerciseEffectiveness(filter, customRange);

  const getOverlayType = (): "premium" | "disabled" | "data" | null => {
    if (!isPremium) return "premium";
    if (!isTrackingEnabled) return "disabled";
    if (!hasData) return "data";
    return null;
  };

  const overlayType = getOverlayType();

  // Color bars: green for positive reduction, amber for no/negative effect
  const getBarColor = (value: number) => {
    if (value >= 20) return "hsl(142, 70%, 45%)";
    if (value >= 5) return "hsl(85, 60%, 48%)";
    if (value >= 0) return "hsl(45, 80%, 52%)";
    return "hsl(0, 65%, 60%)";
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg text-sm">
          <p className="font-semibold text-foreground mb-2">{d.exerciseTitle}</p>
          <div className="space-y-1 text-muted-foreground">
            <p>Stress before: <span className="font-medium text-foreground">{d.avgPreStress}</span></p>
            <p>Stress after: <span className="font-medium text-foreground">{d.avgPostStress}</span></p>
            <p>
              Reduction:{" "}
              <span className={`font-medium ${d.avgStressReductionPercent >= 0 ? "text-green-600" : "text-red-500"}`}>
                {d.avgStressReductionPercent >= 0 ? "−" : "+"}{Math.abs(d.avgStressReductionPercent)}%
              </span>
            </p>
            <p>Sessions tracked: <span className="font-medium text-foreground">{d.sessionCount}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Truncate long exercise names for axis labels
  const truncate = (str: string, n: number) => str.length > n ? str.slice(0, n) + "…" : str;

  const chartData = data.map(d => ({
    ...d,
    label: truncate(d.exerciseTitle, 18),
  }));

  // Medal emoji for top 3
  const medal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  return (
    <Card className="border-none shadow-md bg-card relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span className="text-card-foreground">Exercise Effectiveness</span>
          </CardTitle>
          <TimeFilterSelect
            value={filter}
            onChange={setFilter}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
        </div>
        <CardDescription className="text-muted-foreground">
          Which exercises reduce your stress the most (min. 2 sessions)
        </CardDescription>
      </CardHeader>

      <CardContent className="relative min-h-[320px]">
        {overlayType && (
          <InsufficientDataOverlay type={overlayType} daysCount={0} />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading effectiveness data…</p>
          </div>
        ) : (
          <div className={overlayType ? "blur-sm pointer-events-none" : ""}>

            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={Math.max(220, chartData.length * 52)}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  unit="%"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => `${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={130}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
                <Bar dataKey="avgStressReductionPercent" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.avgStressReductionPercent)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Ranked list summary below chart */}
            {data.length > 0 && (
              <div className="mt-4 space-y-2">
                {data.map((item, index) => (
                  <div
                    key={item.exerciseTitle}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base leading-none w-5 flex-shrink-0">{medal(index) ?? <span className="text-xs text-muted-foreground font-medium">{index + 1}</span>}</span>
                      <span className="text-sm font-medium text-card-foreground truncate">{item.exerciseTitle}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <span className="text-xs text-muted-foreground">{item.sessionCount} sessions</span>
                      <span
                        className={`text-sm font-bold ${item.avgStressReductionPercent >= 0 ? "text-green-600" : "text-red-500"}`}
                      >
                        {item.avgStressReductionPercent >= 0 ? "−" : "+"}{Math.abs(item.avgStressReductionPercent)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseEffectivenessCard;
