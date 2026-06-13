"use client";

import { useEffect, useState } from "react";
import { getMockSession, type MockSession } from "./mockAuth";

export function useMockSession() {
  const [session, setSession] = useState<MockSession | null>(null);
  const [hasLoadedSession, setHasLoadedSession] = useState(false);

  useEffect(() => {
    setSession(getMockSession());
    setHasLoadedSession(true);
  }, []);

  return { hasLoadedSession, session, setSession };
}
