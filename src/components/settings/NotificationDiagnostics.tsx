import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

const NotificationDiagnostics = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState("");

  const log = useCallback((msg: string, data?: any) => {
    const line = `[${new Date().toISOString()}] ${msg}${
      data !== undefined ? "\n" + JSON.stringify(data, null, 2) : ""
    }`;
    setReport((prev) => (prev ? prev + "\n\n" + line : line));
    // Also mirror to console for native logcat/view
    console.info(msg, data);
  }, []);

  const runDiagnostics = useCallback(async () => {
    setRunning(true);
    setReport("");
    try {
      log("Starting notification diagnostics");
      const platform = Capacitor.getPlatform();
      log("Platform detected", { platform });

      // Basic plugin presence
      log("Checking plugin availability", {
        hasSchedule: typeof (LocalNotifications as any).schedule === "function",
      });

      // Permissions
      const perms = await LocalNotifications.checkPermissions();
      log("Current permissions", perms);
      if (perms.display !== "granted") {
        const req = await LocalNotifications.requestPermissions();
        log("Requested permissions", req);
      }

      // Create channel on Android for reliability
      if (platform === "android") {
        try {
          await (LocalNotifications as any).createChannel?.({
            id: "oxia_reminders",
            name: "OXIA Reminders",
            description: "Breathing exercise reminders",
            importance: 5,
            vibration: true,
          });
          log("Ensured Android notification channel exists", {
            channelId: "oxia_reminders",
          });
        } catch (e) {
          log("Channel creation failed (non-fatal)", e);
        }
      }

      // Pending before
      try {
        const before = await (LocalNotifications as any).getPending?.();
        if (before) log("Pending notifications BEFORE test", before);
      } catch (e) {
        log("getPending before failed (non-fatal)", e);
      }

      // Schedule a one-off test notification in 15 seconds
      const at = new Date(Date.now() + 15000);
      const testId = Math.floor(100000 + Math.random() * 900000);
      log("Attempting to schedule one-off test notification", { at, testId });

      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: testId,
              title: "OXIA Test Notification",
              body: "This is a diagnostic test. You should see this in ~15s.",
              schedule: { at },
              smallIcon: "ic_launcher",
              channelId: platform === "android" ? "oxia_reminders" : undefined,
            },
          ],
        });
        log("Successfully scheduled test notification");
      } catch (e: any) {
        log("Scheduling FAILED", { message: e?.message, stack: e?.stack, raw: e });
        toast({
          title: "Diagnostics",
          description: "Scheduling failed — details captured below.",
          variant: "destructive",
        });
      }

      // Pending after
      try {
        const after = await (LocalNotifications as any).getPending?.();
        if (after) log("Pending notifications AFTER test", after);
      } catch (e) {
        log("getPending after failed (non-fatal)", e);
      }

      // Auto-cleanup after 60s
      setTimeout(async () => {
        try {
          await LocalNotifications.cancel({ notifications: [{ id: testId }] });
          log("Cleaned up test notification", { id: testId });
        } catch (e) {
          log("Cleanup failed (non-fatal)", e);
        }
      }, 60000);

      toast({ title: "Diagnostics complete", description: "Copy and share the report." });
      setOpen(true);
    } catch (e: any) {
      log("Diagnostics crashed", { message: e?.message, stack: e?.stack });
      toast({ title: "Diagnostics error", description: e?.message || "Unknown error", variant: "destructive" });
      setOpen(true);
    } finally {
      setRunning(false);
    }
  }, [log, toast]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(report);
      toast({ title: "Copied", description: "Diagnostics report copied to clipboard." });
    } catch (e) {
      toast({ title: "Copy failed", description: "Select and copy manually.", variant: "destructive" });
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-700">Having issues with reminders?</p>
          <p className="text-xs text-gray-500">Run diagnostics to collect a detailed report.</p>
        </div>
        <Button onClick={runDiagnostics} disabled={running}>
          {running ? "Running..." : "Run diagnostics"}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span className="sr-only">Open diagnostics</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification diagnostics</DialogTitle>
            <DialogDescription>Copy and share this report so we can investigate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea readOnly value={report} className="h-64 font-mono text-xs" />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
              <Button onClick={copyToClipboard}>Copy report</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationDiagnostics;
