"use client";

import { useEffect, useState } from "react";

interface ZoneAlloc {
  zone: string;
  demand: number;
  alloc_ev: number;
  alloc_ice: number;
  alloc_total: number;
  capacity_est: number;
  unserved: number;
}

interface Reposition {
  from: string;
  to: string;
  count: number;
}

interface DecisionData {
  zone_alloc: ZoneAlloc[];
  reposition_ev: Reposition[];
  reposition_ice: Reposition[];
}

export default function DecisionTable() {
  const [data, setData] = useState<DecisionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ First fetch snapshot (for SSR safety)
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/decision_layer?horizon=12");
        if (!res.ok) throw new Error("Failed to fetch decision layer");
        const json = await res.json();
        setData({
          zone_alloc: json.zone_alloc || [],
          reposition_ev: json.reposition_ev || [],
          reposition_ice: json.reposition_ice || [],
        });
      } catch (err: any) {
        setError(err.message);
      }
    }

    fetchData();

    // ✅ Live SSE updates
    const es = new EventSource("http://localhost:8000/decision_stream");
    es.onmessage = (e) => {
      try {
        const json = JSON.parse(e.data);
        setData({
          zone_alloc: json.zone_alloc || [],
          reposition_ev: json.reposition_ev || [],
          reposition_ice: json.reposition_ice || [],
        });
      } catch (err) {
        console.error("SSE parse error:", err, e.data);
      }
    };
    es.onerror = (err) => {
      console.error("SSE error:", err);
      es.close();
    };

    return () => {
      es.close();
    };
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>Loading decision layer…</div>;

  return (
    <div className="space-y-8">
      {/* Zone Allocation Table */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Per-zone allocation & KPI</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
                <th className="border px-2 py-1">Zone</th>
                <th className="border px-2 py-1">Demand</th>
                <th className="border px-2 py-1">EV</th>
                <th className="border px-2 py-1">ICE</th>
                <th className="border px-2 py-1">Total</th>
                <th className="border px-2 py-1">Capacity Est</th>
                <th className="border px-2 py-1">Unserved</th>
            </tr>
          </thead>

          <tbody>
            {data.zone_alloc.map((z, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{z.zone}</td>
                <td className="border px-2 py-1">{z.demand?.toFixed(2)}</td>
                <td className="border px-2 py-1">{z.alloc_ev}</td>
                <td className="border px-2 py-1">{z.alloc_ice}</td>
                <td className="border px-2 py-1">{z.alloc_total}</td>
                <td className="border px-2 py-1">{z.capacity_est?.toFixed(1)}</td>
                <td className="border px-2 py-1">{z.unserved?.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reposition EV */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Reposition moves (EV)</h2>
        {data.reposition_ev.length === 0 ? (
          <p className="text-gray-500 text-sm">No EV moves</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                <tr>
                    <th className="border px-2 py-1">From</th>
                    <th className="border px-2 py-1">To</th>
                    <th className="border px-2 py-1">Count</th>
                </tr>
                </thead>

            <tbody>
              {data.reposition_ev.map((r, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{r.from}</td>
                  <td className="border px-2 py-1">{r.to}</td>
                  <td className="border px-2 py-1">{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reposition ICE */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Reposition moves (ICE)</h2>
        {data.reposition_ice.length === 0 ? (
          <p className="text-gray-500 text-sm">No ICE moves</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-2 py-1">From</th>
                <th className="border px-2 py-1">To</th>
                <th className="border px-2 py-1">Count</th>
              </tr>
            </thead>
            <tbody>
              {data.reposition_ice.map((r, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{r.from}</td>
                  <td className="border px-2 py-1">{r.to}</td>
                  <td className="border px-2 py-1">{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
