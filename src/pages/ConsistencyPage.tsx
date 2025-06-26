
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { StreakStats } from "@/components/consistency/StreakStats";
import { ActivityCalendar } from "@/components/consistency/ActivityCalendar";
import { AchievementBadges } from "@/components/consistency/AchievementBadges";
import { InitializeTracking } from "@/components/consistency/InitializeTracking";
import SessionHistory from "@/components/history/SessionHistory";
import { useConsistencyData } from "@/hooks/useConsistencyData";

const ConsistencyPage = () => {
  const { user } = useAuth();
  const { streakData, setStreakData, activityDates, isLoading } = useConsistencyData();

  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">My Progress</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading your consistency data...</p>
          </div>
        ) : user && !streakData ? (
          <InitializeTracking onInitialized={setStreakData} />
        ) : streakData ? (
          <div className="grid gap-6 md:grid-cols-2">
            <StreakStats streakData={streakData} />
            <ActivityCalendar activityDates={activityDates} />
            
            {/* Session History placed between Activity Calendar and Achievement Badges */}
            <div className="md:col-span-2">
              <SessionHistory />
            </div>
            
            <AchievementBadges streakData={streakData} />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">
              Please log in to view your consistency data
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ConsistencyPage;
