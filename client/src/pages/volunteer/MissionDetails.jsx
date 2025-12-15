import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

export default function MissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // UPDATED: Using correct endpoint /volunteer/incidents/:id to fetch CitizenIncident details
    api.get(`/volunteer/incidents/${id}`)
      .then((res) => setIncident(res.data))
      .catch((err) => setError("Failed to load incident details."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAccept = async () => {
    if (incident?.status !== "ACTIVE") return;

    setProcessing(true);
    try {
      // Endpoint created in Step 53: PUT /api/volunteer/incidents/:id/accept
      await api.put(`/volunteer/incidents/${id}/accept`);
      setIncident((prev) => ({ ...prev, status: "IN_PROGRESS" }));
    } catch (err) {
      alert("Failed to accept incident. It may have been taken or resolved.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-10 text-slate-500 font-mono animate-pulse">Loading tactical data...</div>;
  if (error || !incident) return <div className="p-10 text-red-500 font-bold">{error || "Incident not found."}</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in-up">
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-t-2xl p-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${incident.severity === "CRITICAL" ? "bg-red-500/10 text-red-500 border-red-500/30" :
              incident.severity === "HIGH" ? "bg-orange-500/10 text-orange-500 border-orange-500/30" :
                "bg-slate-800 text-slate-400 border-slate-700"
              }`}>
              {incident.severity || "NORMAL"}
            </span>
            <span className="text-slate-500 text-xs font-mono uppercase tracking-wider">
              {incident.type || "INCIDENT"}
            </span>
          </div>
          <span className="text-slate-500 text-xs font-mono">
            {incident.createdAt ? new Date(incident.createdAt).toLocaleString() : ""}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
          {incident.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-slate-400 font-mono bg-slate-950/50 p-3 rounded-lg border border-slate-800 w-fit">
          {console.log("DEBUG DETAIL INCIDENT:", incident)}
          <span>📍</span>
          {incident.location?.address
            ? incident.location.address
            : (typeof incident.location === 'string' ? incident.location : 'Location unavailable')}
        </div>
      </div>

      {/* BODY */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-x border-b border-slate-800 rounded-b-2xl p-8">
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Briefing</h3>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {incident.description}
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950/30 rounded border border-slate-800">
            <span className="block text-xs text-slate-500 uppercase mb-1">Status</span>
            <span className={`font-bold ${incident.status === "ACTIVE" ? "text-emerald-400" :
              incident.status === "IN_PROGRESS" ? "text-blue-400" : "text-slate-400"
              }`}>
              {incident.status}
            </span>
          </div>
          <div className="p-4 bg-slate-950/30 rounded border border-slate-800">
            <span className="block text-xs text-slate-500 uppercase mb-1">Source</span>
            <span className="text-slate-300 font-mono uppercase">
              {incident.sourceType === "CITIZEN" ? "CITIZEN REPORT" : incident.sourceType || "SYSTEM"}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-4 border-t border-slate-800 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg text-slate-400 hover:text-white font-medium text-sm transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleAccept}
            disabled={incident.status !== "ACTIVE" || processing}
            className={`px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-lg ${incident.status === "ACTIVE"
              ? "bg-red-600 hover:bg-red-500 text-white shadow-red-900/20"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
          >
            {processing ? "Deploying..." :
              incident.status === "ACTIVE" ? "Accept Incident (Self-Deploy)" :
                incident.status === "IN_PROGRESS" ? "Deployment Active" : "Incident Closed"}
          </button>
        </div>
      </div>
    </div>
  );
}
