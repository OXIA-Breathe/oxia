# Notification System Setup Guide

Your OXIA app now has a complete notification system! Here's what has been implemented and how to use it.

## What's Been Implemented

### 1. **Local Notifications (Mobile App)**
- Capacitor Local Notifications plugin installed
- Automatic notification scheduling based on your saved schedules
- Notifications repeat weekly at your chosen times
- Permission handling for Android/iOS

### 2. **Backend Edge Function**
- `check-notifications` function created in Supabase
- Checks scheduled notifications every minute
- Ready to be triggered by a cron job

### 3. **Smart Syncing**
- Notifications automatically sync when you:
  - Enable/disable notifications
  - Add a new notification schedule
  - Edit an existing schedule
  - Delete a schedule

## How It Works

1. **User schedules notifications** in the app (Settings → Notification Settings)
2. **Local notifications are scheduled** on the device for the chosen times and days
3. **Notifications trigger** at the scheduled times, even if the app is closed
4. **Notifications repeat weekly** automatically

## Setup Instructions

### Step 1: Sync Capacitor Plugin
Since we've added the Local Notifications plugin, you need to sync it:

```bash
git pull  # Pull latest changes from your repo
npm install  # Install the new dependency
npx cap sync  # Sync the plugin to native platforms
```

### Step 2: Test on Device/Emulator
Rebuild and run the app:

```bash
npm run build
npx cap run android  # or npx cap run ios
```

### Step 3: (Optional) Set Up Cron Job for Backend
If you want server-side notification checking as well:

1. Enable `pg_cron` extension in your Supabase project
2. Run this SQL in Supabase SQL Editor:

```sql
select cron.schedule(
  'check-notifications-every-minute',
  '* * * * *',
  $$
  select net.http_post(
    url:='YOUR_SUPABASE_URL/functions/v1/check-notifications',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body:='{}'::jsonb
  ) as request_id;
  $$
);
```

Replace:
- `YOUR_SUPABASE_URL` with your Supabase project URL
- `YOUR_ANON_KEY` with your Supabase anon key

## Testing the Notifications

1. Open the app and go to **Settings**
2. Enable **Notifications**
3. Tap **"Add a new notification"**
4. Set a time a few minutes in the future
5. Select today's day of the week
6. Save the notification
7. Close the app
8. Wait for the scheduled time
9. You should receive a notification! 🎉

## How Notifications Look

- **Title**: Your custom title (e.g., "Morning Breathing")
- **Body**: "Time for your breathing exercise! 🌬️"
- **Icon**: Your app icon
- **Sound**: Default notification sound

## Permissions

The app will automatically request notification permissions when you:
- Enable notifications for the first time
- Save notification settings

On Android 13+, users will see a permission dialog to allow notifications.

## Troubleshooting

### Notifications not showing?
1. Check that notifications are enabled in device settings for OXIA
2. Verify you selected the correct day of the week
3. Make sure the time is in the future
4. Try closing and reopening the app after scheduling

### Permission denied?
1. Go to device Settings → Apps → OXIA → Notifications
2. Enable notifications manually
3. Return to the app and try again

## Technical Details

- Notifications use Capacitor's Local Notifications API
- Scheduled locally on the device (no server needed for delivery)
- Repeat weekly automatically
- Persist across app restarts
- Work even when the app is closed

Enjoy your breathing reminders! 🧘‍♀️✨
