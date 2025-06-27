
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings2 } from "lucide-react";

const SettingsForm = () => {
  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Breathing Settings
        </CardTitle>
        <CardDescription>
          Breathing exercise settings have been moved to the Breathe page
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          You can now customize your breathing exercises and choose from different techniques on the Breathe page.
        </p>
        <Link to="/breathe">
          <Button className="w-full">
            Go to Breathing Exercises
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SettingsForm;
