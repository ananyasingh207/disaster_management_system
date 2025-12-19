import { useEffect, useState } from "react";
import api from "../../api";
import { normalizeSOS, formatDate } from "../../utils/normalizeAdminData";

export default function AdminDashboard() {
  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSOS();
  }, []);

  const loadSOS = async () => {
    try {
      const res = await api.get("/sos/all");
      // Normalize all SOS data using shared helper
      const normalized = (res.data || []).map(normalizeSOS);
      setSosList(normalized);
    } catch (err) {
      console.error("SOS Load Error:", err);
      // Set empty array on error to prevent crashes
      setSosList([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-slate-400 animate-pulse font-mono">
        INITIALIZING SOS CONTROL PANEL...
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">

      {/* HEADER */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white mb-2">
          SOS Command Panel
        </h1>
        <p className="text-slate-400">
          Immediate Emergency Signal Monitoring
        </p>
      </div>

      {/* SOS PANEL */}
      <div className="bg-slate-900/60 border border-red-500/20 rounded-2xl p-8">

        <h3 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Active SOS Signals
        </h3>

        {sosList.length === 0 ? (
          <p className="text-slate-500 italic">
            No SOS alerts detected.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sosList.map((sos) => (
              <div
                key={sos._id}
                className="bg-[#0c0c0c] rounded-xl p-6 shadow-lg shadow-red-900/20 border border-white/5"
              >
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-bold text-red-400">
                    EMERGENCY SIGNAL
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatDate(sos.timestamp, "Time unavailable")}
                  </span>
                </div>

                <div className="text-sm font-mono text-white mb-4">
                  Latitude: {sos.latitude !== null ? sos.latitude : "N/A"}
                  <br />
                  Longitude: {sos.longitude !== null ? sos.longitude : "N/A"}
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded transition">
                    ACKNOWLEDGE
                  </button>

                  <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded transition">
                    VIEW MAP
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
