import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useLocalNotifications } from "@/hooks/useLocalNotifications";

export function NotificationDebugPanel() {
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { getPendingNotifications } = useLocalNotifications();

  const captureDebugInfo = async () => {
    setIsRefreshing(true);
    try {
      const pending = await getPendingNotifications();
      
      const info = {
        timestamp: new Date().toISOString(),
        currentTime: new Date().toLocaleString(),
        pendingNotifications: pending.map((n: any) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          schedule: n.schedule,
        })),
        totalPending: pending.length,
      };

      const formatted = JSON.stringify(info, null, 2);
      setDebugInfo(formatted);
      console.info("📊 Notification Debug Info:", info);
    } catch (error) {
      console.error("Error capturing debug info:", error);
      setDebugInfo(`Error: ${error}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    captureDebugInfo();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(debugInfo);
    toast.success("Debug info copied to clipboard");
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Notification Debug Info</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={captureDebugInfo}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!debugInfo}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs max-h-96 overflow-y-auto">
          {debugInfo || "Loading..."}
        </pre>
      </CardContent>
    </Card>
  );
}
