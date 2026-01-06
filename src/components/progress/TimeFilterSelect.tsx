import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { TimeFilter, DateRange } from "@/hooks/useEmotionalStatistics";

interface TimeFilterSelectProps {
  value: TimeFilter;
  onChange: (filter: TimeFilter) => void;
  customRange?: DateRange;
  onCustomRangeChange?: (range: DateRange) => void;
}

const TimeFilterSelect = ({ value, onChange, customRange, onCustomRangeChange }: TimeFilterSelectProps) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [tempRange, setTempRange] = useState<{ from?: Date; to?: Date }>({
    from: customRange?.start,
    to: customRange?.end,
  });

  const handleFilterChange = (newValue: string) => {
    if (newValue === "custom") {
      setIsCustomOpen(true);
    }
    onChange(newValue as TimeFilter);
  };

  const handleApplyCustomRange = () => {
    if (tempRange.from && tempRange.to && onCustomRangeChange) {
      onCustomRangeChange({ start: tempRange.from, end: tempRange.to });
      setIsCustomOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Select value={value} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[112px] h-8 text-xs">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="quarterly">Quarterly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
          <SelectItem value="all-time">All Time</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      {value === "custom" && (
        <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs px-2">
              <CalendarIcon className="h-3 w-3" />
              {customRange?.start && customRange?.end
                ? `${format(customRange.start, "M/d")} - ${format(customRange.end, "M/d")}`
                : "Dates"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
            <Calendar
              mode="range"
              selected={
                tempRange.from
                  ? {
                      from: tempRange.from,
                      to: tempRange.to,
                    }
                  : undefined
              }
              onSelect={(range) => setTempRange({ from: range?.from, to: range?.to })}
              numberOfMonths={1}
              initialFocus
              className="p-3 pointer-events-auto"
            />
            <div className="p-3 border-t flex justify-between">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setTempRange({ from: undefined, to: undefined })}
                disabled={!tempRange.from && !tempRange.to}
              >
                Clear
              </Button>
              <Button size="sm" onClick={handleApplyCustomRange} disabled={!tempRange.from || !tempRange.to}>
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default TimeFilterSelect;
