"use client";

import { useEffect, useState } from "react";
import { type MockSession, watchCurrentSession } from "./repositories/authRepository";

export function useMockSession() {
  const [session, setSession] = useState<MockSession | null>(null);
  const [hasLoadedSession, setHasLoadedSession] = useState(false);

  useEffect(() => {
    return watchCurrentSession((nextSession) => {
      setSession(nextSession);
      setHasLoadedSession(true);
    });
  }, []);

  return { hasLoadedSession, session, setSession };
}
