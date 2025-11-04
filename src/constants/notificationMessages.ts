export interface NotificationMessage {
  id: string;
  tone: string;
  text: string;
}

export interface NotificationCategory {
  id: 'morning' | 'midday' | 'evening';
  label: string;
  timeRange: { start: string; end: string };
  defaultTime: string;
  defaultTitle: string;
  messages: NotificationMessage[];
}

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    id: "morning",
    label: "Morning",
    timeRange: { start: "05:30", end: "10:30" },
    defaultTime: "07:30",
    defaultTitle: "Morning reset",
    messages: [
      { id: "morning_1", tone: "neutral_warm", text: "Start your day with one calm breath ☀️" },
      { id: "morning_2", tone: "invitational", text: "A new day, a new rhythm — breathe it in." },
      { id: "morning_3", tone: "affirming", text: "Inhale clarity, exhale doubt. 🌬️" },
      { id: "morning_4", tone: "zen_minimal", text: "Pause before the world begins — just breathe." }
    ]
  },
  {
    id: "midday",
    label: "Midday / Afternoon",
    timeRange: { start: "11:00", end: "16:00" },
    defaultTime: "13:30",
    defaultTitle: "Midday pause",
    messages: [
      { id: "midday_1", tone: "gentle_reset", text: "A mindful pause can change your whole day. 🌿" },
      { id: "midday_2", tone: "soft_prompt", text: "Time to reset your rhythm — softly." },
      { id: "midday_3", tone: "zen_minimal", text: "Breathe. Reset. Continue." },
      { id: "midday_4", tone: "reassuring", text: "Your calm is just one breath away." }
    ]
  },
  {
    id: "evening",
    label: "Evening / Night",
    timeRange: { start: "18:00", end: "22:30" },
    defaultTime: "20:30",
    defaultTitle: "Evening unwind",
    messages: [
      { id: "evening_1", tone: "sleep_winddown", text: "Unwind your mind before sleep 🌙" },
      { id: "evening_2", tone: "letting_go", text: "Exhale the day. Inhale peace." },
      { id: "evening_3", tone: "guiding", text: "Let your breath guide you into rest." },
      { id: "evening_4", tone: "slow_down", text: "Slow down, your evening peace is here." }
    ]
  }
];

// Helper function to get category based on time
export const getCategoryByTime = (time: string): NotificationCategory => {
  const [hours, minutes] = time.split(':').map(Number);
  const timeInMinutes = hours * 60 + minutes;

  for (const category of NOTIFICATION_CATEGORIES) {
    const [startHours, startMinutes] = category.timeRange.start.split(':').map(Number);
    const [endHours, endMinutes] = category.timeRange.end.split(':').map(Number);
    
    const startInMinutes = startHours * 60 + startMinutes;
    const endInMinutes = endHours * 60 + endMinutes;

    if (timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes) {
      return category;
    }
  }

  // Default to morning if no match
  return NOTIFICATION_CATEGORIES[0];
};

// Helper function to get a random message from a category
export const getRandomMessage = (category: NotificationCategory): string => {
  const messages = category.messages;
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex].text;
};
