
import { History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SessionHistoryStatesProps {
  isLoading?: boolean;
  isEmpty?: boolean;
  selectedDate?: Date;
}

export const LoadingState = () => (
  <Card className="w-full max-w-3xl mx-auto shadow-md">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2">
        <History className="h-5 w-5 text-breath" />
        <span className="text-foreground">Loading sessions...</span>
      </CardTitle>
    </CardHeader>
  </Card>
);

export const EmptyState = () => (
  <Card className="w-full max-w-3xl mx-auto shadow-md">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2">
        <History className="h-5 w-5 text-breath" />
        <span className="text-foreground">My Sessions</span>
      </CardTitle>
      <CardDescription className="text-muted-foreground">
        View and export your breathing sessions
      </CardDescription>
    </CardHeader>
    <CardContent className="text-center text-muted-foreground">
      Complete a breathing session to see your history
    </CardContent>
  </Card>
);

export const NoSessionsForDateState = ({ selectedDate }: { selectedDate: Date }) => (
  <div className="text-center p-8 text-muted-foreground">
    No breathing sessions found for {selectedDate.toLocaleDateString()}.
  </div>
);
