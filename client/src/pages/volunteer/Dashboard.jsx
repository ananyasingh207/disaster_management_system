import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState({
    activeIncidents: [],
    assignedIncidents: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/volunteer/dashboard");
        setData({
          activeIncidents: res.data.activeIncidents || [],
          assignedIncidents: res.data.assignedIncidents || [],
        });
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-white font-mono animate-pulse">
        CONNECTING TO COMMAND GRID...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
      {/* HEADER */}
      <div className="mb-8 border-b border-slate-800 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Mission Control
          </h1>
          <p className="text-slate-400 text-sm">
            Real-time dashboard for incident response and deployment.
          </p>
        </div>
        <div className="text-right">
          <span className="block text-2xl font-bold text-emerald-500">
            {data.assignedIncidents.length}
          </span>
          <span className="text-xs text-slate-500 uppercase tracking-widest">
            Active Operations
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {/* SECTION 1: LIVE ACTIVE INCIDENTS (REMOVED - Admin Assignment Only) */}
        {/* Volunteers cannot see PENDING incidents anymore. */}

        {/* SECTION 2: ONGOING OPERATIONS (Assigned) */}
        <section className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider text-xs">
              <span>🛡️</span> Ongoing Operations
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {data.assignedIncidents.length} ASSIGNED
            </span>
          </div>

          {data.assignedIncidents.length === 0 ? (
            <div className="text-center py-12 text-slate-600 text-sm italic border border-dashed border-slate-800 rounded-xl">
              No active operations assigned. Stand by for deployment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.assignedIncidents.map((c) => (
                <div
                  key={c._id}
                  className="bg-slate-800/20 border border-slate-700/50 p-5 rounded-xl hover:bg-slate-800/40 transition-all opacity-90 hover:opacity-100 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border text-blue-400 bg-blue-500/10 border-blue-500/20">
                      IN PROGRESS
                    </span>
                    <span className="text-[10px] font-mono text-slate-600">
                      ID: {c._id.slice(-4)}
                    </span>
                  </div>

                  <h5 className="font-bold text-slate-300 text-sm mb-1 truncate group-hover:text-white transition-colors">
                    {c.title}
                  </h5>

                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                    {c.description}
                  </p>

                  <div className="flex justify-between items-center mt-auto border-t border-slate-700/30 pt-3">
                    <span className="text-[10px] text-slate-600 font-mono truncate max-w-[120px] flex items-center gap-1">
                      📍 {c.location?.address || "Location unavailable"}
                    </span>
                    <Link to={`/volunteer/incidents/${c._id}`}>
                      <button className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors">
                        View Details →
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
