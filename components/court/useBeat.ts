"use client";
import { useEffect, useState } from "react";

/** Flips true/false every `ms` while `on` — drives mouth and gesture frames. */
export function useBeat(on: boolean, ms: number) {
  const [beat, setBeat] = useState(false);
  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => setBeat((b) => !b), ms);
    return () => clearInterval(t);
  }, [on, ms]);
  return on && beat;
}
