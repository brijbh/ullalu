"use client";

import { useEffect, useState } from "react";
import styles from "../JourneyFlow.module.css";
import type { PlaceRef } from "../lib/tripSession";

type Place = {
  name: string;
  zone: string;
  latitude: number;
  longitude: number;
};

const home: Place = {
  name: "Bengaluru",
  zone: "Asia/Kolkata",
  latitude: 12.9716,
  longitude: 77.5946,
};

const destinations = {
  Tokyo: { name: "Tokyo", zone: "Asia/Tokyo", latitude: 35.6762, longitude: 139.6503 },
  Kyoto: { name: "Kyoto", zone: "Asia/Tokyo", latitude: 35.0116, longitude: 135.7681 },
} satisfies Record<string, Place>;

type Destination = keyof typeof destinations;
type Temperatures = { home?: number; destination?: number };

const weatherCache = new Map<string, { temperature: number; fetchedAt: number }>();
const weatherRefreshMs = 15 * 60 * 1000;

function cachedTemperature(place: Place) {
  const cached = weatherCache.get(place.name);
  return cached && Date.now() - cached.fetchedAt < weatherRefreshMs ? cached.temperature : undefined;
}

function localTime(now: Date | null, zone: string) {
  if (!now) return "--:--";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: zone,
  }).format(now);
}

async function currentTemperature(place: Place, signal: AbortSignal) {
  const cached = cachedTemperature(place);
  if (cached !== undefined && place.zone !== "UTC") return { temperature: cached, zone: place.zone };

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(place.latitude));
  url.searchParams.set("longitude", String(place.longitude));
  url.searchParams.set("current", "temperature_2m");
  url.searchParams.set("temperature_unit", "celsius");
  url.searchParams.set("forecast_days", "1");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Weather unavailable");
  const data = await response.json() as { current?: { temperature_2m?: number }; timezone?: string };
  const temperature = data.current?.temperature_2m;
  if (typeof temperature !== "number" || !Number.isFinite(temperature)) throw new Error("Weather unavailable");
  weatherCache.set(place.name, { temperature, fetchedAt: Date.now() });
  return { temperature, zone: data.timezone ?? place.zone };
}

function StatusCard({ label, place, now, temperature }: {
  label: string;
  place: Place;
  now: Date | null;
  temperature?: number;
}) {
  return (
    <div className={styles.travelStatusCard} aria-label={`${label}, ${place.name}: ${localTime(now, place.zone)}, ${temperature === undefined ? "temperature unavailable" : `${Math.round(temperature)} degrees Celsius`}`}>
      <div className={styles.travelStatusTop}>
        <span>{label}</span>
        <strong>{temperature === undefined ? "—°" : `${Math.round(temperature)}°`}</strong>
      </div>
      <div className={styles.travelStatusBottom}>
        <strong>{localTime(now, place.zone)}</strong>
        <span>{place.name}</span>
      </div>
    </div>
  );
}

export default function TravelStatusBar({ destination = "Tokyo" }: { destination?: Destination | PlaceRef }) {
  const [now, setNow] = useState<Date | null>(null);
  const [temperatures, setTemperatures] = useState<Temperatures>({});
  const [resolvedPlace, setResolvedPlace] = useState<Place | null>(null);
  const currentPlace = typeof destination === "string" ? destinations[destination] : resolvedPlace;

  useEffect(() => {
    if (typeof destination === "string") return;
    const controller = new AbortController();
    fetch(`/api/maps/places/${encodeURIComponent(destination.id)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Location unavailable")))
      .then((data) => {
        if (Number.isFinite(data.location?.latitude) && Number.isFinite(data.location?.longitude))
          setResolvedPlace({ name: destination.name, zone: "UTC", latitude: data.location.latitude, longitude: data.location.longitude });
      }).catch(() => {});
    return () => controller.abort();
  }, [destination]);

  useEffect(() => {
    setNow(new Date());
    const clock = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    if (!currentPlace) return;
    const controller = new AbortController();
    let active = true;
    setTemperatures({
      home: cachedTemperature(home),
      destination: cachedTemperature(currentPlace),
    });
    const updateWeather = () => {
      void Promise.allSettled([
        currentTemperature(home, controller.signal),
        currentTemperature(currentPlace, controller.signal),
      ]).then(([homeResult, destinationResult]) => {
        if (!active) return;
        setTemperatures({
          home: homeResult.status === "fulfilled" ? homeResult.value.temperature : undefined,
          destination: destinationResult.status === "fulfilled" ? destinationResult.value.temperature : undefined,
        });
        if (destinationResult.status === "fulfilled" && typeof destination !== "string") {
          const zone = destinationResult.value.zone;
          setResolvedPlace((previous) => previous && previous.zone !== zone ? { ...previous, zone } : previous);
        }
      });
    };
    updateWeather();
    const weather = window.setInterval(updateWeather, weatherRefreshMs);
    return () => {
      active = false;
      controller.abort();
      window.clearInterval(weather);
    };
  }, [currentPlace, destination]);

  return (
    <aside className={styles.travelStatusBar} aria-label="Current time and temperature at home and the destination">
      <StatusCard label="HOME" place={home} now={now} temperature={temperatures.home} />
      {currentPlace ? <StatusCard label="TRIP" place={currentPlace} now={now} temperature={temperatures.destination} /> : null}
    </aside>
  );
}
