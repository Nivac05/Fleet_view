"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMap, LoadScript, Marker, TrafficLayer } from "@react-google-maps/api";
import Papa from "papaparse"; // CSV parser
import { createClient } from "@supabase/supabase-js";

// 🔹 Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Vehicle = {
  Vehicle_ID: string;
  Vehicle_Type: string;
  Fuel_Type: string;
  Current_Zone: string;
  Capacity: number;
  ["Energy_Level(%)"]: number;
  Is_Charging_Station_Zone: string;
  lat?: number;
  lng?: number;
  status?: "idle" | "moving";
};

async function fetchVehiclesFromStorage(): Promise<Vehicle[]> {
  const { data, error } = await supabase.storage
    .from("uploads")
    .download("uploads/Vehicles.csv");

  if (error) {
    console.error("Error downloading CSV:", error.message);
    return [];
  }

  const text = await data.text();

  const parsed = Papa.parse<Vehicle>(text, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data;
}

export function MapVisualization() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0.5rem",
  };

  // 🔹 Chennai center (shifted a bit right)
  const center = { lat: 13.0827, lng: 80.32 };

  // 🔹 Chennai bounding box
  const bounds = {
    north: 13.2,
    south: 12.9,
    east: 80.35,
    west: 80.15,
  };

  // 🔹 Get random lat/lng with strong left shift
  const getRandomLocation = () => {
    const lat = bounds.south + Math.random() * (bounds.north - bounds.south);
    let lng = bounds.west + Math.random() * (bounds.east - bounds.west);
    lng = lng - 0.09; // shift further left
    return { lat, lng };
  };

  // 🔹 Assign custom icon by vehicle type
  const getIcon = (vehicle: Vehicle) => {
    if (vehicle.Fuel_Type === "EV") {
      return {
        url: "https://maps.google.com/mapfiles/kml/shapes/charging.png",
        scaledSize: new google.maps.Size(36, 36),
      };
    }
    if (vehicle.Vehicle_Type === "Ambulance") {
      return {
        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new google.maps.Size(32, 32),
      };
    }
    if (vehicle.Vehicle_Type === "Bus") {
      return {
        url: "https://maps.google.com/mapfiles/kml/shapes/truck.png",
        scaledSize: new google.maps.Size(34, 34),
      };
    }
    return {
      url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
      scaledSize: new google.maps.Size(30, 30),
    };
  };

  useEffect(() => {
    const loadVehicles = async () => {
      const vehicles = await fetchVehiclesFromStorage();

      const initialized = vehicles.map((v) => {
        const { lat, lng } = getRandomLocation();
        return {
          ...v,
          lat,
          lng,
          status: Math.random() > 0.5 ? "moving" : "idle",
        };
      });

      setVehicles(initialized);
    };

    loadVehicles();
  }, []);

  // 🔹 Movement simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.status === "moving" && v.lat && v.lng) {
            return {
              ...v,
              lat: v.lat + (Math.random() - 0.5) * 0.001,
              lng: v.lng + (Math.random() - 0.5) * 0.001,
            };
          }
          return v;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-[464px] lg:h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Live Fleet Map</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="w-full h-full bg-muted/30 rounded-lg relative overflow-hidden border">
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
              <TrafficLayer />
              {vehicles.map((v) => (
                <Marker
                  key={v.Vehicle_ID}
                  position={{ lat: v.lat!, lng: v.lng! }}
                  icon={getIcon(v)}
                  label={v.Vehicle_Type[0]}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </CardContent>
    </Card>
  );
}``