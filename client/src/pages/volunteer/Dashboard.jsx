import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState({
    adminAlerts: [],
    citizenAlerts: [],
    activeMissions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/volunteer/dashboard");

        // 🔒 Normalize backend response (CRASH FIX)
        setData({
          adminAlerts: res.data.adminAlerts || [],
          citizenAlerts: res.data.citizenAlerts || [],
          activeMissions: res.data.activeMissions || [],
        });
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setData({
          adminAlerts: [],
          citizenAlerts: [],
          activeMissions: [],
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-white font-mono animate-pulse">
        SYNCING TACTICAL DATA...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
      {/* HEADER */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          Volunteer Dashboard
        </h1>
        <p className="text-slate-400 font-medium">
          Live situational awareness and command feed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          {/* ACTIVE MISSIONS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl border-l-4 border-l-emerald-500">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Current Assignment
            </h3>

            {data.activeMissions.length === 0 ? (
              <div className="text-slate-500 italic py-4 border border-dashed border-slate-800 rounded-lg text-center text-sm">
                No active directives. Standby mode engaged.
              </div>
            ) : (
              data.activeMissions.map((m) => (
                <div
                  key={m._id}
                  className="bg-slate-800/50 p-4 rounded-xl border border-slate-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-white">
                      {m.title || "Untitled Mission"}
                    </h4>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 font-bold tracking-wider">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    {m.description || "No description provided."}
                  </p>
                  <Link to={`/volunteer/missions/${m._id}`}>
                    <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs transition-colors">
                      VIEW TACTICAL DETAILS →
                    </button>
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* ADMIN BROADCASTS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
              <span>📡</span> Command Broadcasts
            </h3>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {data.adminAlerts.length === 0 && (
                <p className="text-slate-500 text-sm">No recent signals.</p>
              )}

              {data.adminAlerts.map((a) => (
                <div
                  key={a._id}
                  className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-amber-500">
                      [{a.type || "INFO"}]
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        a.severity === "CRITICAL"
                          ? "border-red-500 text-red-500 bg-red-500/10"
                          : "border-slate-600 text-slate-400"
                      }`}
                    >
                      {a.severity || "NORMAL"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 mb-2">
                    {a.message}
                  </p>
                  <div className="text-[10px] text-slate-600 font-mono">
                    Target: {a.region || "Global"} •{" "}
                    {a.createdAt
                      ? new Date(a.createdAt).toLocaleTimeString()
                      : "--"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-6 shadow-xl h-fit">
          <h3 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            Citizen Distress Signals
          </h3>

          <div className="space-y-4">
            {data.citizenAlerts.length === 0 && (
              <div className="text-center py-12 text-slate-600 border border-dashed border-slate-800 rounded-xl">
                No active distress signals in your sector.
              </div>
            )}

            {data.citizenAlerts.map((c) => (
              <div
                key={c._id}
                className="relative bg-red-900/10 border border-red-500/30 p-5 rounded-xl hover:bg-red-900/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white">
                    {c.type || "Unknown"} Incident
                  </h4>
                  <span className="text-[10px] font-mono text-red-300/70">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleTimeString()
                      : "--"}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-3">
                  {c.description || "No details available."}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-black/20 p-2 rounded w-fit">
                  📍 {c.location || "Unknown Location"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
