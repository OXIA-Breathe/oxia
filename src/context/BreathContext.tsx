
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { BreathSession } from "../types/breath";

interface BreathContextType {
  sessions: BreathSession[];
  addSession: (session: BreathSession) => void;
}

const BreathContext = createContext<BreathContextType | undefined>(undefined);

export const BreathProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<BreathSession[]>(() => {
    const savedSessions = localStorage.getItem("breathSessions");
    return savedSessions ? JSON.parse(savedSessions) : [];
  });

  useEffect(() => {
    localStorage.setItem("breathSessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (session: BreathSession) => {
    setSessions((prev) => [session, ...prev]);
  };

  return (
    <BreathContext.Provider value={{ sessions, addSession }}>
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
