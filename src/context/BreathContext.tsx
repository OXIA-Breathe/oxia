
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { BreathSession, BreathSettings } from "../types/breath";

interface BreathContextType {
  sessions: BreathSession[];
  addSession: (session: BreathSession) => void;
  settings: BreathSettings;
  updateSettings: (settings: Partial<BreathSettings>) => void;
}

const defaultSettings: BreathSettings = {
  inhaleDuration: 4,
  exhaleDuration: 4,
  holdDuration: 4,
  repetitions: 5,
};

const BreathContext = createContext<BreathContextType | undefined>(undefined);

export const BreathProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<BreathSession[]>(() => {
    const savedSessions = localStorage.getItem("breathSessions");
    return savedSessions ? JSON.parse(savedSessions) : [];
  });

  const [settings, setSettings] = useState<BreathSettings>(() => {
    const savedSettings = localStorage.getItem("breathSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("breathSessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("breathSettings", JSON.stringify(settings));
  }, [settings]);

  const addSession = (session: BreathSession) => {
    setSessions((prev) => [session, ...prev]);
  };

  const updateSettings = (newSettings: Partial<BreathSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <BreathContext.Provider value={{ sessions, addSession, settings, updateSettings }}>
      {children}
    </BreathContext.Provider>
  );
};

export const useBreath = () => {
  const context = useContext(BreathContext);
  if (context === undefined) {
    throw new Error("useBreath must be used within a BreathProvider");
  }
  return context;
};
