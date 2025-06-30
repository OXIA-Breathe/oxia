
-- First, let's check if RLS is enabled and add proper policies for breath_sessions table
ALTER TABLE public.breath_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own sessions
CREATE POLICY "Users can view their own breath sessions" 
  ON public.breath_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own sessions
CREATE POLICY "Users can create their own breath sessions" 
  ON public.breath_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own sessions
CREATE POLICY "Users can update their own breath sessions" 
  ON public.breath_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own sessions
CREATE POLICY "Users can delete their own breath sessions" 
  ON public.breath_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);
