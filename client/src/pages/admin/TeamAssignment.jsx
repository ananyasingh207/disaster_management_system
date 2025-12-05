import { useState, useEffect } from "react";
import api from "../../api";

export default function TeamAssignment() {
  const [teams, setTeams] = useState([]);
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    api.get("/admin/teams").then((res) => setTeams(res.data));
    api.get("/missions").then((res) => setMissions(res.data));
  }, []);

  const assign = async (missionId, teamId) => {
    await api.post(`/admin/missions/${missionId}/assign-team`, { teamId });
    window.location.reload();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Team Assignment</h1>

      <div className="grid gap-4">
        {missions.map((m) => (
          <div key={m._id} className="glass-panel p-4">
            <h3>{m.title}</h3>
            <p>Status: {m.status}</p>

            <select
              className="glass-input mt-2"
              onChange={(e) => assign(m._id, e.target.value)}
            >
              <option>Select Team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
