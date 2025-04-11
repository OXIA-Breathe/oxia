
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
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

interface ExportDialogProps {
  exportType: "full" | "custom";
  setExportType: React.Dispatch<React.SetStateAction<"full" | "custom">>;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: React.Dispatch<
    React.SetStateAction<{
      from: Date | undefined;
      to: Date | undefined;
    }>
  >;
  onExport: () => Promise<any>;
  onCancel: () => void;
  isGenerating: boolean;
}

const ExportDialog = ({
  exportType,
  setExportType,
  dateRange,
  setDateRange,
  onExport,
  onCancel,
  isGenerating,
}: ExportDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
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
            disabled={isGenerating}
          >
            Full History
          </Button>
          <Button
            variant={exportType === "custom" ? "default" : "outline"}
            onClick={() => setExportType("custom")}
            disabled={isGenerating}
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
                      disabled={isGenerating}
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
                      disabled={isGenerating}
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
        <Button variant="outline" onClick={onCancel} disabled={isGenerating}>
          Cancel
        </Button>
        <Button 
          onClick={onExport}
          disabled={isGenerating || (exportType === "custom" && (!dateRange.from || !dateRange.to))}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Export"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ExportDialog;
