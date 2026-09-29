"use client";

import { useEffect, useState } from "react";
import type { PlaceRef } from "../lib/tripSession";
import styles from "../JourneyFlow.module.css";

type Suggestion = { id: string; name: string };

export default function PlacePicker({ id, label, value, place, onChange, required = false }: {
  id: string; label: string; value: string; place?: PlaceRef;
  onChange: (text: string, place?: PlaceRef) => void; required?: boolean;
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open || place || value.trim().length < 3) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/maps/places?q=${encodeURIComponent(value)}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setSuggestions(data.suggestions);
        setError("");
      } catch (cause) {
        if (!controller.signal.aborted) { setSuggestions([]); setError(cause instanceof Error ? cause.message : "Place search failed."); }
      }
    }, 350);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [open, place, value]);

  return <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    <input id={id} className={styles.input} value={value} required={required} autoComplete="off"
      role="combobox" aria-expanded={open && suggestions.length > 0} aria-controls={`${id}-suggestions`}
      onFocus={() => setOpen(true)} onBlur={() => window.setTimeout(() => setOpen(false), 150)}
      onChange={(event) => { onChange(event.target.value, undefined); setOpen(true); setSuggestions([]); }} />
    {place ? <small>Verified place · {place.address ?? place.name}</small> : value ? <small>Select a suggestion to attach a place ID.</small> : null}
    {open && suggestions.length > 0 ? <div id={`${id}-suggestions`} className={styles.placeSuggestions} role="listbox">
      {suggestions.map((suggestion) => <button key={suggestion.id} type="button" role="option" aria-selected={false}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => { onChange(suggestion.name, { provider: "google", id: suggestion.id, name: suggestion.name }); setSuggestions([]); setOpen(false); }}>
        {suggestion.name}</button>)}
      <small>Powered by Google</small>
    </div> : null}
    {error && open ? <small role="status">{error}</small> : null}
  </div>;
}
