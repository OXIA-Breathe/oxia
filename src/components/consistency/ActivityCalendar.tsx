
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

interface ActivityCalendarProps {
  activityDates: Date[];
}

export const ActivityCalendar = ({ activityDates }: ActivityCalendarProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
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
          className="rounded-md border"
          disabled={date => date > new Date()}
        />
        <p className="text-sm text-muted-foreground mt-4">
          Highlighted days show your completed breathing sessions
        </p>
      </CardContent>
    </Card>
  );
};
