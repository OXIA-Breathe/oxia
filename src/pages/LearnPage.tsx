
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Lightbulb, Brain, Wind, Heart } from "lucide-react";
import { useState } from "react";
import FeedbackModal from "@/components/learn/FeedbackModal";
import SignInEmptyState from "@/components/layout/SignInEmptyState";

const LearnPage = () => {
  const { user, isLoading } = useAuth();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const pageContent = (
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
            <Lightbulb className="h-5 w-5 text-accent-foreground" />
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
  );

  const mockPreview = (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Mock article cards */}
      {[
        { icon: Brain, title: "How Breathing Affects Your Nervous System", desc: "Learn how controlled breathing activates the parasympathetic response and reduces cortisol." },
        { icon: Wind, title: "The Science Behind Box Breathing", desc: "Discover why Navy SEALs use this technique to stay calm under extreme pressure." },
        { icon: Heart, title: "Breath & Emotional Regulation", desc: "Understand the connection between your breathing patterns and emotional states." },
      ].map(({ icon: Icon, title, desc }) => (
        <Card key={title} className="border-none shadow-md bg-card">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">5 min read</span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Beginner</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <MainLayout>
      <div className="container pt-24 pb-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-foreground">Learning Resources</h1>
        <p className="text-center text-muted-foreground mb-8">
          Expand your understanding of why conscious breathing transforms your life.
        </p>
        
        {!isLoading && !user ? (
          <SignInEmptyState
            title="Unlock Learning Content"
            description="Sign in to access articles, guided insights, and expert-backed explanations about breathing techniques."
          >
            {mockPreview}
          </SignInEmptyState>
        ) : (
          pageContent
        )}
      </div>
      
      <FeedbackModal 
        open={isFeedbackModalOpen} 
        onOpenChange={setIsFeedbackModalOpen}
      />
    </MainLayout>
  );
};

export default LearnPage;
