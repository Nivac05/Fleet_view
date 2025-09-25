"use client";

import { useState, useEffect } from "react";
import type {
  Vehicle,
  Kpi,
  WaitTime,
  FuelTrip,
  Utilization,
  DemandForecast,
  Trip,
  Zone,
} from "@/types";

const initialFleet: Vehicle[] = Array.from({ length: 15 }, (_, i) => ({
  id: `v${i + 1}`,
  vehicle_id: `FVT-${1001 + i}`,
  type: Math.random() > 0.4 ? "EV" : "ICE",
  soc: Math.floor(Math.random() * 80) + 20,
  status: ["free", "busy", "charging"][Math.floor(Math.random() * 3)] as "free" | "busy" | "charging",
  location: { lat: Math.random() * 500, lng: Math.random() * 800 },
}));

const initialKpis: Kpi = {
  requests_served: 187,
  avg_wait: 5.2,
  p90_wait: 12.8,
  ev_trips: 98,
  ice_trips: 89,
  utilization: 76.4,
};

const initialWaitTime: WaitTime[] = [
  { name: "0-2m", count: 30 },
  { name: "2-5m", count: 75 },
  { name: "5-10m", count: 50 },
  { name: "10-15m", count: 25 },
  { name: "15m+", count: 7 },
];

const initialFuelData: FuelTrip[] = [
  { name: "00:00", ev: 4, ice: 3 },
  { name: "04:00", ev: 6, ice: 5 },
  { name: "08:00", ev: 15, ice: 12 },
  { name: "12:00", ev: 25, ice: 20 },
  { name: "16:00", ev: 30, ice: 28 },
  { name: "20:00", ev: 18, ice: 21 },
];

const initialUtilization: Utilization[] = Array.from({ length: 12 }, (_, i) => ({
  time: `${i * 2}:00`,
  utilization: 60 + Math.sin(i) * 15 + Math.random() * 10,
}));

const initialDemand: DemandForecast[] = Array.from({ length: 12 }, (_, i) => {
  const p50 = 50 + Math.sin(i / 2) * 20 + Math.random() * 15;
  const uncertainty = 10 + Math.random() * 5;
  return {
    time: `+${i * 2}h`,
    p50: p50,
    p90_range: [p50 - uncertainty, p50 + uncertainty],
  };
});

const initialZones: Zone[] = [
    { id: 'zone1', name: 'Downtown', center: { lat: 250, lng: 400 }, radius: 80 },
    { id: 'zone2', name: 'Airport', center: { lat: 100, lng: 150 }, radius: 50 },
    { id: 'zone3', name: 'Suburbs', center: { lat: 400, lng: 650 }, radius: 60 },
];

const initialTrips: Trip[] = Array.from({ length: 5 }, (_, i) => ({
    id: `trip${i}`,
    from: { lat: Math.random() * 500, lng: Math.random() * 800 },
    to: { lat: Math.random() * 500, lng: Math.random() * 800 },
}));


export function useFleetData() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<Kpi>(initialKpis);
  const [fleetData, setFleetData] = useState<Vehicle[]>(initialFleet);
  const [waitTimeData, setWaitTimeData] = useState<WaitTime[]>(initialWaitTime);
  const [fuelData, setFuelData] = useState<FuelTrip[]>(initialFuelData);
  const [utilizationData, setUtilizationData] = useState<Utilization[]>(initialUtilization);
  const [demandForecastData, setDemandForecastData] = useState<DemandForecast[]>(initialDemand);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [zones, setZones] = useState<Zone[]>(initialZones);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      // KPIs
      setKpis((prev) => ({
        ...prev,
        requests_served: prev.requests_served + Math.floor(Math.random() * 3),
        avg_wait: Math.max(3, prev.avg_wait + (Math.random() - 0.5) * 0.2),
        utilization: Math.max(50, Math.min(95, prev.utilization + (Math.random() - 0.5) * 1)),
      }));

      // Fleet
      setFleetData((prev) =>
        prev.map((v) => ({
          ...v,
          soc: v.type === 'EV' ? Math.max(10, Math.min(100, v.soc + (v.status === 'charging' ? 5 : -1) + (Math.random()-0.5)*2)) : 100,
          status: Math.random() > 0.95 ? (["free", "busy", "charging"][Math.floor(Math.random() * 3)] as any) : v.status,
          location: {
              lat: (v.location.lat + (Math.random() - 0.5) * 20) % 500,
              lng: (v.location.lng + (Math.random() - 0.5) * 20) % 800,
          }
        }))
      );
      
      // Trips
      if(Math.random() > 0.7) {
        setTrips(prev => [...prev.slice(1), {
            id: `trip${Date.now()}`,
            from: { lat: Math.random() * 500, lng: Math.random() * 800 },
            to: { lat: Math.random() * 500, lng: Math.random() * 800 },
        }])
      }

      // Utilization
      setUtilizationData(prev => {
          const last = prev[prev.length - 1];
          const newUtil = {
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
              utilization: Math.max(50, Math.min(95, last.utilization + (Math.random() - 0.5) * 3))
          };
          return [...prev.slice(1), newUtil];
      })


    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);

  return { kpis, fleetData, waitTimeData, fuelData, utilizationData, demandForecastData, trips, zones, loading };
}
