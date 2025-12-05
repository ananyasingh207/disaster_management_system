import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

export default function MissionDetails() {
  const { id } = useParams();
  const [mission, setMission] = useState(null);

  useEffect(() => {
    api.get(`/missions/${id}`).then((res) => setMission(res.data));
  }, [id]);

  if (!mission) return <p>Loading...</p>;

  const acceptMission = async () => {
    await api.post(`/missions/${id}/accept`);
    window.location.reload();
  };

  const completeMission = async () => {
    await api.post(`/missions/${id}/complete`);
    window.location.reload();
  };

  return (
    <div className="glass-panel p-6">
      <h1 className="text-2xl font-bold">{mission.title}</h1>
      <p className="text-gray-300">{mission.description}</p>

      <p className="mt-3">
        <strong>Status:</strong>{" "}
        <span className="text-red-400">{mission.status}</span>
      </p>

      <div className="mt-4 flex gap-3">
        {mission.status === "PENDING" && (
          <button
            onClick={acceptMission}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Accept Mission
          </button>
        )}

        {mission.status === "ACCEPTED" && (
          <button
            onClick={completeMission}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Complete Mission
          </button>
        )}
      </div>
    </div>
  );
}
