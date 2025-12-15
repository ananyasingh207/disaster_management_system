import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState({
    citizenAlerts: [], // Mapped to InProgress
    activeMissions: [], // Mapped to Active
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/volunteer/dashboard");

        // 🔒 Normalize backend response
        setData({
          citizenAlerts: res.data.inProgressIncidents || [],
          activeMissions: res.data.activeIncidents || [],
        });
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setData({
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
        SYNCING COMMAND DATA...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
      {/* HEADER */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Command Dashboard
        </h1>
        <p className="text-slate-400 text-sm">
          Operational overview for active deployments and alerts.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {/* SECTION 1: LIVE ACTIVE INCIDENTS (Needs Action) */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Active Incidents (Awaiting Response)
            </h3>
            <span className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400">
              {data.activeMissions.length} DETECTED
            </span>
          </div>

          {data.activeMissions.length === 0 ? (
            <div className="py-12 border border-dashed border-slate-800 rounded-xl text-center bg-slate-950/30">
              <p className="text-slate-500 text-sm font-medium">
                No active incidents requiring immediate intervention.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.activeMissions.map((m) => (
                <div
                  key={m._id}
                  className="bg-slate-800/40 p-6 rounded-xl border border-slate-700 hover:border-slate-500 transition-all shadow-sm group"
                >
                  {/* DEBUG LOG */}
                  {console.log("DEBUG INCIDENT ITEM:", m)}

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <span className={`text-[10px] px-3 py-1 rounded-full border font-bold tracking-wider ${m.status === 'PENDING' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {m.status || "ACTIVE"}
                      </span>
                      <span className="text-[10px] bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full border border-slate-600 font-mono tracking-wider">
                        {m.sourceType === "CITIZEN" ? "Citizen Report" : m.sourceType || "System"}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {m.title || "Emergency Incident"}
                  </h4>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-2">
                    {m.description || "No operational details provided."}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-700/50 pt-4 mt-auto">
                    <div className="text-xs text-slate-500 font-mono">
                      {/* Priority: location.address -> String location -> Fallback */}
                      📍 {m.location?.address
                        ? m.location.address
                        : (typeof m.location === 'string' ? m.location : 'Location unavailable')}
                    </div>
                    <Link to={`/ volunteer / missions / ${m._id} `}>
                      <button className="bg-slate-900 border border-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded text-xs transition-colors">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2: ONGOING OPERATIONS (In Progress) */}
        <section className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-8">
          <h3 className="text-lg font-bold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-wider text-xs">
            <span>🛡️</span> Ongoing Operations (In Progress)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.citizenAlerts.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-600 border border-dashed border-slate-800 rounded-xl text-sm italic">
                No active operations in progress.
              </div>
            )}

            {data.citizenAlerts.map((c) => (
              <div
                key={c._id}
                className="bg-slate-800/20 border border-slate-700/50 p-5 rounded-xl hover:bg-slate-800/30 transition-all opacity-80 hover:opacity-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide">
                      {c.status || "IN PROGRESS"}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                      {c.sourceType === "CITIZEN" ? "Citizen Report" : c.sourceType || "System"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">
                    ID: {c._id.slice(-4)}
                  </span>
                </div>

                <h5 className="font-bold text-slate-300 text-sm mb-1 truncate">
                  {c.title}
                </h5>

                <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                  {c.description || "Operational task."}
                </p>

                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono">
                  <span>
                    📍 {c.location?.address || (typeof c.location === 'string' ? c.location : 'Location unavailable')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
