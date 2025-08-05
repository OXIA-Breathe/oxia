import { Trash2, Settings, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NotificationSchedule {
  id: string;
  title: string;
  time: string;
  days: number[];
}

interface NotificationCardProps {
  notification: NotificationSchedule;
  onEdit: (notification: NotificationSchedule) => void;
  onDelete: (id: string) => void;
}

const NotificationCard = ({ notification, onEdit, onDelete }: NotificationCardProps) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getDaysText = () => {
    if (notification.days.length === 7) {
      return 'Every day';
    }
    return notification.days
      .sort((a, b) => a - b)
      .map(day => dayNames[day])
      .join(', ');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleCardClick = () => {
    onEdit(notification);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-shrink-0 flex items-center justify-center">
            <Clock className="h-8 w-8 text-breath" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {notification.title.length > 8 
                ? `${notification.title.slice(0, 5)}...` 
                : notification.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {getDaysText()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-800">
              {formatTime(notification.time)}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4 text-gray-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit notification settings</p>
              </TooltipContent>
            </Tooltip>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationCard;