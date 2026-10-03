import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Hand, Wind, TrendingUp, Users, Sparkles, Smile, Crown } from "lucide-react";
import { PREMIUM_INTENT_KEY } from "@/lib/authRedirect";
import { useNavigate } from "react-router-dom";

// Bundled in public/ so they ship inside the installed app (no network needed).
const breathingExercisesVideo = "/onboarding/breathing_exercises.webm";
const progressVideo = "/onboarding/progress.webm";
const feedbackVideo = "/onboarding/feedback.webm";

/** Only loads and plays while its slide is visible, to save data and battery. */
const SlideVideo = ({ src, label, active }: { src: string; label: string; active: boolean }) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);
  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      loop
      muted
      playsInline
      preload="none"
      aria-label={label}
      className="w-48 aspect-[9/19] object-contain rounded-lg shadow-lg bg-card"
    />
  );
};

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

  const handleWantPremium = () => {
    localStorage.setItem(PREMIUM_INTENT_KEY, "premium");
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
          loading="lazy"
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
        <SlideVideo src={breathingExercisesVideo} label="Breathing exercises animation" active={current === 1} />
      ),
      heading: "Just breathe and feel the calm",
      paragraph:
        "Here you'll find a range of guided breathing practices to help you relax, focus, and restore inner balance.\nYou can also create your own — a rhythm that feels right for you.",
    },
    {
      icon: (
        <SlideVideo src={progressVideo} label="Progress tracking animation" active={current === 2} />
      ),
      heading: "Track your journey",
      paragraph:
        "OXIA helps you notice your progress over time — your breaths, your consistency, your growth.\nEvery inhale and exhale brings you closer to clarity, calm, and mastery.",
    },
    {
      icon: (
        <SlideVideo src={feedbackVideo} label="Feedback and community animation" active={current === 3} />
      ),
      heading: "We grow together",
      paragraph:
        "Our journey is just beginning. We're constantly developing OXIA and would love for you to be part of it.\nYour feedback, ideas, and curiosity help us create something truly meaningful — for everyone's wellbeing. 💙",
    },
    {
      icon: <Sparkles className="w-16 h-16 animate-[spin_3s_linear_infinite]" />,
      heading: "Feel free to use",
      paragraph:
        "For now, all OXIA content is available completely free. You can try up to 10 sessions without signing in.\nCreate an account to unlock unlimited access — freely, just like your breath.",
    },
    {
      icon: <Crown className="w-16 h-16 text-amber-500 animate-[bounce_1.5s_ease-in-out_infinite]" />,
      heading: "OXIA Premium",
      paragraph:
        "Go deeper with a 7-day free trial:\n• AI Wellness Journal\n• Stress & mood tracking before and after sessions\n• Mood, stress and exercise-effectiveness insights\n• Monthly PDF wellness report",
      isPremium: true,
    },
    {
      icon: <Smile className="w-16 h-16 animate-[bounce_1.5s_ease-in-out_infinite]" />,
      heading: "Ready to begin?",
      paragraph: "You can start with 10 free sessions,\nor create your account to explore without limits.",
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
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground hover:bg-foreground/10 z-10"
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

                  {/* Premium slide: sign up first, then subscribe after confirming the email */}
                  {slide.isPremium && (
                    <div className="flex flex-col gap-3 mt-8 w-full max-w-md">
                      <Button
                        onClick={handleWantPremium}
                        className="rounded-full bg-amber-500 hover:bg-amber-500/90 text-white font-semibold text-base py-6"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        I want Premium
                      </Button>
                      <Button
                        onClick={handleNext}
                        variant="outline"
                        className="rounded-full border border-primary/30 text-primary bg-card hover:bg-secondary font-semibold text-base py-6"
                      >
                        Next
                      </Button>
                    </div>
                  )}

                  {/* Next Button for non-final slides */}
                  {!slide.isFinal && !slide.isPremium && (
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
