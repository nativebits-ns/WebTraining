"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const KEY = "project-explorer:favorites";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

const getSnapshot = () => localStorage.getItem(KEY) ?? "[]";
const getServerSnapshot = () => "[]";

function parse(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ids = useMemo(() => parse(raw), [raw]);

  const toggle = useCallback((id: string) => {
    const current = parse(getSnapshot());
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    localStorage.setItem(KEY, JSON.stringify(next));
    listeners.forEach((l) => l());
  }, []);

  return { ids, toggle };
}
