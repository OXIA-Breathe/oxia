import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Hand, Wind, TrendingUp, Users, Sparkles, Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingCarouselProps {
  onComplete: () => void;
}

const OnboardingCarousel = ({ onComplete }: OnboardingCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleNext = () => {
    api?.scrollNext();
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleCreateAccount = () => {
    onComplete();
    navigate("/auth");
  };

  const handleTry = () => {
    onComplete();
  };

  const slides = [
    {
      icon: (
        <img
          src="/lovable-uploads/woman_breathing_in_the_forest.gif"
          alt="Breathing animation"
          className="w-48 h-auto object-contain rounded-lg shadow-lg"
        />
      ),
      heading: "Welcome to OXIA",
      paragraph:
        "I'm truly glad you're here — a space where breathing takes on a new meaning.\nTake a moment, breathe in deeply… and just be present.",
      showLogo: true,
    },
    {
      icon: (
        <img
          src="/lovable-uploads/breathing_exercises.gif"
          alt="Breathing exercises animation"
          className="w-48 h-auto object-contain rounded-lg shadow-lg"
        />
      ),
      heading: "Just breathe and feel the calm",
      paragraph:
        "Here you'll find a range of guided breathing practices to help you relax, focus, and restore inner balance.\nYou can also create your own — a rhythm that feels right for you.",
    },
    {
      icon: (
        <img
          src="/lovable-uploads/progress.gif"
          alt="Progress tracking animation"
          className="w-48 h-auto object-contain rounded-lg shadow-lg"
        />
      ),
      heading: "Track your journey",
      paragraph:
        "OXIA helps you notice your progress over time — your breaths, your consistency, your growth.\nEvery inhale and exhale brings you closer to clarity, calm, and mastery.",
    },
    {
      icon: (
        <img
          src="/lovable-uploads/feedback.gif"
          alt="Feedback and community animation"
          className="w-48 h-auto object-contain rounded-lg shadow-lg"
        />
      ),
      heading: "We grow together",
      paragraph:
        "Our journey is just beginning. We're constantly developing OXIA and would love for you to be part of it.\nYour feedback, ideas, and curiosity help us create something truly meaningful — for everyone's wellbeing. 💙",
    },
    {
      icon: <Sparkles className="w-16 h-16 animate-[spin_3s_linear_infinite]" />,
      heading: "Feel free to use",
      paragraph:
        "For now, all OXIA content is available completely free. You can try up to 5 sessions per month without signing in.\nCreate an account to unlock unlimited access — freely, just like your breath.",
    },
    {
      icon: <Smile className="w-16 h-16 animate-[bounce_1.5s_ease-in-out_infinite]" />,
      heading: "Ready to begin?",
      paragraph: "You can start with 5 free sessions,\nor create your account to explore without limits.",
      isFinal: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center breathing-bg">
      {/* Skip Button */}
      {current < slides.length - 1 && (
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground hover:bg-white/10 z-10"
        >
          Skip
        </Button>
      )}

      <div className="w-full max-w-2xl px-6">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                  {/* Logo for first slide */}
                  {slide.showLogo && (
                    <img
                      src="/lovable-uploads/6d9cc0f0-addd-45b1-abab-238892b91dbf.png"
                      alt="OXIA Logo"
                      className="max-h-[8vh] min-h-[40px] w-auto object-contain mb-8"
                    />
                  )}

                  {/* Animated Icon */}
                  <div className="text-foreground mb-8">{slide.icon}</div>

                  {/* Heading */}
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{slide.heading}</h2>

                  {/* Paragraph */}
                  <p className="text-lg md:text-xl text-foreground whitespace-pre-line max-w-xl leading-relaxed">
                    {slide.paragraph}
                  </p>

                  {/* Final slide buttons */}
                  {slide.isFinal && (
                    <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-md">
                      <Button
                        onClick={handleCreateAccount}
                        className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6"
                      >
                        Create account
                      </Button>
                      <Button
                        onClick={handleTry}
                        variant="outline"
                        className="flex-1 rounded-full border border-primary/30 text-primary bg-card hover:bg-secondary font-semibold text-base py-6"
                      >
                        Try
                      </Button>
                    </div>
                  )}

                  {/* Next Button for non-final slides */}
                  {!slide.isFinal && (
                    <Button
                      onClick={handleNext}
                      className="mt-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-base font-semibold"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === current ? "bg-primary w-8" : "bg-primary/25 hover:bg-primary/40 w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingCarousel;
