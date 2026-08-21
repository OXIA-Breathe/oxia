import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NotificationSchedule {
  id: string;
  title: string;
  time: string;
  days: number[];
}

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification?: NotificationSchedule;
  onSave: (notification: Omit<NotificationSchedule, 'id'> & { id?: string }) => void;
}

const NotificationModal = ({ open, onOpenChange, notification, onSave }: NotificationModalProps) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (notification) {
      setTitle(notification.title);
      setTime(notification.time);
      setSelectedDays(notification.days);
    } else {
      setTitle("");
      setTime("09:00");
      setSelectedDays([]);
    }
  }, [notification, open]);

  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const handleSave = () => {
    if (title.trim() && selectedDays.length > 0) {
      onSave({
        id: notification?.id,
        title: title.trim(),
        time,
        days: selectedDays
      });
      onOpenChange(false);
    }
  };

  const isFormValid = title.trim() && selectedDays.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {notification ? 'Edit Notification' : 'Add New Notification'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Time Picker */}
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Days Selection */}
          <div className="space-y-3">
            <Label>Days</Label>
            <div className="flex justify-between gap-2">
              {dayNames.map((day, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={selectedDays.includes(index) ? "default" : "outline"}
                  size="sm"
                  className={`h-10 w-10 rounded-full p-0 ${
                    selectedDays.includes(index)
                      ? "bg-breath hover:bg-breath/90 text-foreground"
                      : "border-gray-300 hover:border-breath hover:text-breath"
                  }`}
                  onClick={() => toggleDay(index)}
                  title={fullDayNames[index]}
                >
                  {day}
                </Button>
              ))}
            </div>
            {selectedDays.length === 0 && (
              <p className="text-sm text-red-500">Please select at least one day</p>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter notification title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSave}
            disabled={!isFormValid}
            className="w-full"
          >
            Save Notification
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;