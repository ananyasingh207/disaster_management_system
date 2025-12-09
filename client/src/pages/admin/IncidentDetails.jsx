import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

export default function IncidentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  const [citizenMsg, setCitizenMsg] = useState("");
  const [internalNote, setInternalNote] = useState("");

  // ---------------- LOAD INCIDENT ----------------
  const loadData = () => {
    api
      .get(`/admin/incidents/${id}`)
      .then((res) => {
        setIncident(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load incident.");
        navigate("/admin");
      });
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // ---------------- ACTION HANDLERS ----------------
  const handleDeploy = async () => {
    if (!window.confirm("Confirm deployment?")) return;

    try {
      await api.post("/admin/deploy", {
        sourceId: incident._id,
        title: incident.title || incident.type,
        description: incident.description || incident.message,
        location:
          incident.address || incident.region || incident.location,
        severity: incident.severity,
        type: incident.type,
      });

      alert("Mission created.");
      loadData();
    } catch {
      alert("Deployment failed.");
    }
  };

  const handleResolve = async () => {
    if (!window.confirm("Resolve this incident?")) return;

    try {
      await api.post("/admin/acknowledge", { sourceId: incident._id });
      loadData();
    } catch {
      alert("Update failed.");
    }
  };

  const sendUpdate = async () => {
    if (!citizenMsg.trim()) return;

    try {
      await api.post("/admin/incidents/reply", {
        id: incident._id,
        message: citizenMsg,
      });

      setCitizenMsg("");
      loadData();
    } catch {
      alert("Failed to send.");
    }
  };

  const saveRecord = async () => {
    if (!internalNote.trim()) return;

    try {
      await api.post("/admin/incidents/record", {
        id: incident._id,
        note: internalNote,
      });

      setInternalNote("");
      loadData();
    } catch {
      alert("Failed to save.");
    }
  };

  // ---------------- MISSION REVIEW ----------------
  const handleReview = async (decision) => {
    try {
      await api.post("/admin/missions/finalize", {
        id: incident._id,
        decision,
      });

      alert(
        decision === "APPROVE"
          ? "Mission closed successfully."
          : "Sent back to volunteer."
      );

      navigate("/admin");
    } catch {
      alert("Action failed.");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-white font-mono animate-pulse">
        RETRIEVING CASE DATA...
      </div>
    );

  if (!incident)
    return <div className="p-10 text-red-500">Incident not found.</div>;

  // ---------------- STATUS LOGIC ----------------
  const isVolunteerReport = !!incident.reportedBy;

  const status = incident.status; // cleaner

  const isPending = status === "ACTIVE" || status === "PENDING";
  const isOngoing = status === "MISSION_CREATED" || status === "IN_PROGRESS";
  const isCompleted = status === "RESOLVED" || status === "COMPLETED";
  const isPendingReview = status === "PENDING_REVIEW";

  // ==========================================================
  //                         RENDER
  // ==========================================================

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="text-slate-400 hover:text-white mb-6 font-medium text-sm flex items-center gap-2 transition-colors"
      >
        ← RETURN TO DASHBOARD
      </button>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1 block">
            CASE ID: {incident._id.substring(0, 8)}
          </span>
          <h1 className="text-3xl font-black text-white">
            {incident.title || incident.type}
          </h1>
          <p className="text-slate-400 mt-1">
            {isVolunteerReport ? "Field Intelligence Report" : "Civilian Distress Signal"}
          </p>
        </div>

        <span
          className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider ${
            incident.severity === "CRITICAL"
              ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
              : "bg-slate-700 text-white"
          }`}
        >
          SEVERITY: {incident.severity || "NORM"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= COLUMN 1 (DETAIL + COMMUNICATION) ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* DETAILS */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
              Incident Report
            </h4>
            <p className="text-lg text-slate-200 leading-relaxed mb-8 font-light">
              {incident.description || incident.message}
            </p>

            <div className="grid grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-xl border border-slate-800">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Source
                </label>
                <div className="text-white font-medium">
                  {isVolunteerReport
                    ? `Officer ${incident.reportedBy?.name}`
                    : incident.citizenId?.name || "Anonymous"}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Contact
                </label>
                <div className="text-white font-medium font-mono">
                  {isVolunteerReport
                    ? incident.reportedBy?.phone
                    : incident.citizenId?.phone}
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Location Coordinates
                </label>
                <div className="text-emerald-400 font-mono text-sm bg-emerald-900/10 p-2 rounded border border-emerald-900/30 inline-block">
                  📍 {incident.address || incident.region || incident.location}
                </div>
              </div>
            </div>
          </div>

          {/* PUBLIC COMMUNICATION */}
          {!isVolunteerReport && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                <span className="text-blue-500">📢</span> Public Communication
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Secure channel to citizen.
              </p>

              <div className="flex gap-2">
                <input
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600"
                  placeholder="Type message..."
                  value={citizenMsg}
                  onChange={(e) => setCitizenMsg(e.target.value)}
                />
                <button
                  onClick={sendUpdate}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 rounded-lg text-sm shadow-lg"
                >
                  SEND
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {incident.adminReplies?.length === 0 && (
                  <span className="text-slate-600 text-xs italic">
                    No messages sent.
                  </span>
                )}

                {incident.adminReplies?.map((r, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      HQ
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-800/50 p-3 rounded-r-xl rounded-bl-xl text-slate-300">
                        {r.message}
                      </div>
                      <span className="text-[10px] text-slate-600 mt-1 block">
                        {new Date(r.date).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= COLUMN 2 (ACTION PANEL + LOGS) ================= */}
        <div className="space-y-6">
          {/* ACTION PANEL */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Command Action
            </h4>

            {/* STATE A: Pending review from volunteer */}
            {isPendingReview && (
              <div className="space-y-3">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm font-bold rounded-lg text-center mb-4">
                  ⚠️ WAITING FOR ADMIN REVIEW
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleReview("REJECT")}
                    className="bg-red-900/20 text-red-400 border border-red-900/50 py-3 rounded-lg font-bold text-xs hover:bg-red-900/40"
                  >
                    REJECT
                  </button>

                  <button
                    onClick={() => handleReview("APPROVE")}
                    className="bg-emerald-600 text-white py-3 rounded-lg font-bold text-xs hover:bg-emerald-500 shadow-lg"
                  >
                    CONFIRM COMPLETE
                  </button>
                </div>
              </div>
            )}

            {/* STATE B: Standard pending */}
            {isPending && !isPendingReview && (
              isVolunteerReport ? (
                <button
                  onClick={handleResolve}
                  className="w-full bg-blue-600/10 border border-blue-500 text-blue-400 py-4 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all"
                >
                  ACKNOWLEDGE REPORT
                </button>
              ) : (
                <button
                  onClick={handleDeploy}
                  className="w-full bg-red-600 py-4 rounded-xl font-bold text-white shadow-lg hover:bg-red-500 transition-all"
                >
                  🚨 DEPLOY RESCUE TEAM
                </button>
              )
            )}

            {/* STATE C: Mission ongoing */}
            {isOngoing && (
              <div className="space-y-3">
                <div className="w-full text-center py-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold rounded-xl text-sm uppercase animate-pulse">
                  ⚠️ MISSION IN PROGRESS
                </div>

                <button
                  onClick={handleResolve}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 py-3 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all text-xs"
                >
                  ✓ MARK MISSION COMPLETE
                </button>
              </div>
            )}

            {/* STATE D: Completed */}
            {isCompleted && (
              <div className="w-full text-center py-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-sm uppercase">
                🏁 MISSION COMPLETED
              </div>
            )}
          </div>

          {/* INTERNAL LOGS */}
          <div className="bg-slate-900/50 border border-amber-500/20 rounded-2xl p-6">
            <h3 className="text-amber-500 font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
              📂 Internal Logs
            </h3>

            <div className="bg-black/40 rounded-xl p-4 mb-4 h-48 overflow-y-auto border border-slate-800">
              {incident.adminNotes?.length === 0 && (
                <span className="text-slate-600 text-xs italic">
                  Log is empty.
                </span>
              )}

              {incident.adminNotes?.map((note, i) => (
                <div
                  key={i}
                  className="mb-3 pb-3 border-b border-slate-800 last:border-0 last:pb-0"
                >
                  <div className="text-amber-100/80 text-xs font-mono mb-1">
                    {note.note}
                  </div>
                  <div className="text-[9px] text-slate-600">
                    {new Date(note.date).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-600"
                placeholder="Add classified note..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
              />
              <button
                onClick={saveRecord}
                className="bg-amber-600 hover:bg-amber-500 text-black px-3 rounded-lg text-xs font-bold"
              >
                SAVE
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
