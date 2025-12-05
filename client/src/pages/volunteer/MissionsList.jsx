import { useEffect, useState } from "react";
import api from "../../api";

export default function MissionsList() {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    api.get("/missions").then((res) => setMissions(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Missions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((m) => (
          <div key={m._id} className="glass-panel p-4">
            <h3 className="font-bold text-lg">{m.title}</h3>
            <p className="text-sm text-gray-400">{m.description}</p>
            <a
              href={`/volunteer/missions/${m._id}`}
              className="text-red-400 underline"
            >
              View →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
