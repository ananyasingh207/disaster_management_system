import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminDashboard() {
  const [volunteers, setVolunteers] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.get("/admin/volunteers").then((r) => setVolunteers(r.data));
    api.get("/admin/alerts").then((r) => setAlerts(r.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <h2 className="text-lg mb-2 font-semibold">Volunteers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {volunteers.map((v) => (
          <div key={v._id} className="glass-panel p-4">
            <h3>{v.name}</h3>
            <p>Phone: {v.phone}</p>
            <p>Status: {v.status}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg mb-2 font-semibold mt-6">Recent Alerts</h2>
      {alerts.map((a) => (
        <div
          key={a._id}
          className="border border-red-500 rounded p-3 mb-3"
        >
          <h4 className="font-bold">{a.type}</h4>
          <p>{a.message}</p>
        </div>
      ))}
    </div>
  );
}
