"use client";

import { useEffect, useState } from "react";
import { getCurrentSession, type MockSession } from "./repositories/authRepository";

export function useMockSession() {
  const [session, setSession] = useState<MockSession | null>(null);
  const [hasLoadedSession, setHasLoadedSession] = useState(false);

  useEffect(() => {
    setSession(getCurrentSession());
    setHasLoadedSession(true);
  }, []);

  return { hasLoadedSession, session, setSession };
}
