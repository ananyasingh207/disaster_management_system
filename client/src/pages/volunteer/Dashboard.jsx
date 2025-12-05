import { useEffect, useState } from "react";
import api from "../../api";

export default function Dashboard() {
  const [missions, setMissions] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.get("/missions").then((res) => setMissions(res.data));
    api.get("/volunteer/alerts").then((res) => setAlerts(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Volunteer Dashboard</h1>

      <h2 className="text-xl font-semibold mb-2">Active Missions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.filter(m => m.status !== "COMPLETED").map((m) => (
          <div key={m._id} className="glass-panel p-4">
            <h3 className="font-bold text-lg">{m.title}</h3>
            <p className="text-sm text-gray-400">{m.description}</p>
            <a
              href={`/volunteer/missions/${m._id}`}
              className="text-red-400 underline"
            >
              View Mission →
            </a>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Alerts</h2>
      {alerts.length === 0 && <p>No alerts</p>}

      {alerts.map((a) => (
        <div key={a._id} className="border border-red-400 p-3 rounded mb-2">
          <h4 className="font-bold">{a.type.toUpperCase()}</h4>
          <p>{a.message}</p>
        </div>
      ))}
    </div>
  );
}
