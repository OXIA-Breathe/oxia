
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
    <div className="w-full max-w-md">
      <div className="flex flex-col space-y-3 w-full">
        <div className="flex flex-row space-x-3 w-full">
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
        </div>
        
        <StatsCard
          label="Time elapsed"
          value={formatTime(timeElapsed)}
          fullWidth
        />
      </div>
    </div>
  );
};

export default BreathingStats;
