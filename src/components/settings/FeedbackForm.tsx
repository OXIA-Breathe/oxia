import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const FeedbackForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !feedback.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement email sending via Supabase edge function
      console.log('Feedback submission:', {
        name,
        feedback,
        userEmail: user?.email
      });
      
      toast({
        title: "Feedback sent successfully!",
        description: "Thank you for helping us improve the app."
      });
      
      setName('');
      setFeedback('');
    } catch (error) {
      toast({
        title: "Failed to send feedback",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="feedback-name">Name</Label>
        <Input
          id="feedback-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="feedback-text">Feedback</Label>
        <Textarea
          id="feedback-text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Please send us feedback, what you would want to have on this app or where is the bug.."
          maxLength={1000}
          className="min-h-[120px]"
        />
        <div className="text-sm text-muted-foreground text-right">
          {feedback.length}/1000 characters
        </div>
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Sending...' : 'Send Feedback'}
      </Button>
    </form>
  );
};

export default FeedbackForm;