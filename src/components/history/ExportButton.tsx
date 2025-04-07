
import React, { useState } from "react";
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
    // Initialize PDF with A4 portrait orientation
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    
    // Add font
    doc.addFont("Nunito", "Nunito", "normal");
    doc.setFont("Nunito");
    
    // Set background with gradient (approximate using rectangles with different opacities)
    for (let i = 0; i < 20; i++) {
      const alpha = 0.02 + (i * 0.005);
      doc.setFillColor(173, 216, 230, alpha); // Light blue
      doc.rect(0, i * (297/20), 210, 297/20, "F");
    }
    
    // HEADER SECTION
    // Add OXIA logo
    const logoData = "/lovable-uploads/2537215b-9aaa-455a-9557-b82a0a16a948.png";
    doc.addImage(logoData, "PNG", 75, 15, 60, 25);
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(41, 82, 156); // Blue text accent
    doc.text("Breathing Session Report", 105, 55, { align: "center" });
    
    // Date range
    let dateText = "All Sessions";
    if (exportType === "custom" && dateRange.from && dateRange.to) {
      dateText = `${format(dateRange.from, "MMMM d")}–${format(dateRange.to, "d, yyyy")}`;
    }
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(dateText, 105, 63, { align: "center" });
    
    // Inspirational subheading
    doc.setFontSize(12);
    doc.setTextColor(120, 120, 120);
    doc.text("Every breath counts.", 105, 70, { align: "center" });
    
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
    
    // SUMMARY BLOCK - Create white card effect
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 85, 180, 60, 5, 5, "F");
    
    // Draw summary boxes (2x2 grid)
    const drawStatBox = (x: number, y: number, title: string, value: string) => {
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, y, 80, 20, 3, 3, "F");
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(title, x + 40, y + 7, { align: "center" });
      
      doc.setFontSize(14);
      doc.setTextColor(41, 82, 156);
      doc.text(value, x + 40, y + 16, { align: "center" });
    };
    
    drawStatBox(25, 95, "TOTAL SESSIONS", totalSessions.toString());
    drawStatBox(115, 95, "TOTAL BREATHS", totalBreaths.toString());
    drawStatBox(25, 125, "TOTAL TIME", formatTime(totalTime));
    drawStatBox(115, 125, "AVERAGE DURATION", formatTime(Math.round(avgSessionDuration)));
    
    // PROGRESS VISUAL - Simple circular chart
    if (filteredSessions.length > 1) {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, 155, 180, 70, 5, 5, "F");
      doc.setFontSize(14);
      doc.setTextColor(41, 82, 156);
      doc.text("Your Breathing Journey", 105, 170, { align: "center" });
      
      // Get last 5 sessions for visualization
      const recentSessions = filteredSessions.slice(0, Math.min(5, filteredSessions.length)).reverse();
      
      // Draw simple bar chart of session durations
      const barWidth = 25;
      const maxHeight = 40;
      const startX = 40;
      const startY = 210;
      const gap = 10;
      const maxDuration = Math.max(...recentSessions.map(s => s.totalDuration));
      
      recentSessions.forEach((session, index) => {
        const barHeight = (session.totalDuration / maxDuration) * maxHeight;
        const x = startX + (index * (barWidth + gap));
        
        // Draw bar
        const hue = 200 + (index * 10); // Shift from blue to turquoise
        doc.setFillColor(41, 82, 156, 0.7 - (index * 0.1));
        doc.roundedRect(x, startY - barHeight, barWidth, barHeight, 2, 2, "F");
        
        // Draw date label
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(format(new Date(session.date), "MMM d"), x + (barWidth / 2), startY + 8, { align: "center" });
      });
    }
    
    // SESSION TABLE
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 235, 180, 0, 5, 5, "F"); // Height will be adjusted by autoTable
    
    doc.setFontSize(14);
    doc.setTextColor(41, 82, 156);
    doc.text("Session Details", 105, 245, { align: "center" });
    
    const tableColumns = [
      "Date", "Time", "Breath Pattern", "Repetitions", "Breaths", "Duration"
    ];
    
    const tableData = filteredSessions.map((session) => {
      const date = new Date(session.date);
      return [
        format(date, "MMM d, yyyy"),
        format(date, "h:mm a"),
        `${4}s-${session.holdDuration}s-${4}s`, // Assuming standard inhale/exhale of 4s
        session.repetitions.toString(),
        session.breathCount.toString(),
        formatTime(session.totalDuration),
      ];
    });
    
    autoTable(doc, {
      startY: 255,
      head: [tableColumns],
      body: tableData,
      theme: "grid",
      headStyles: { 
        fillColor: [63, 131, 193],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
      },
      styles: {
        overflow: "linebreak",
        cellWidth: "auto",
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
      },
    });
    
    // FOOTER
    const finalY = (doc as any).lastAutoTable.finalY || 270;
    
    // Inspirational quote
    doc.setFillColor(248, 250, 252, 0.7);
    doc.roundedRect(30, finalY + 15, 150, 25, 5, 5, "F");
    
    doc.setFontSize(11);
    doc.setTextColor(41, 82, 156);
    doc.text("Your breath is your superpower. Keep going.", 105, finalY + 25, { align: "center" });
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Created with OXIA Breathing App • oxia.breathe", 105, finalY + 35, { align: "center" });
    
    const pdfOutput = doc.output("blob");
    const fileName = "OXIA-Breathing-Report.pdf";
    
    setShowShareOptions(true);
    
    return { blob: pdfOutput, fileName };
  };

  const handleExport = () => {
    const { blob, fileName } = generatePDF();
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Your breathing session report has been exported successfully.",
    });
    
    setOpen(false);
  };

  const handleShare = (method: "email" | "device" | "drive") => {
    const { blob, fileName } = generatePDF();
    
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
              
              <DialogFooter className="flex gap-2">
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
              
              <DialogFooter className="flex gap-2">
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
