
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

  const handleExport = () => {
    const result = generatePDF({
      sessions,
      dateRange,
      exportType
    });
    
    setShowShareOptions(true);
    
    return result;
  };

  const handleShare = (method: "email" | "device" | "drive") => {
    const { blob, fileName } = generatePDF({
      sessions,
      dateRange,
      exportType
    });
    
    if (method === "email") {
      toast({
        title: "Email option selected",
        description: "This would integrate with an email sending service in a production app.",
      });
      
    } else if (method === "device") {
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
    } else if (method === "drive") {
      toast({
        title: "Google Drive option selected",
        description: "This would integrate with Google Drive API in a production app.",
      });
    }
    
    setShowShareOptions(false);
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline"
        className="flex items-center gap-2" 
        onClick={() => setOpen(true)}
      >
        <FileText className="h-4 w-4" />
        Export as PDF
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
          />
        ) : (
          <ShareDialog
            onShare={handleShare}
            onBack={() => setShowShareOptions(false)}
          />
        )}
      </Dialog>
    </>
  );
};

export default ExportButton;
