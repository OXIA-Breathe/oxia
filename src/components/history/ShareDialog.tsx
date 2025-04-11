
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Mail } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ShareDialogProps {
  onShare: (method: "email" | "device") => void;
  onBack: () => void;
  isGenerating?: boolean;
  onEmailSubmit?: (email: string, message: string) => void;
}

const ShareDialog = ({ onShare, onBack, isGenerating = false, onEmailSubmit }: ShareDialogProps) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  
  const handleEmailOptionClick = () => {
    setShowEmailForm(true);
  };
  
  const handleSendEmail = () => {
    if (onEmailSubmit && recipientEmail) {
      onEmailSubmit(recipientEmail, emailMessage);
    }
  };
  
  return (
    <DialogContent className="sm:max-w-[425px]">
      {!showEmailForm ? (
        <>
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
              onClick={handleEmailOptionClick}
              disabled={isGenerating}
            >
              <Mail className="h-4 w-4" />
              Send to therapist via email
            </Button>
            <Button 
              variant="outline" 
              className="flex justify-start gap-2" 
              onClick={() => onShare("device")}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isGenerating ? "Generating PDF..." : "Save to device"}
            </Button>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={onBack} disabled={isGenerating}>
              Back
            </Button>
          </DialogFooter>
        </>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>Send PDF Report via Email</DialogTitle>
            <DialogDescription>
              Enter the recipient's email address and an optional message.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient's Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="therapist@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Optional Message</Label>
              <Textarea
                id="message"
                placeholder="Here's my breathing report..."
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter className="flex gap-2 flex-col sm:flex-row">
            <Button 
              variant="outline" 
              onClick={() => setShowEmailForm(false)}
              disabled={isGenerating}
            >
              Back
            </Button>
            <Button 
              onClick={handleSendEmail}
              disabled={!recipientEmail || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  );
};

export default ShareDialog;
