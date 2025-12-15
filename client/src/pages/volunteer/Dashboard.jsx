import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState({
    activeIncidents: [],
    assignedIncidents: [],
    completedIncidents: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/volunteer/dashboard");
        setData({
          activeIncidents: res.data.activeIncidents || [],
          assignedIncidents: res.data.assignedIncidents || [],
          completedIncidents: res.data.completedIncidents || []
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
        {/* SECTION 1: ONGOING OPERATIONS (Assigned) */}
        <section className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider text-xs">
              Ongoing Operations
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
                      Location: {c.location?.address || "Location unavailable"}
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

        {/* SECTION 2: COMPLETED ASSIGNMENTS (History Tables) */}
        <section className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider text-xs">
              Mission History
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {data.completedIncidents?.length || 0} COMPLETED
            </span>
          </div>

          {!data.completedIncidents || data.completedIncidents.length === 0 ? (
            <div className="text-center py-8 text-slate-600 text-sm italic">
              No completed missions on record.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Completed On</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-400">
                  {data.completedIncidents.map((inc) => (
                    <tr key={inc._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs">{inc._id.slice(-6).toUpperCase()}</td>
                      <td className="py-3 px-4 font-medium text-slate-300">{inc.title}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${inc.severity === "CRITICAL" || inc.severity === "HIGH" ? "text-red-400 border-red-500/20 bg-red-500/5" :
                          "text-sky-400 border-sky-500/20 bg-sky-500/5"
                          }`}>
                          {inc.severity || "NORMAL"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono truncate max-w-[150px]">
                        {inc.location?.address || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono">
                        {new Date(inc.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                          COMPLETED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
