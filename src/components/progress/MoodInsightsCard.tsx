import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import TimeFilterSelect from "./TimeFilterSelect";
import InsufficientDataOverlay from "./InsufficientDataOverlay";
import { useEmotionalStatistics, processMoodData, calculateMoodSummary } from "@/hooks/useEmotionalStatistics";
import { usePersistedTimeFilter } from "@/hooks/usePersistedTimeFilter";

const MoodInsightsCard = () => {
  const { filter, setFilter, customRange, setCustomRange } = usePersistedTimeFilter();
  
  const { records, isLoading, hasEnoughData, uniqueDaysCount, isTrackingEnabled, isPremium } = useEmotionalStatistics(filter, customRange);
  
  const preMoodData = processMoodData(records, "pre");
  const postMoodData = processMoodData(records, "post");
  const summary = calculateMoodSummary(records);
  
  const getOverlayType = (): "premium" | "disabled" | "data" | null => {
    if (!isPremium) return "premium";
    if (!isTrackingEnabled) return "disabled";
    if (!hasEnoughData) return "data";
    return null;
  };
  
  const overlayType = getOverlayType();
  
  const getMoodTrendIcon = () => {
    if (summary.moodImprovement > 0.5) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (summary.moodImprovement < -0.5) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };
  
  const getMostCommonMood = (data: typeof preMoodData) => {
    if (data.length === 0) return null;
    return data.reduce((prev, current) => (prev.count > current.count ? prev : current));
  };
  
  const preMostCommon = getMostCommonMood(preMoodData);
  const postMostCommon = getMostCommonMood(postMoodData);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = payload[0].payload.total || preMoodData.reduce((sum, d) => sum + d.count, 0);
      const percent = ((data.count / total) * 100).toFixed(1);
      return (
        <div className="bg-background border rounded-lg p-2 shadow-lg text-sm">
          <p className="font-medium" style={{ color: data.color }}>{data.label}</p>
          <p className="text-muted-foreground">{data.count} times ({percent}%)</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLegend = (data: typeof preMoodData) => (
    <div className="flex flex-wrap justify-center gap-2 mt-2">
      {data.map((entry) => (
        <div key={entry.mood} className="flex items-center gap-1 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="border-none shadow-md bg-white relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-400" />
            <span className="text-gray-800">Mood Insights</span>
          </CardTitle>
          <TimeFilterSelect
            value={filter}
            onChange={setFilter}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
        </div>
        <CardDescription className="text-gray-600">
          Track your emotional patterns before & after exercises
        </CardDescription>
      </CardHeader>
      <CardContent className="relative min-h-[320px]">
        {overlayType && (
          <InsufficientDataOverlay type={overlayType} daysCount={uniqueDaysCount} />
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading mood data...</p>
          </div>
        ) : (
          <div className={overlayType ? "blur-sm pointer-events-none" : ""}>
            {/* Summary Stats */}
            {preMostCommon && postMostCommon && (
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {getMoodTrendIcon()}
                    <span className="text-muted-foreground">
                      Most common: <strong style={{ color: preMostCommon.color }}>{preMostCommon.label}</strong> → <strong style={{ color: postMostCommon.color }}>{postMostCommon.label}</strong>
                    </span>
                  </div>
                  {summary.moodImprovement !== 0 && (
                    <span className={`font-medium ${summary.moodImprovement > 0 ? "text-green-600" : "text-red-600"}`}>
                      {summary.moodImprovement > 0 ? "+" : ""}{summary.moodImprovement.toFixed(1)} avg
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Pie Charts */}
            <div className="grid grid-cols-2 gap-4">
              {/* Before Exercise */}
              <div>
                <h4 className="text-sm font-medium text-center mb-2 text-muted-foreground">Before Exercise</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={preMoodData.map(d => ({ ...d, total: preMoodData.reduce((s, dd) => s + dd.count, 0) }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      dataKey="count"
                      paddingAngle={2}
                    >
                      {preMoodData.map((entry, index) => (
                        <Cell key={`pre-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {renderCustomLegend(preMoodData)}
              </div>

              {/* After Exercise */}
              <div>
                <h4 className="text-sm font-medium text-center mb-2 text-muted-foreground">After Exercise</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={postMoodData.map(d => ({ ...d, total: postMoodData.reduce((s, dd) => s + dd.count, 0) }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      dataKey="count"
                      paddingAngle={2}
                    >
                      {postMoodData.map((entry, index) => (
                        <Cell key={`post-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {renderCustomLegend(postMoodData)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodInsightsCard;
