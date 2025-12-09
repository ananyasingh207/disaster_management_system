import { useEffect, useState } from "react";
import api from "../../api"; // Using your existing API setup

export default function ReliefOps() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Relief Data
  useEffect(() => {
    api.get("/admin/relief") // Maps to exports.getReliefRequests
      .then((res) => {
        // Filter to show only pending/active requests
        const pendingOnly = res.data.filter(r => r.status !== 'COMPLETED' && r.status !== 'RESOLVED');
        setRequests(pendingOnly);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading relief data", err);
        setLoading(false);
      });
  }, []);

  // 2. Handle Button Click
  const handleComplete = async (id) => {
    if (!window.confirm("Mark relief mission as COMPLETE?")) return;

    try {
      // Calls the acknowledgeIncident function we updated in Step 1
      await api.post("/admin/acknowledge", { sourceId: id });

      // Update UI: Remove the completed item from the list immediately
      setRequests((prev) => prev.filter((req) => req._id !== id));
      
      alert("Mission Marked as Complete");
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Relief Operations</h1>
          <p className="text-slate-400">Manage direct appeals for shelter, food, and medical aid.</p>
        </div>
        <div className="border border-emerald-500/30 bg-emerald-900/10 px-4 py-2 rounded text-emerald-400 font-bold text-xs uppercase tracking-widest">
          {requests.length} Pending Requests
        </div>
      </div>

      {loading && <div className="text-white animate-pulse">LOADING REQUESTS...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div key={req._id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-colors">
            
            {/* Header / Type */}
            <div className="flex justify-between items-start mb-4">
              <span className="bg-amber-600/20 text-amber-500 text-[10px] font-bold px-2 py-1 rounded uppercase">
                FAMILY UNIT
              </span>
              <span className="text-slate-500 text-xs">
                {new Date(req.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-white font-bold text-lg mb-1">
              DIRECT APPEAL: {req.title || "SHELTER"}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Requesting immediate {req.type}. Family Size: 1.
              <br />
              <span className="text-slate-300">Contact Name: {req.citizenId?.name || "Unknown"}</span>
            </p>

            {/* Message Box */}
            <div className="bg-slate-950 p-3 rounded border border-slate-800 text-slate-300 text-xs mb-4">
              {req.description || "No additional details provided."}
            </div>

            {/* Location */}
            <div className="text-pink-500 text-xs font-mono mb-6 flex items-center gap-2">
              📍 {req.address || req.region || "Location Pending"}
            </div>

            {/* THE BUTTON */}
            <button
              onClick={() => handleComplete(req._id)}
              className="w-full bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 font-bold py-3 rounded-lg text-xs transition-all flex justify-center items-center gap-2"
            >
              ✓ AID DISPATCHED
            </button>

          </div>
        ))}

        {requests.length === 0 && !loading && (
            <div className="col-span-3 text-center text-slate-500 py-10">
                No pending relief requests.
            </div>
        )}
      </div>
    </div>
  );
}