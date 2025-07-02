
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

interface ActivityCalendarProps {
  activityDates: Date[];
  onDateSelect?: (date: Date | undefined) => void;
  selectedDate?: Date;
}

export const ActivityCalendar = ({ activityDates, onDateSelect, selectedDate }: ActivityCalendarProps) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onDateSelect?.(undefined);
      return;
    }
    
    // If clicking the same date that's already selected, deselect it
    if (selectedDate && selectedDate.toDateString() === date.toDateString()) {
      onDateSelect?.(undefined);
      return;
    }
    
    // Check if the selected date has activity
    const hasActivity = activityDates.some(activityDate => 
      activityDate.toDateString() === date.toDateString()
    );
    
    // Only allow selection if the date has activity
    if (hasActivity) {
      onDateSelect?.(date);
    }
  };

  return (
    <Card className="border-none shadow-md bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-breath" />
          <span className="text-gray-800">Activity Calendar</span>
        </CardTitle>
        <CardDescription className="text-gray-600">
          Click on highlighted days to filter sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md"
          disabled={date => date > new Date()}
          modifiers={{
            hasActivity: activityDates
          }}
          modifiersClassNames={{
            hasActivity: "bg-breath/20 text-breath font-semibold hover:bg-breath/30 cursor-pointer",
            selected: "bg-breath text-white hover:bg-breath-dark hover:text-white"
          }}
          classNames={{
            day_today: "bg-accent text-accent-foreground border border-accent-foreground/20",
            day: "rounded-full transition-colors p-2 mx-0.5 hover:bg-accent/50",
            day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed"
          }}
        />
        <p className="text-sm text-gray-600 mt-4">
          {selectedDate 
            ? `Showing sessions for ${selectedDate.toLocaleDateString()}`
            : "Highlighted days show your completed breathing sessions. Click to filter."
          }
        </p>
      </CardContent>
    </Card>
  );
};
