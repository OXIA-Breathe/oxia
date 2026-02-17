
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Lightbulb } from "lucide-react";
import { useState } from "react";
import FeedbackModal from "@/components/learn/FeedbackModal";

const LearnPage = () => {
  const { user, isLoading } = useAuth();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // If not loading and no user, redirect to auth page
  if (!isLoading && !user) {
    return <Navigate to="/auth" />;
  }

  return (
    <MainLayout>
      <div className="container pt-24 pb-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center">Learning Resources</h1>
        <p className="text-center text-foreground/80 mb-8">
          Expand your understanding of why conscious breathing transforms your life.
        </p>
        
        <Card className="w-full max-w-3xl mx-auto bg-card/90 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Book className="h-5 w-5 text-breath" />
              Learning materials coming soon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-center">
              We're currently preparing high-quality educational content to help you better understand the science, psychology, and benefits of breathing techniques.
            </p>
            
            <hr className="border-border" />
            
            <div className="space-y-4">
              <p className="text-card-foreground leading-relaxed">
                In the near future, this space will grow into a knowledge hub full of bite-sized articles, guided insights, and expert-backed explanations — all designed to help you go deeper into your breathing practice and into yourself.
              </p>
              <p className="text-card-foreground leading-relaxed">
                Whether you're curious about how breath impacts the nervous system, emotional wellbeing, or energy levels — we're building it for you.
              </p>
            </div>
            
            <hr className="border-border" />
            
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Is there something specific you'd like to learn?
              </h3>
              <p className="text-muted-foreground">
                We'd love to hear from you! Let us know what breathing-related topics you're most interested in, and help shape the future of this learning space.
              </p>
              <Button 
                onClick={() => setIsFeedbackModalOpen(true)}
                className="bg-breath hover:bg-breath/90"
              >
                Send Feedback or Topic Suggestions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <FeedbackModal 
        open={isFeedbackModalOpen} 
        onOpenChange={setIsFeedbackModalOpen}
      />
    </MainLayout>
  );
};

export default LearnPage;
