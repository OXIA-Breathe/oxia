
import { StatsCard } from "@/components/ui/card";

interface BreathingStatsProps {
  currentRepetition: number;
  totalRepetitions: number;
  breathCount: number;
  timeElapsed: number;
}

const BreathingStats = ({ 
  currentRepetition, 
  totalRepetitions, 
  breathCount, 
  timeElapsed 
}: BreathingStatsProps) => {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-[min(90vw,28rem)] px-4">
      <div className="flex flex-row gap-2 sm:gap-3 w-full">
        <StatsCard
          label="Reps"
          value={`${currentRepetition}/${totalRepetitions}`}
          className="flex-1"
        />
        <StatsCard
          label="Breaths"
          value={breathCount}
          className="flex-1"
        />
        <StatsCard
          label="Time"
          value={formatTime(timeElapsed)}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default BreathingStats;
