"use client";

import { useEffect } from "react";

export default function OfflineRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => { /* IndexedDB remains available. */ });
    }
  }, []);
  return null;
}
