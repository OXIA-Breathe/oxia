import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AddNotificationCardProps {
  onClick: () => void;
}

const AddNotificationCard = ({ onClick }: AddNotificationCardProps) => {
  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm border-dashed border-2 border-breath/30 hover:border-breath/50"
      onClick={onClick}
    >
      <div className="flex items-center justify-center space-x-3 text-breath">
        <Plus className="h-6 w-6" />
        <span className="text-lg font-medium">Add a new notification</span>
      </div>
    </Card>
  );
};

export default AddNotificationCard;