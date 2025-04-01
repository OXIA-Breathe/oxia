
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

interface ActivityCalendarProps {
  activityDates: Date[];
}

export const ActivityCalendar = ({ activityDates }: ActivityCalendarProps) => {
  return (
    <Card className="border-none shadow-md bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-breath-dark">
          <CalendarIcon className="h-5 w-5" />
          Activity Calendar
        </CardTitle>
        <CardDescription>
          Days with breathing sessions are highlighted
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="multiple"
          selected={activityDates}
          className="rounded-md"
          disabled={date => date > new Date()}
          classNames={{
            day_selected: "bg-breath text-white hover:bg-breath-dark hover:text-white p-3",
            day_today: "bg-accent text-accent-foreground",
            day: "rounded-full transition-colors p-2 mx-0.5"
          }}
        />
        <p className="text-sm text-muted-foreground mt-4">
          Highlighted days show your completed breathing sessions
        </p>
      </CardContent>
    </Card>
  );
};
