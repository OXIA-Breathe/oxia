# OXIA - Product Requirements Document (PRD)

## Overview

**Product Name:** OXIA  
**Version:** 1.0.0  
**Platform:** Web (React), iOS, Android (via Capacitor)  
**Description:** OXIA is a breathing exercise and mindfulness application designed to help users improve their mental wellbeing through guided breathing practices, emotion tracking, and progress monitoring.

---

## Table of Contents

1. [User Authentication](#1-user-authentication)
2. [Onboarding Experience](#2-onboarding-experience)
3. [Breathing Exercise Engine](#3-breathing-exercise-engine)
4. [Exercise Library](#4-exercise-library)
5. [Custom Exercise Creation](#5-custom-exercise-creation)
6. [Audio System](#6-audio-system)
7. [Emotion Tracking](#7-emotion-tracking)
8. [Progress & Analytics](#8-progress--analytics)
9. [Achievements & Gamification](#9-achievements--gamification)
10. [Session History](#10-session-history)
11. [Notification System](#11-notification-system)
12. [User Profile](#12-user-profile)
13. [Settings](#13-settings)
14. [Learning Resources](#14-learning-resources)
15. [Social & Sharing](#15-social--sharing)

---

## 1. User Authentication

### Description
Secure user authentication system allowing users to create accounts, sign in, and manage their credentials.

### User Stories
- As a user, I want to create an account so that I can save my progress and access it across devices.
- As a user, I want to sign in with my email and password.
- As a user, I want to reset my password if I forget it.
- As a new user, I want to try the app with limited sessions before creating an account.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-001 | Email/password sign-up with validation (min 6 characters) | High |
| AUTH-002 | Email/password sign-in | High |
| AUTH-003 | Password reset via email | High |
| AUTH-004 | Auto-redirect authenticated users from auth page | Medium |
| AUTH-005 | Trial mode: 5 free sessions per month for unauthenticated users | High |
| AUTH-006 | Sign-up prompt modal after trial limit reached | High |
| AUTH-007 | Session persistence across app restarts | High |

### Technical Implementation
- **Provider:** Supabase Auth
- **Files:** 
  - `src/context/AuthContext.tsx`
  - `src/pages/AuthPage.tsx`
  - `src/pages/ResetPasswordPage.tsx`
  - `src/components/auth/ForgotPasswordModal.tsx`
  - `src/components/breathing/SignUpPromptModal.tsx`
  - `src/hooks/useTrialCounter.ts`

### Acceptance Criteria
- [ ] Users can successfully create accounts with valid email/password
- [ ] Users receive confirmation email after sign-up
- [ ] Password reset email is sent within 30 seconds
- [ ] Trial counter persists in localStorage
- [ ] Sign-up modal appears after 5th trial session completes

---

## 2. Onboarding Experience

### Description
A multi-slide onboarding carousel that introduces new users to OXIA's features, mission, and value proposition.

### User Stories
- As a new user, I want to understand what OXIA offers before using the app.
- As a new user, I want to skip onboarding if I'm already familiar with the app.
- As a new user, I want clear calls-to-action to either create an account or try the app.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| ONB-001 | 6-slide carousel with progress indicators | High |
| ONB-002 | Skip button to bypass onboarding | High |
| ONB-003 | Final slide with "Create Account" and "Try" CTAs | High |
| ONB-004 | Onboarding only shows on first visit (persisted in localStorage) | High |
| ONB-005 | Animated icons and images on each slide | Medium |
| ONB-006 | Dot navigation for slide progress | Medium |

### Content Structure
1. **Welcome** - Introduction to OXIA with logo
2. **Breathing Practices** - Overview of guided exercises
3. **Progress Tracking** - Explanation of analytics features
4. **Community** - Feedback and development roadmap
5. **Free Usage** - Explanation of free tier and limitations
6. **Getting Started** - Account creation or trial CTAs

### Technical Implementation
- **Files:**
  - `src/components/onboarding/OnboardingCarousel.tsx`
  - `src/pages/Index.tsx`

### Acceptance Criteria
- [ ] Carousel is displayed on first app visit
- [ ] localStorage flag `hasSeenOnboarding` is set after completion
- [ ] Skip button closes carousel and sets completion flag
- [ ] "Create Account" navigates to `/auth`
- [ ] "Try" closes carousel and starts app experience

---

## 3. Breathing Exercise Engine

### Description
The core breathing exercise system that guides users through timed breathing patterns with visual and audio feedback.

### User Stories
- As a user, I want to follow a visual breathing guide that shows me when to inhale, exhale, and hold.
- As a user, I want to pause and resume my exercise.
- As a user, I want to see my progress during the exercise.
- As a user, I want a countdown before the exercise starts.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| BRE-001 | Four breathing phases: inhale, hold1, exhale, hold2 | High |
| BRE-002 | Configurable duration for each phase | High |
| BRE-003 | Visual circle animation synchronized with phases | High |
| BRE-004 | Countdown timer before exercise starts | High |
| BRE-005 | Pause/resume functionality | High |
| BRE-006 | Reset exercise button | High |
| BRE-007 | Display current repetition and total repetitions | High |
| BRE-008 | Display breath count and elapsed time | High |
| BRE-009 | Phase time remaining display | Medium |
| BRE-010 | Session auto-completes when all repetitions finished | High |

### Breathing Phases
| Phase | Description | Duration (configurable) |
|-------|-------------|------------------------|
| Countdown | 3-second countdown before start | 3s |
| Inhale | Breathing in | 4-8s typical |
| Hold 1 | First breath hold | 0-16s typical |
| Exhale | Breathing out | 4-8s typical |
| Hold 2 | Second breath hold (optional) | 0-8s typical |

### Technical Implementation
- **Files:**
  - `src/components/breathing/BreathingExercise.tsx`
  - `src/components/breathing/BreathingCircle.tsx`
  - `src/components/breathing/BreathingControls.tsx`
  - `src/components/breathing/BreathingStats.tsx`
  - `src/components/breathing/hooks/useBreathingSession.ts`
  - `src/components/breathing/hooks/useBreathingTimer.ts`
  - `src/components/breathing/hooks/useElapsedTimer.ts`

### Acceptance Criteria
- [ ] Circle expands during inhale, contracts during exhale
- [ ] Phase name displayed in center of circle
- [ ] Time remaining shown for current phase
- [ ] Exercise can be paused at any point
- [ ] Reset returns to idle state
- [ ] Session data saved on completion

---

## 4. Exercise Library

### Description
A collection of pre-built breathing exercises with detailed information about each technique.

### User Stories
- As a user, I want to browse available breathing exercises.
- As a user, I want to see details about each exercise before starting.
- As a user, I want to quickly select and start an exercise.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| LIB-001 | List view of all available exercises | High |
| LIB-002 | Exercise cards with title, description, and duration info | High |
| LIB-003 | Exercise detail page with full information | High |
| LIB-004 | Start exercise from library | High |
| LIB-005 | Differentiate between default and custom exercises | Medium |
| LIB-006 | Delete custom exercises | Medium |

### Default Exercises
- Box Breathing (4-4-4-4)
- 4-7-8 Relaxation
- Wim Hof Method
- Coherent Breathing
- Resonant Breathing
- And more...

### Exercise Details Include
- Title
- Short description
- Detailed description
- How it helps
- When to use (tags)
- Step-by-step instructions
- Common mistakes
- Safety notes
- Timing parameters

### Technical Implementation
- **Files:**
  - `src/pages/BreathePage.tsx`
  - `src/pages/ExerciseDetailsPage.tsx`
  - `src/components/breathing/ExerciseCard.tsx`
  - `src/context/BreathingExerciseContext.tsx`

### Acceptance Criteria
- [ ] All default exercises are visible in library
- [ ] Selecting exercise navigates to home with exercise loaded
- [ ] Custom exercises appear in library with delete option
- [ ] Exercise details page shows all relevant information

---

## 5. Custom Exercise Creation

### Description
Allow users to create personalized breathing exercises with custom timing parameters.

### User Stories
- As a user, I want to create my own breathing exercise with custom timings.
- As a user, I want to edit my custom exercises.
- As a user, I want to delete exercises I no longer need.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| CUS-001 | Create custom exercise modal | High |
| CUS-002 | Configure title and description | High |
| CUS-003 | Set inhale, hold1, exhale, hold2 durations | High |
| CUS-004 | Set number of repetitions | High |
| CUS-005 | Save custom exercise to database | High |
| CUS-006 | Edit existing custom exercise | Medium |
| CUS-007 | Delete custom exercise with confirmation | Medium |
| CUS-008 | Custom exercises marked with indicator | Low |

### Technical Implementation
- **Files:**
  - `src/components/breathing/CreateExerciseModal.tsx`
  - `src/components/breathing/EditExerciseModal.tsx`
  - `src/components/breathing/ParametersModal.tsx`
  - `src/context/BreathingExerciseContext.tsx`

### Acceptance Criteria
- [ ] Modal opens from exercise library
- [ ] All timing fields accept numeric input
- [ ] Validation prevents invalid values (negative, zero where not allowed)
- [ ] Custom exercises persist across sessions
- [ ] Edit updates existing exercise without creating new one

---

## 6. Audio System

### Description
Comprehensive audio system including background music and voice guidance during breathing exercises.

### User Stories
- As a user, I want calming background music during my exercise.
- As a user, I want voice guidance telling me when to breathe in and out.
- As a user, I want to control audio volume independently.
- As a user, I want to choose from different music tracks and voices.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| AUD-001 | Background music playback during exercise | High |
| AUD-002 | 7 background music options | High |
| AUD-003 | Voice guidance for each phase | High |
| AUD-004 | 2 voice options (Mila/Liam) | High |
| AUD-005 | Independent volume control for music and voice | High |
| AUD-006 | Enable/disable toggles for music and voice | High |
| AUD-007 | Countdown tick sound | Medium |
| AUD-008 | Music pauses when exercise pauses | Medium |
| AUD-009 | Settings persist in localStorage | High |

### Background Music Options
| ID | Name |
|----|------|
| cosmic | Cosmic Exploration |
| ambient | Gentle Ambient Melodies |
| meditation | Meditation Flow |
| piano | Nature Calm Piano |
| nature | Nature Dreamscape |
| stream | Peaceful Stream |
| silent | Silent Universe |

### Voice Options
| ID | Name | Gender |
|----|------|--------|
| mila | Mila | Female |
| liam | Liam | Male |

### Technical Implementation
- **Files:**
  - `src/hooks/useBackgroundMusic.ts`
  - `src/hooks/useBreathingVoice.ts`
  - `src/hooks/useCountdownSound.ts`
  - `src/hooks/useStaticAudio.ts`
  - `src/components/settings/AudioSettings.tsx`

### Acceptance Criteria
- [ ] Music starts on exercise start
- [ ] Voice prompts play at phase transitions
- [ ] Volume sliders adjust in real-time
- [ ] Settings persist after app restart
- [ ] Audio stops when exercise resets

---

## 7. Emotion Tracking

### Description
Pre and post-exercise emotion tracking to help users understand the impact of breathing exercises on their emotional state.

### User Stories
- As a user, I want to log how I feel before starting an exercise.
- As a user, I want to log how I feel after completing an exercise.
- As a user, I want to see how my emotions changed after the exercise.
- As a user, I want to add notes about my session.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| EMO-001 | Pre-exercise mood check-in modal | High |
| EMO-002 | Post-exercise mood tracking modal | High |
| EMO-003 | Mood selection with visual icons | High |
| EMO-004 | Stress level slider (0-10) | High |
| EMO-005 | Optional note field in post-exercise | Medium |
| EMO-006 | Skip option for both check-ins | Medium |
| EMO-007 | Visual mood change indicator | Medium |
| EMO-008 | Toggle emotion tracking in settings | High |
| EMO-009 | Store emotion data linked to session | High |

### Mood Options
| Icon | Mood |
|------|------|
| 😊 | Happy |
| 😌 | Calm |
| 🤩 | Excited |
| 😰 | Anxious |
| 😢 | Sad |
| 😡 | Irritated |
| 😴 | Tired |

### Technical Implementation
- **Files:**
  - `src/components/emotion/PreExerciseCheckIn.tsx`
  - `src/components/emotion/PostExerciseTracking.tsx`
  - `src/hooks/useEmotionTracking.ts`
  - `src/components/settings/OtherSettings.tsx`
  - `src/constants/emotionConfig.ts`

### Database Schema
```sql
emotion_tracking (
  id, user_id, session_id,
  pre_valence, pre_arousal,
  post_valence, post_arousal,
  note, created_at
)
```

### Acceptance Criteria
- [ ] Pre-check-in appears before exercise starts (if enabled)
- [ ] Post-tracking appears after exercise completes
- [ ] Mood change visualization shows before/after comparison
- [ ] Notes are saved and visible in session history
- [ ] Feature can be disabled in settings

---

## 8. Progress & Analytics

### Description
Comprehensive progress tracking showing user's breathing journey over time.

### User Stories
- As a user, I want to see my total breath count.
- As a user, I want to see my total session count.
- As a user, I want to view a calendar showing my active days.
- As a user, I want to see my current and longest streaks.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| PRG-001 | Total breaths counter | High |
| PRG-002 | Total sessions counter | High |
| PRG-003 | Total minutes practiced | High |
| PRG-004 | Activity calendar with highlighted active days | High |
| PRG-005 | Calendar date selection to filter sessions | Medium |
| PRG-006 | Current breath streak display | High |
| PRG-007 | Longest breath streak display | High |
| PRG-008 | Current login streak display | Medium |
| PRG-009 | Longest login streak display | Medium |

### Streak Logic
- **Breath Streak:** Consecutive days with at least one completed session
- **Login Streak:** Consecutive days the user logged in

### Technical Implementation
- **Files:**
  - `src/pages/ConsistencyPage.tsx`
  - `src/components/consistency/ActivityCalendar.tsx`
  - `src/components/consistency/StreakStats.tsx`
  - `src/components/profile/ProgressStats.tsx`
  - `src/hooks/useConsistencyData.ts`
  - `src/hooks/useDailyStreakTracker.ts`
  - `src/components/breathing/hooks/useStreakManager.ts`

### Acceptance Criteria
- [ ] Stats update in real-time after session completion
- [ ] Calendar shows correct active days
- [ ] Clicking calendar date filters session list
- [ ] Streak resets if day is missed
- [ ] Longest streak persists even if current streak breaks

---

## 9. Achievements & Gamification

### Description
Badge-based achievement system to motivate users and celebrate milestones.

### User Stories
- As a user, I want to earn badges for reaching milestones.
- As a user, I want to see notifications when I unlock achievements.
- As a user, I want to view all my earned badges.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| ACH-001 | Breath count badges (thresholds: 100, 500, 1000, 5000, 10000) | High |
| ACH-002 | Session count badges (thresholds: 1, 10, 50, 100, 365) | High |
| ACH-003 | Streak badges (thresholds: 3, 7, 14, 30, 60, 100) | High |
| ACH-004 | Exercise completion badges | Medium |
| ACH-005 | Custom exercise creation badge | Medium |
| ACH-006 | App sharing badge | Medium |
| ACH-007 | All achievements badge | Low |
| ACH-008 | Toast notification on achievement unlock | High |
| ACH-009 | Achievement gallery in profile | High |
| ACH-010 | Firebase Analytics logging | Medium |

### Badge Categories
| Category | Icon | Description |
|----------|------|-------------|
| Breath | 🌬️ | Breath count milestones |
| Session | 🧘 | Session completion milestones |
| Streak | 🔥 | Consecutive day streaks |
| Exercise | ✨ | Exercise variety achievements |
| OXIA | 💙 | Special achievements |

### Technical Implementation
- **Files:**
  - `src/components/breathing/hooks/badgeDefinitions.ts`
  - `src/components/breathing/hooks/useAchievements.ts`
  - `src/components/breathing/hooks/useAchievementNotifications.ts`
  - `src/components/consistency/AchievementBadges.tsx`
  - `src/components/profile/ProfileBadges.tsx`

### Acceptance Criteria
- [ ] Badge unlocks at correct thresholds
- [ ] Toast appears with badge name and description
- [ ] Achievements are saved to database
- [ ] Same achievement cannot be unlocked twice
- [ ] Badge gallery shows locked vs unlocked states

---

## 10. Session History

### Description
Detailed history of all completed breathing sessions with export functionality.

### User Stories
- As a user, I want to see all my past sessions.
- As a user, I want to filter sessions by date.
- As a user, I want to view details of each session.
- As a user, I want to export my session history as PDF.
- As a user, I want to manually add sessions I completed offline.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| HIS-001 | List all sessions with date, exercise, stats | High |
| HIS-002 | Filter sessions by calendar date | Medium |
| HIS-003 | Session card shows breath count, duration, repetitions | High |
| HIS-004 | Session card shows emotion data if available | Medium |
| HIS-005 | Edit session details | Low |
| HIS-006 | Delete session with confirmation | Medium |
| HIS-007 | Export to PDF | Medium |
| HIS-008 | Share session via email | Low |
| HIS-009 | Manually add session modal | Medium |
| HIS-010 | Empty state when no sessions | High |

### Session Card Display
- Date and time
- Exercise title
- Breath count
- Total duration
- Number of repetitions
- Pre/post mood (if tracked)
- Notes (if added)

### Technical Implementation
- **Files:**
  - `src/components/history/SessionHistory.tsx`
  - `src/components/history/SessionCard.tsx`
  - `src/components/history/SessionList.tsx`
  - `src/components/history/AddSessionModal.tsx`
  - `src/components/history/ModifySessionDialog.tsx`
  - `src/components/history/DeleteConfirmDialog.tsx`
  - `src/components/history/ExportButton.tsx`
  - `src/components/history/utils/pdf/`

### Acceptance Criteria
- [ ] Sessions load in reverse chronological order
- [ ] Date filter shows only matching sessions
- [ ] PDF export includes all visible sessions
- [ ] Manual add creates valid session entry
- [ ] Delete removes from database with confirmation

---

## 11. Notification System

### Description
Customizable reminder notifications to help users maintain their breathing practice.

### User Stories
- As a user, I want to receive reminders to practice breathing.
- As a user, I want to set custom reminder times.
- As a user, I want to choose which days to receive reminders.
- As a user, I want to easily enable/disable all notifications.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| NOT-001 | Global notification toggle | High |
| NOT-002 | Create custom notification schedules | High |
| NOT-003 | Edit existing notification schedules | High |
| NOT-004 | Delete notification schedules | High |
| NOT-005 | Select specific days of the week | High |
| NOT-006 | Set notification time | High |
| NOT-007 | Custom notification titles | Medium |
| NOT-008 | Default notification schedules on first enable | Medium |
| NOT-009 | Request OS notification permissions | High |
| NOT-010 | Notifications work when app is closed | High |

### Default Notification Categories
| Title | Default Time |
|-------|-------------|
| Morning Breath | 08:00 |
| Midday Mindfulness | 12:00 |
| Evening Wind Down | 20:00 |

### Technical Implementation
- **Files:**
  - `src/components/settings/NotificationSettings.tsx`
  - `src/components/settings/NotificationCard.tsx`
  - `src/components/settings/AddNotificationCard.tsx`
  - `src/components/settings/NotificationModal.tsx`
  - `src/hooks/useLocalNotifications.ts`
  - `src/hooks/useNotificationQueue.ts`
  - `src/constants/notificationMessages.ts`
  - `supabase/functions/check-notifications/`

### Acceptance Criteria
- [ ] Notifications fire at scheduled times
- [ ] Weekly repetition works correctly
- [ ] Disabling clears all pending notifications
- [ ] Permission request appears on first enable
- [ ] Notifications work on Android and iOS

---

## 12. User Profile

### Description
User profile page displaying personal information, stats, achievements, and account management.

### User Stories
- As a user, I want to view my profile information.
- As a user, I want to see my achievements and streaks.
- As a user, I want to change my password.
- As a user, I want to sign out of my account.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| PRO-001 | Display user email/name | High |
| PRO-002 | Avatar display and upload | Medium |
| PRO-003 | Show streak statistics | High |
| PRO-004 | Show earned badges | High |
| PRO-005 | Change password functionality | High |
| PRO-006 | Sign out button | High |
| PRO-007 | Delete account option | Low |

### Technical Implementation
- **Files:**
  - `src/pages/ProfilePage.tsx`
  - `src/components/profile/ProfileInfo.tsx`
  - `src/components/profile/ProfileStats.tsx`
  - `src/components/profile/ProfileStreaks.tsx`
  - `src/components/profile/ProfileBadges.tsx`
  - `src/components/profile/ProfileActions.tsx`
  - `src/components/profile/AvatarPhotoModal.tsx`
  - `src/components/profile/ChangePasswordModal.tsx`

### Acceptance Criteria
- [ ] Profile shows correct user information
- [ ] Streak stats match progress page data
- [ ] Badges display correctly
- [ ] Password change updates auth credentials
- [ ] Sign out clears session and redirects

---

## 13. Settings

### Description
Centralized settings page for managing app preferences and account options.

### User Stories
- As a user, I want to customize my audio preferences.
- As a user, I want to manage my notification settings.
- As a user, I want to toggle emotion tracking.
- As a user, I want to access support and feedback options.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| SET-001 | Audio settings section | High |
| SET-002 | Notification settings section | High |
| SET-003 | Emotion tracking toggle | High |
| SET-004 | Feedback form | Medium |
| SET-005 | Contact form | Medium |
| SET-006 | About section with founder story | Medium |
| SET-007 | Terms & Conditions link | High |
| SET-008 | Privacy Policy link | High |
| SET-009 | Social media links | Medium |
| SET-010 | Rate app button | Medium |
| SET-011 | Share app button | Medium |
| SET-012 | Version display | Low |

### Settings Sections
1. **Audio Settings** - Music and voice preferences
2. **Notification Settings** - Reminder schedules
3. **Other Settings** - Emotion tracking toggle
4. **About Us** - Company info, feedback, contact

### Technical Implementation
- **Files:**
  - `src/pages/SettingsPage.tsx`
  - `src/components/settings/AudioSettings.tsx`
  - `src/components/settings/NotificationSettings.tsx`
  - `src/components/settings/OtherSettings.tsx`
  - `src/components/settings/FeedbackForm.tsx`
  - `src/components/settings/ContactForm.tsx`

### Acceptance Criteria
- [ ] All settings persist correctly
- [ ] Forms submit successfully with feedback
- [ ] External links open in new tab
- [ ] Share uses native share API when available
- [ ] Settings are protected (require auth)

---

## 14. Learning Resources

### Description
Educational content hub for users to learn about breathing techniques and their benefits.

### User Stories
- As a user, I want to learn why breathing exercises are beneficial.
- As a user, I want to suggest topics I'm interested in learning about.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| LRN-001 | Learning resources page (coming soon) | High |
| LRN-002 | Placeholder content explaining future features | High |
| LRN-003 | Feedback/suggestion button | Medium |
| LRN-004 | Topic suggestion modal | Medium |

### Planned Content Categories
- Science of breathing
- Nervous system and breath
- Breathing for stress relief
- Breathing for focus
- Breathing for sleep

### Technical Implementation
- **Files:**
  - `src/pages/LearnPage.tsx`
  - `src/components/learn/FeedbackModal.tsx`

### Acceptance Criteria
- [ ] Page displays coming soon message
- [ ] Feedback modal submits successfully
- [ ] Page is protected (requires auth)

---

## 15. Social & Sharing

### Description
Social features for sharing progress and connecting with the OXIA community.

### User Stories
- As a user, I want to share the app with friends.
- As a user, I want to follow OXIA on social media.
- As a user, I want to rate the app on app stores.

### Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| SOC-001 | Share app functionality | High |
| SOC-002 | Instagram profile link | Medium |
| SOC-003 | TikTok profile link | Medium |
| SOC-004 | App Store rating link (iOS) | Medium |
| SOC-005 | Play Store rating link (Android) | Medium |
| SOC-006 | Share achievement tracking | Low |
| SOC-007 | Copy to clipboard fallback | Medium |

### Technical Implementation
- **Files:**
  - `src/components/breathing/hooks/useShareTracking.ts`
  - `src/pages/SettingsPage.tsx`

### Acceptance Criteria
- [ ] Share uses Web Share API when available
- [ ] Fallback copies URL to clipboard
- [ ] Social links open correct profiles
- [ ] Store links detect platform and open correct store
- [ ] Share achievement unlocks on first share

---

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profile data |
| `breath_sessions` | Completed breathing sessions |
| `breathing_exercises` | Exercise definitions (default + custom) |
| `emotion_tracking` | Pre/post emotion data per session |
| `user_streaks` | Current and longest streak data |
| `daily_activity` | Daily login and session tracking |
| `user_achievements` | Unlocked achievements |
| `user_exercise_completions` | Exercises user has completed |
| `notification_settings` | Global notification preferences |
| `notification_schedules` | Individual notification times |

---

## Non-Functional Requirements

### Performance
- App should load in < 3 seconds
- Breathing animations should run at 60fps
- Audio latency should be < 100ms

### Security
- All data transmitted over HTTPS
- User data protected by Row Level Security (RLS)
- Passwords hashed using Supabase Auth standards

### Accessibility
- Touch targets minimum 44x44px
- Color contrast ratios meet WCAG 2.1 AA
- Screen reader compatible

### Compatibility
- Web: Chrome, Safari, Firefox, Edge (latest 2 versions)
- Mobile: iOS 14+, Android 10+
- Responsive design: 320px - 2560px viewport

---

## Analytics & Tracking

### Firebase Analytics Events
| Event | Parameters |
|-------|------------|
| `login` | method |
| `sign_up` | method |
| `breathing_session_completed` | exercise_name, breath_count, duration, is_custom |
| `unlock_achievement` | achievement_name, category |
| `screen_view` | screen_name |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025 | Initial release |

---

## Appendix

### A. File Structure
```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── breathing/      # Breathing exercise components
│   ├── consistency/    # Progress tracking components
│   ├── emotion/        # Emotion tracking components
│   ├── history/        # Session history components
│   ├── layout/         # Layout components (Navbar, MainLayout)
│   ├── learn/          # Learning resources components
│   ├── onboarding/     # Onboarding components
│   ├── profile/        # Profile page components
│   ├── settings/       # Settings components
│   └── ui/             # Shadcn UI components
├── context/            # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── constants/          # App constants
├── types/              # TypeScript types
└── integrations/       # Supabase integration
```

### B. External Dependencies
- Supabase (Auth, Database, Edge Functions)
- Capacitor (iOS/Android builds)
- Firebase Analytics
- Radix UI components
- TanStack Query
- Framer Motion (animations)
