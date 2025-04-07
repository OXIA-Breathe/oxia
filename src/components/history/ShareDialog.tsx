
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShareDialogProps {
  onShare: (method: "email" | "device" | "drive") => void;
  onBack: () => void;
}

const ShareDialog = ({ onShare, onBack }: ShareDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Share PDF Report</DialogTitle>
        <DialogDescription>
          Choose how you want to share your session history.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <Button 
          variant="outline" 
          className="flex justify-start gap-2" 
          onClick={() => onShare("email")}
        >
          <Mail className="h-4 w-4" />
          Send to therapist via email
        </Button>
        <Button 
          variant="outline" 
          className="flex justify-start gap-2" 
          onClick={() => onShare("device")}
        >
          <Download className="h-4 w-4" />
          Save to device
        </Button>
        <Button 
          variant="outline" 
          className="flex justify-start gap-2" 
          onClick={() => onShare("drive")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M12.01 1.485c-2.082 0-3.825 1.066-4.981 2.4h.003l5.089 8.783 4.979-8.784h-.002c-1.156-1.334-2.898-2.4-4.98-2.4h-.109zm-5.036 2.51c-.69.947-1.16 2.055-1.346 3.273h.003l5.088 8.788 2.553-4.414L8.555 4.4a7.086 7.086 0 00-1.58-.405zm10.081 0c-.58.107-1.121.239-1.609.404l-2.717 4.775 2.554 4.414 5.089-8.788h.003c-.186-1.218-.656-2.326-1.345-3.273l-.001-.005.026.473zM5.618 7.38C5.618 8.514 5.706 9.6 5.8 10.638l2.56 4.424h10.082l2.556-4.421h.003c.093-1.04.181-2.125.181-3.26 0-.473-.181-.934-.237-1.394h-.004L15.862 15.2v.001H8.14v-.003l-5.078-8.795c-.057.46-.237.92-.237 1.394 0 .473.113.934.199 1.394l2.593-1.81h.001z" />
            <path d="M5.8 10.638l2.34 4.425 2.556-4.421-2.556-4.427L5.8 10.638zm5.079.003l2.554 4.421h5.142l-2.556-4.421h-5.14zm0-8.783l2.554 4.39h5.142l-2.556-4.39h-5.14zm-5.08 0l2.555 4.39h5.142l-2.556-4.39H5.8z" />
          </svg>
          Export to Google Drive
        </Button>
      </div>
      
      <DialogFooter className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ShareDialog;
