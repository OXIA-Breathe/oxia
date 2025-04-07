
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download, FileText, Mail } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { BreathSession } from "@/types/breath";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "@/hooks/use-toast";

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

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add OXIA logo
    const imgData = "/lovable-uploads/2537215b-9aaa-455a-9557-b82a0a16a948.png";
    doc.addImage(imgData, "PNG", 15, 10, 60, 25);
    
    // Title
    doc.setFontSize(20);
    doc.text("Breathing Session History", 15, 50);
    
    // Filter sessions based on date range if custom is selected
    let filteredSessions = sessions;
    if (exportType === "custom" && dateRange.from && dateRange.to) {
      const fromDate = dateRange.from.setHours(0, 0, 0, 0);
      const toDate = dateRange.to.setHours(23, 59, 59, 999);
      
      filteredSessions = sessions.filter((session) => {
        const sessionDate = new Date(session.date).getTime();
        return sessionDate >= fromDate && sessionDate <= toDate;
      });
    }
    
    // Calculate summary statistics
    const totalSessions = filteredSessions.length;
    const totalBreaths = filteredSessions.reduce((acc, s) => acc + s.breathCount, 0);
    const totalTime = filteredSessions.reduce((acc, s) => acc + s.totalDuration, 0);
    const avgSessionDuration = totalSessions ? totalTime / totalSessions : 0;
    
    // Add summary section
    doc.setFontSize(14);
    doc.text("Summary", 15, 60);
    doc.setFontSize(12);
    doc.text(`Total Sessions: ${totalSessions}`, 15, 70);
    doc.text(`Total Breaths Taken: ${totalBreaths}`, 15, 78);
    doc.text(`Total Session Time: ${formatTime(totalTime)}`, 15, 86);
    doc.text(`Average Session Duration: ${formatTime(Math.round(avgSessionDuration))}`, 15, 94);
    
    if (exportType === "custom" && dateRange.from && dateRange.to) {
      doc.text(
        `Date Range: ${format(dateRange.from, "MMMM d, yyyy")} - ${format(dateRange.to, "MMMM d, yyyy")}`,
        15,
        102
      );
    }
    
    // Add sessions table
    const tableData = filteredSessions.map((session) => [
      format(new Date(session.date), "MMM d, yyyy h:mm a"),
      session.repetitions.toString(),
      session.holdDuration.toString() + "s",
      session.breathCount.toString(),
      formatTime(session.totalDuration),
    ]);
    
    autoTable(doc, {
      startY: 110,
      head: [["Date", "Repetitions", "Hold Duration", "Breaths", "Total Time"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [123, 104, 238] },
    });
    
    // Save the PDF
    const pdfOutput = doc.output("blob");
    const fileName = "OXIA-Breathing-Sessions.pdf";
    
    setShowShareOptions(true);
    
    return { blob: pdfOutput, fileName };
  };

  const handleExport = () => {
    const { blob, fileName } = generatePDF();
    
    // Save to device by default
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Your breathing sessions have been exported successfully.",
    });
  };

  const handleShare = (method: "email" | "device" | "drive") => {
    const { blob, fileName } = generatePDF();
    
    if (method === "email") {
      // Open email client with attachment (this is just a demo as browsers can't attach files to mailto links)
      toast({
        title: "Email option selected",
        description: "This would integrate with an email sending service in a production app.",
      });
      
      // In a real app, we would use a server endpoint to send the email with the attachment
    } else if (method === "device") {
      // Save to device
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Saved to device",
        description: "Your breathing sessions have been saved to your device.",
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
        <DialogContent className="sm:max-w-[425px]">
          {!showShareOptions ? (
            <>
              <DialogHeader>
                <DialogTitle>Export Session History</DialogTitle>
                <DialogDescription>
                  Choose which sessions you want to export to PDF.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={exportType === "full" ? "default" : "outline"}
                    onClick={() => setExportType("full")}
                  >
                    Full History
                  </Button>
                  <Button
                    variant={exportType === "custom" ? "default" : "outline"}
                    onClick={() => setExportType("custom")}
                  >
                    Custom Range
                  </Button>
                </div>
                
                {exportType === "custom" && (
                  <div className="grid gap-2">
                    <div className="flex gap-2">
                      <div className="grid gap-1 flex-1">
                        <label htmlFor="from" className="text-sm">
                          From
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="from"
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateRange.from && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.from ? (
                                format(dateRange.from, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateRange.from}
                              onSelect={(date) =>
                                setDateRange((prev) => ({ ...prev, from: date }))
                              }
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="grid gap-1 flex-1">
                        <label htmlFor="to" className="text-sm">
                          To
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="to"
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateRange.to && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.to ? (
                                format(dateRange.to, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateRange.to}
                              onSelect={(date) =>
                                setDateRange((prev) => ({ ...prev, to: date }))
                              }
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleExport}
                  disabled={exportType === "custom" && (!dateRange.from || !dateRange.to)}
                >
                  Export
                </Button>
              </DialogFooter>
            </>
          ) : (
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
                  onClick={() => handleShare("email")}
                >
                  <Mail className="h-4 w-4" />
                  Send to therapist via email
                </Button>
                <Button 
                  variant="outline" 
                  className="flex justify-start gap-2" 
                  onClick={() => handleShare("device")}
                >
                  <Download className="h-4 w-4" />
                  Save to device
                </Button>
                <Button 
                  variant="outline" 
                  className="flex justify-start gap-2" 
                  onClick={() => handleShare("drive")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M12.01 1.485c-2.082 0-3.825 1.066-4.981 2.4h.003l5.089 8.783 4.979-8.784h-.002c-1.156-1.334-2.898-2.4-4.98-2.4h-.109zm-5.036 2.51c-.69.947-1.16 2.055-1.346 3.273h.003l5.088 8.788 2.553-4.414L8.555 4.4a7.086 7.086 0 00-1.58-.405zm10.081 0c-.58.107-1.121.239-1.609.404l-2.717 4.775 2.554 4.414 5.089-8.788h.003c-.186-1.218-.656-2.326-1.345-3.273l-.001-.005.026.473zM5.618 7.38C5.618 8.514 5.706 9.6 5.8 10.638l2.56 4.424h10.082l2.556-4.421h.003c.093-1.04.181-2.125.181-3.26 0-.473-.181-.934-.237-1.394h-.004L15.862 15.2v.001H8.14v-.003l-5.078-8.795c-.057.46-.237.92-.237 1.394 0 .473.113.934.199 1.394l2.593-1.81h.001z" />
                    <path d="M5.8 10.638l2.34 4.425 2.556-4.421-2.556-4.427L5.8 10.638zm5.079.003l2.554 4.421h5.142l-2.556-4.421h-5.14zm0-8.783l2.554 4.39h5.142l-2.556-4.39h-5.14zm-5.08 0l2.555 4.39h5.142l-2.556-4.39H5.8z" />
                  </svg>
                  Export to Google Drive
                </Button>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowShareOptions(false)}>
                  Back
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportButton;
