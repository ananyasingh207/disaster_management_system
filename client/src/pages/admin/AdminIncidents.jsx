import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { normalizeAlert, formatDateOnly } from "../../utils/normalizeAdminData";

export default function AdminIncidents() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("CITIZEN"); // Tabs: CITIZEN or VOLUNTEER

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/admin/alerts");
      // Normalize all alert data using shared helper
      const normalized = (res.data || []).map(normalizeAlert);
      setAlerts(normalized);
    } catch (err) {
      console.error("Failed to load incidents", err);
      // Set empty array on error to prevent crashes
      setAlerts([]);
    }
  };

  const displayed = alerts.filter((a) =>
    filter === "CITIZEN" ? a.typeTag === "INCIDENT" : a.typeTag === "REPORT"
  );

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        Live Incidents
      </h3>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("CITIZEN")}
          className={`px-4 py-2 rounded-lg font-bold text-sm ${
            filter === "CITIZEN"
              ? "bg-amber-500 text-black"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Citizen Reports
        </button>
        <button
          onClick={() => setFilter("VOLUNTEER")}
          className={`px-4 py-2 rounded-lg font-bold text-sm ${
            filter === "VOLUNTEER"
              ? "bg-amber-500 text-black"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Volunteer Reports
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {displayed.map((a) => (
          <div
            key={a._id}
            className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-amber-500 transition-all group"
          >
            <div className="flex justify-between text-xs font-mono text-slate-500 mb-3">
              <span className="uppercase">{a.type}</span>
              <span
                className={`font-bold ${
                  a.severity === "HIGH" || a.severity === "CRITICAL"
                    ? "text-red-500"
                    : a.severity === "MEDIUM"
                    ? "text-amber-500"
                    : "text-green-500"
                }`}
              >
                {a.severity}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
              {a.title || "Untitled Incident"}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-3 mb-4">{a.description || a.message}</p>

            <div className="flex justify-between text-[10px] text-slate-600 font-mono mb-4">
              <span className="flex items-center gap-1">
                <span className="text-blue-400">Source:</span> {a.source || a.author || "Anonymous"}
              </span>
              <span>{formatDateOnly(a.createdAt, "Date unavailable")}</span>
            </div>

            {/* Open Case Button */}
            <Link to={`/admin/incidents/${a._id}`}>
              <button className="w-full bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-300 text-xs font-bold py-2.5 rounded transition-colors border border-slate-700">
                OPEN CASE →
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}