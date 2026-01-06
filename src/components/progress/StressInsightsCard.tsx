import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingDown, ArrowDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import TimeFilterSelect from "./TimeFilterSelect";
import InsufficientDataOverlay from "./InsufficientDataOverlay";
import { useEmotionalStatistics, processStressData, calculateStressSummary, TimeFilter, DateRange } from "@/hooks/useEmotionalStatistics";
import { format, parseISO } from "date-fns";

const StressInsightsCard = () => {
  const [filter, setFilter] = useState<TimeFilter>("weekly");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  
  const { records, isLoading, hasEnoughData, uniqueDaysCount, isTrackingEnabled, isPremium } = useEmotionalStatistics(filter, customRange);
  
  const stressData = processStressData(records);
  const summary = calculateStressSummary(records);
  
  const getOverlayType = (): "premium" | "disabled" | "data" | null => {
    if (!isPremium) return "premium";
    if (!isTrackingEnabled) return "disabled";
    if (!hasEnoughData) return "data";
    return null;
  };
  
  const overlayType = getOverlayType();

  const formatXAxis = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM d");
    } catch {
      return dateStr;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg text-sm">
          <p className="font-medium mb-2">{format(parseISO(label), "MMM d, yyyy")}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
          {payload.length === 2 && (
            <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
              Change: <span className={payload[0].value > payload[1].value ? "text-green-600" : "text-red-600"}>
                {payload[0].value > payload[1].value ? "-" : "+"}{Math.abs(payload[0].value - payload[1].value)}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-none shadow-md bg-white relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-500" />
              <span className="text-gray-800">Stress Insights</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Monitor your stress levels before & after exercises
            </CardDescription>
          </div>
          <TimeFilterSelect
            value={filter}
            onChange={setFilter}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
        </div>
      </CardHeader>
      <CardContent className="relative min-h-[320px]">
        {overlayType && (
          <InsufficientDataOverlay type={overlayType} daysCount={uniqueDaysCount} />
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading stress data...</p>
          </div>
        ) : (
          <div className={overlayType ? "blur-sm pointer-events-none" : ""}>
            {/* Summary Stats */}
            {summary.stressReduction !== 0 && (
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {summary.stressReduction > 0 ? (
                      <ArrowDown className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 rotate-180" />
                    )}
                    <span className="text-muted-foreground">
                      Average stress reduction
                    </span>
                  </div>
                  <span className={`font-medium ${summary.stressReduction > 0 ? "text-green-600" : "text-red-600"}`}>
                    {summary.stressReduction > 0 ? "-" : "+"}{Math.abs(Math.round(summary.stressReductionPercent))}%
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Before: {Math.round(summary.avgPreStress)}</span>
                  <span>After: {Math.round(summary.avgPostStress)}</span>
                </div>
              </div>
            )}

            {/* Line Chart */}
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stressData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis} 
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                  formatter={(value) => <span className="text-muted-foreground">{value}</span>}
                />
                <Line 
                  type="monotone" 
                  dataKey="preBefore" 
                  name="Before Exercise"
                  stroke="hsl(25, 85%, 55%)" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(25, 85%, 55%)", r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
                <Line 
                  type="monotone" 
                  dataKey="postAfter" 
                  name="After Exercise"
                  stroke="hsl(142, 70%, 45%)" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(142, 70%, 45%)", r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StressInsightsCard;
