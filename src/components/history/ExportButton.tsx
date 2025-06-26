
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { BreathSession } from "@/types/breath";
import { toast } from "@/hooks/use-toast";
import { generatePDF } from "./utils/pdfGenerator";
import ExportDialog from "./ExportDialog";
import ShareDialog from "./ShareDialog";

interface ExportButtonProps {
  sessions: BreathSession[];
}

const ExportButton = ({ sessions }: ExportButtonProps) => {
  const [open, setOpen] = useState(false);
  const [exportType, setExportType] = useState<"full" | "custom">("full");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    try {
      // No longer generating PDF here, just proceed to share options
      setShowShareOptions(true);
      return true;
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "There was a problem. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleShare = async (method: "email" | "device") => {
    try {
      if (method === "device") {
        // Generate PDF only when "Save to device" is selected
        setIsGenerating(true);
        
        const result = await generatePDF({
          sessions,
          dateRange,
          exportType
        });
        
        if (!result) {
          throw new Error("Failed to generate PDF");
        }
        
        const { blob, fileName } = result;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        
        toast({
          title: "Saved to device",
          description: "Your breathing session report has been saved to your device.",
        });
        
        setIsGenerating(false);
        setShowShareOptions(false);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      toast({
        title: "Error sharing PDF",
        description: "There was a problem sharing your report. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const handleEmailSubmit = async (email: string, message: string) => {
    try {
      setIsGenerating(true);
      
      // Generate PDF for email
      const result = await generatePDF({
        sessions,
        dateRange,
        exportType
      });
      
      if (!result) {
        throw new Error("Failed to generate PDF");
      }
      
      // In a real application, you would upload this PDF to a server and send via email API
      // For now, we'll just simulate the email sending
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Email sent",
        description: `Your breathing report has been sent to ${email}.`,
      });
      
      setIsGenerating(false);
      setShowShareOptions(false);
      setOpen(false);
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error sending email",
        description: "There was a problem sending your report. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline"
        className="flex items-center gap-2" 
        onClick={() => setOpen(true)}
      >
        <FileText className="h-4 w-4" />
        Export
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        {!showShareOptions ? (
          <ExportDialog
            exportType={exportType}
            setExportType={setExportType}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onExport={handleExport}
            onCancel={() => setOpen(false)}
            isGenerating={isGenerating}
          />
        ) : (
          <ShareDialog
            onShare={handleShare}
            onBack={() => setShowShareOptions(false)}
            isGenerating={isGenerating}
            onEmailSubmit={handleEmailSubmit}
          />
        )}
      </Dialog>
    </>
  );
};

export default ExportButton;
