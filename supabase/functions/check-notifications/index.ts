import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
};

interface NotificationSchedule {
  id: string;
  user_id: string;
  title: string;
  time: string;
  days: number[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Scheduler-only endpoint: require a shared secret before doing any work.
  const cronSecret = Deno.env.get('NOTIFICATIONS_CRON_SECRET');
  const provided = req.headers.get('x-cron-secret');
  if (!cronSecret || !provided || provided !== cronSecret) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    // Get all enabled notification settings
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('user_id')
      .eq('enabled', true);

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
      throw settingsError;
    }

    if (!settings || settings.length === 0) {
      console.log('No users with notifications enabled');
      return new Response(
        JSON.stringify({ message: 'No users with notifications enabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userIds = settings.map(s => s.user_id);

    // Get schedules that match current time and day
    const { data: schedules, error: schedulesError } = await supabase
      .from('notification_schedules')
      .select('*')
      .in('user_id', userIds)
      .contains('days', [currentDay]);

    if (schedulesError) {
      console.error('Error fetching schedules:', schedulesError);
      throw schedulesError;
    }

    // Filter schedules by time (within 1 minute window)
    const matchingSchedules = (schedules as NotificationSchedule[])?.filter(schedule => {
      const scheduleTime = schedule.time.slice(0, 5);
      return scheduleTime === currentTime;
    }) || [];

    console.log(`Found ${matchingSchedules.length} matching schedules for ${currentTime}`);

    // Store notifications to be sent (these will be picked up by the mobile app)
    const notifications = matchingSchedules.map(schedule => ({
      user_id: schedule.user_id,
      title: schedule.title,
      body: "Time for your breathing exercise! 🌬️",
      scheduled_time: now.toISOString(),
    }));

    if (notifications.length > 0) {
      // Here you would typically send push notifications
      // For now, we'll just log them
      console.log('Notifications to send:', notifications);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        count: matchingSchedules.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
