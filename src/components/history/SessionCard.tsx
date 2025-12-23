import { useState } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreathSession } from "@/types/breath";
import { formatTime } from "./utils/formatTime";
import { Edit, Trash2, ChevronDown, ChevronUp, Heart, Activity, ArrowRight } from "lucide-react";
import { getMoodConfig, getStressLabel, getStressColor } from "@/constants/emotionConfig";

interface SessionCardProps {
  session: BreathSession;
  onModify: (session: BreathSession) => void;
  onDelete: (session: BreathSession) => void;
}

const SessionCard = ({ session, onModify, onDelete }: SessionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasEmotionData =
    session.emotionData && (session.emotionData.preValence !== null || session.emotionData.postValence !== null);

  const preMood = session.emotionData?.preValence ? getMoodConfig(session.emotionData.preValence) : null;
  const postMood = session.emotionData?.postValence ? getMoodConfig(session.emotionData.postValence) : null;

  const handleCardClick = () => {
    if (hasEmotionData) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Card
      className={`overflow-hidden hover:bg-accent/50 transition-colors ${hasEmotionData ? "cursor-pointer" : ""}`}
      onClick={handleCardClick}
    >
      {/* Main card content */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-base">{session.exerciseTitle || "Breathing Exercise"}</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onModify(session);
                  }}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session);
                  }}
                  className="h-8 w-8 p-0 hover:bg-gray-100 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {format(new Date(session.date), "MMMM d, yyyy")}
              <span>•</span>
              {format(new Date(session.date), "h:mm a")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <p className="text-xs text-muted-foreground">Breaths</p>
            <p className="font-semibold">{session.breathCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Time</p>
            <p className="font-semibold">{formatTime(session.totalDuration)}</p>
          </div>
        </div>

        {/* Expand indicator - only show if there's emotion data */}
        {hasEmotionData && (
          <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground">
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>Tap to hide emotion data</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                <span>Tap to see emotion data</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Expanded emotion data section */}
      {isExpanded && hasEmotionData && (
        <div className="p-4 border-t" style={getGradientStyle()}>
          <div className="space-y-4">
            {/* Mood comparison */}
            {preMood && postMood && (
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-rose-400" />
                  <span className="text-sm font-medium">Mood</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <img src={preMood.icon} alt={preMood.label} className="w-10 h-10" />
                    <span className="text-xs" style={{ color: preMood.color }}>
                      {preMood.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">Before</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="flex flex-col items-center gap-1">
                    <img src={postMood.icon} alt={postMood.label} className="w-10 h-10" />
                    <span className="text-xs" style={{ color: postMood.color }}>
                      {postMood.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">After</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stress comparison */}
            {session.emotionData?.preStress !== null && session.emotionData?.postStress !== null && (
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Stress Level</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className="text-xl font-bold"
                      style={{ color: getStressColor(session.emotionData.preStress!) }}
                    >
                      {session.emotionData.preStress}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getStressLabel(session.emotionData.preStress!)}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1">Before</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="flex flex-col items-center">
                    <span
                      className="text-xl font-bold"
                      style={{ color: getStressColor(session.emotionData.postStress!) }}
                    >
                      {session.emotionData.postStress}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getStressLabel(session.emotionData.postStress!)}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1">After</span>
                  </div>
                </div>
              </div>
            )}

            {/* Note */}
            {session.emotionData?.note && (
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Note</p>
                <p className="text-sm">{session.emotionData.note}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default SessionCard;
