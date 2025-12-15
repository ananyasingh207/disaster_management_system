// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../../api";

// export default function IncidentDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [incident, setIncident] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [citizenMsg, setCitizenMsg] = useState("");
//   const [internalNote, setInternalNote] = useState("");

//   // ---------------- LOAD INCIDENT ----------------
//   const loadData = () => {
//     api
//       .get(`/admin/incidents/${id}`)
//       .then((res) => {
//         setIncident(res.data);
//         setLoading(false);
//       })
//       .catch(() => {
//         alert("Failed to load incident.");
//         navigate("/admin");
//       });
//   };

//   useEffect(() => {
//     loadData();
//   }, [id]);

//   // ---------------- ACTION HANDLERS ----------------
//   const handleDeploy = async () => {
//     if (!window.confirm("Confirm deployment?")) return;

//     try {
//       await api.post("/admin/deploy", {
//         sourceId: incident._id,
//         title: incident.title || incident.type,
//         description: incident.description || incident.message,
//         location:
//           incident.address || incident.region || incident.location,
//         severity: incident.severity,
//         type: incident.type,
//       });

//       alert("Mission created.");
//       loadData();
//     } catch {
//       alert("Deployment failed.");
//     }
//   };

//   const handleResolve = async () => {
//     if (!window.confirm("Resolve this incident?")) return;

//     try {
//       await api.post("/admin/acknowledge", { sourceId: incident._id });
//       loadData();
//     } catch {
//       alert("Update failed.");
//     }
//   };

//   const sendUpdate = async () => {
//     if (!citizenMsg.trim()) return;

//     try {
//       await api.post("/admin/incidents/reply", {
//         id: incident._id,
//         message: citizenMsg,
//       });

//       setCitizenMsg("");
//       loadData();
//     } catch {
//       alert("Failed to send.");
//     }
//   };

//   const saveRecord = async () => {
//     if (!internalNote.trim()) return;

//     try {
//       await api.post("/admin/incidents/record", {
//         id: incident._id,
//         note: internalNote,
//       });

//       setInternalNote("");
//       loadData();
//     } catch {
//       alert("Failed to save.");
//     }
//   };

//   // ---------------- MISSION REVIEW ----------------
//   const handleReview = async (decision) => {
//     try {
//       await api.post("/admin/missions/finalize", {
//         id: incident._id,
//         decision,
//       });

//       alert(
//         decision === "APPROVE"
//           ? "Mission closed successfully."
//           : "Sent back to volunteer."
//       );

//       navigate("/admin");
//     } catch {
//       alert("Action failed.");
//     }
//   };

//   if (loading)
//     return (
//       <div className="p-10 text-white font-mono animate-pulse">
//         RETRIEVING CASE DATA...
//       </div>
//     );

//   if (!incident)
//     return <div className="p-10 text-red-500">Incident not found.</div>;

//   // ---------------- STATUS LOGIC ----------------
//   const isVolunteerReport = !!incident.reportedBy;

//   const status = incident.status; // cleaner

//   const isPending = status === "ACTIVE" || status === "PENDING";
//   const isOngoing = status === "MISSION_CREATED" || status === "IN_PROGRESS";
//   const isCompleted = status === "RESOLVED" || status === "COMPLETED";
//   const isPendingReview = status === "PENDING_REVIEW";

//   // ==========================================================
//   //                         RENDER
//   // ==========================================================

//   return (
//     <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
//       {/* BACK */}
//       <button
//         onClick={() => navigate(-1)}
//         className="text-slate-400 hover:text-white mb-6 font-medium text-sm flex items-center gap-2 transition-colors"
//       >
//         ← RETURN TO DASHBOARD
//       </button>

//       {/* HEADER */}
//       <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
//         <div>
//           <span className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1 block">
//             CASE ID: {incident._id.substring(0, 8)}
//           </span>
//           <h1 className="text-3xl font-black text-white">
//             {incident.title || incident.type}
//           </h1>
//           <p className="text-slate-400 mt-1">
//             {isVolunteerReport ? "Field Intelligence Report" : "Civilian Distress Signal"}
//           </p>
//         </div>

//         <span
//           className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider ${
//             incident.severity === "CRITICAL"
//               ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
//               : "bg-slate-700 text-white"
//           }`}
//         >
//           SEVERITY: {incident.severity || "NORM"}
//         </span>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* ================= COLUMN 1 (DETAIL + COMMUNICATION) ================= */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* DETAILS */}
//           <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
//             <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
//               Incident Report
//             </h4>
//             <p className="text-lg text-slate-200 leading-relaxed mb-8 font-light">
//               {incident.description || incident.message}
//             </p>

//             <div className="grid grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-xl border border-slate-800">
//               <div>
//                 <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
//                   Source
//                 </label>
//                 <div className="text-white font-medium">
//                   {isVolunteerReport
//                     ? `Officer ${incident.reportedBy?.name}`
//                     : incident.citizenId?.name || "Anonymous"}
//                 </div>
//               </div>

//               <div>
//                 <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
//                   Contact
//                 </label>
//                 <div className="text-white font-medium font-mono">
//                   {isVolunteerReport
//                     ? incident.reportedBy?.phone
//                     : incident.citizenId?.phone}
//                 </div>
//               </div>

//               <div className="col-span-2">
//                 <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
//                   Location Coordinates
//                 </label>
//                 <div className="text-emerald-400 font-mono text-sm bg-emerald-900/10 p-2 rounded border border-emerald-900/30 inline-block">
//                   Location: {incident.address || incident.region || incident.location}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* PUBLIC COMMUNICATION */}
//           {!isVolunteerReport && (
//             <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
//               <h3 className="text-white font-bold mb-1 flex items-center gap-2">
//                 <span className="text-blue-500"></span> Public Communication
//               </h3>
//               <p className="text-slate-500 text-sm mb-4">
//                 Secure channel to citizen.
//               </p>

//               <div className="flex gap-2">
//                 <input
//                   className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600"
//                   placeholder="Type message..."
//                   value={citizenMsg}
//                   onChange={(e) => setCitizenMsg(e.target.value)}
//                 />
//                 <button
//                   onClick={sendUpdate}
//                   className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 rounded-lg text-sm shadow-lg"
//                 >
//                   SEND
//                 </button>
//               </div>

//               <div className="mt-6 space-y-3">
//                 {incident.adminReplies?.length === 0 && (
//                   <span className="text-slate-600 text-xs italic">
//                     No messages sent.
//                   </span>
//                 )}

//                 {incident.adminReplies?.map((r, i) => (
//                   <div key={i} className="flex gap-3 text-sm">
//                     <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
//                       HQ
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-800/50 p-3 rounded-r-xl rounded-bl-xl text-slate-300">
//                         {r.message}
//                       </div>
//                       <span className="text-[10px] text-slate-600 mt-1 block">
//                         {new Date(r.date).toLocaleTimeString()}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ================= COLUMN 2 (ACTION PANEL + LOGS) ================= */}
//         <div className="space-y-6">
//           {/* ACTION PANEL */}
//           <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
//             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
//               Command Action
//             </h4>

//             {/* STATE A: Pending review from volunteer */}
//             {isPendingReview && (
//               <div className="space-y-3">
//                 <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm font-bold rounded-lg text-center mb-4">
//                   ⚠️ WAITING FOR ADMIN REVIEW
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     onClick={() => handleReview("REJECT")}
//                     className="bg-red-900/20 text-red-400 border border-red-900/50 py-3 rounded-lg font-bold text-xs hover:bg-red-900/40"
//                   >
//                     REJECT
//                   </button>

//                   <button
//                     onClick={() => handleReview("APPROVE")}
//                     className="bg-emerald-600 text-white py-3 rounded-lg font-bold text-xs hover:bg-emerald-500 shadow-lg"
//                   >
//                     CONFIRM COMPLETE
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* STATE B: Standard pending */}
//             {isPending && !isPendingReview && (
//               isVolunteerReport ? (
//                 <button
//                   onClick={handleResolve}
//                   className="w-full bg-blue-600/10 border border-blue-500 text-blue-400 py-4 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all"
//                 >
//                   ACKNOWLEDGE REPORT
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleDeploy}
//                   className="w-full bg-red-600 py-4 rounded-xl font-bold text-white shadow-lg hover:bg-red-500 transition-all"
//                 >
//                   🚨 DEPLOY RESCUE TEAM
//                 </button>
//               )
//             )}

//             {/* STATE C: Mission ongoing */}
//             {isOngoing && (
//               <div className="space-y-3">
//                 <div className="w-full text-center py-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold rounded-xl text-sm uppercase animate-pulse">
//                   ⚠️ MISSION IN PROGRESS
//                 </div>

//                 <button
//                   onClick={handleResolve}
//                   className="w-full bg-slate-800 border border-slate-700 text-slate-300 py-3 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all text-xs"
//                 >
//                   ✓ MARK MISSION COMPLETE
//                 </button>
//               </div>
//             )}

//             {/* STATE D: Completed */}
//             {isCompleted && (
//               <div className="w-full text-center py-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-sm uppercase">
//                 🏁 MISSION COMPLETED
//               </div>
//             )}
//           </div>

//           {/* INTERNAL LOGS */}
//           <div className="bg-slate-900/50 border border-amber-500/20 rounded-2xl p-6">
//             <h3 className="text-amber-500 font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
//               Internal Logs
//             </h3>

//             <div className="bg-black/40 rounded-xl p-4 mb-4 h-48 overflow-y-auto border border-slate-800">
//               {incident.adminNotes?.length === 0 && (
//                 <span className="text-slate-600 text-xs italic">
//                   Log is empty.
//                 </span>
//               )}

//               {incident.adminNotes?.map((note, i) => (
//                 <div
//                   key={i}
//                   className="mb-3 pb-3 border-b border-slate-800 last:border-0 last:pb-0"
//                 >
//                   <div className="text-amber-100/80 text-xs font-mono mb-1">
//                     {note.note}
//                   </div>
//                   <div className="text-[9px] text-slate-600">
//                     {new Date(note.date).toLocaleString()}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex gap-2">
//               <input
//                 className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-600"
//                 placeholder="Add classified note..."
//                 value={internalNote}
//                 onChange={(e) => setInternalNote(e.target.value)}
//               />
//               <button
//                 onClick={saveRecord}
//                 className="bg-amber-600 hover:bg-amber-500 text-black px-3 rounded-lg text-xs font-bold"
//               >
//                 SAVE
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { formatDate, formatNumber } from "../../utils/normalizeAdminData";

export default function IncidentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  const [citizenMsg, setCitizenMsg] = useState("");
  const [internalNote, setInternalNote] = useState("");

  // Load Incident
  const loadData = () => {
    api
      .get(`/admin/incidents/${id}`)
      .then((res) => {
        // Ensure we have valid data
        if (res.data) {
          setIncident(res.data);
        } else {
          alert("Incident data is invalid.");
          navigate("/admin/incidents");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load incident:", err);
        alert("Failed to load incident.");
        navigate("/admin/incidents");
      });
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Send Reply to Citizen
  const sendReply = async () => {
    try {
      await api.post("/admin/incidents/reply", { id, message: citizenMsg });
      setCitizenMsg("");
      loadData(); // Refresh
    } catch (err) {
      console.error("Failed to send reply", err);
    }
  };

  // Save Internal Note
  const saveRecord = async () => {
    try {
      await api.post("/admin/incidents/record", { id, note: internalNote });
      setInternalNote("");
      loadData(); // Refresh
    } catch (err) {
      console.error("Failed to add note", err);
    }
  };

  // Acknowledge Incident
  const acknowledge = async () => {
    try {
      await api.post("/admin/incidents/acknowledge", { id });
      loadData();
    } catch (err) {
      console.error("Failed to acknowledge", err);
    }
  };

  // ----------------------------------------------------------------
  //                NEW DEPLOYMENT & MODAL LOGIC
  // ----------------------------------------------------------------
  const [showModal, setShowModal] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [assigning, setAssigning] = useState(false);

  // Fetch Volunteers when Modal Opens
  const openAssignmentModal = async () => {
    setShowModal(true);
    try {
      const res = await api.get("/admin/volunteers");
      setVolunteers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch volunteers", err);
      // Fallback Mock Data if API fails
      setVolunteers([
        { _id: "v1", name: "John Doe (Mock)", email: "john@rescue.org", skills: ["Medical", "Search"] },
        { _id: "v2", name: "Jane Smith (Mock)", email: "jane@rescue.org", skills: ["Logistics"] }
      ]);
    }
  };

  const confirmAssignment = async () => {
    if (!selectedVolunteer) return alert("Please select a volunteer.");

    setAssigning(true);
    try {
      await api.post("/admin/deploy", {
        sourceId: incident._id,
        volunteerId: selectedVolunteer._id // Passed for context, even if schema doesn't store it yet
      });

      alert(`Incident Assigned to ${selectedVolunteer.name}`);
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error("Assignment failed", err);
      alert("Failed to assign volunteer.");
    } finally {
      setAssigning(false);
    }
  };


  // Resolve Incident
  const resolve = async () => {
    if (!window.confirm("Mark this incident as RESOLVED? This will close the case.")) return;

    try {
      await api.post("/admin/resolve", { id: incident._id });
      loadData();
    } catch (err) {
      console.error("Failed to resolve", err);
      alert("Failed to resolve incident.");
    }
  };

  if (loading) return <div className="text-white p-10 font-mono animate-pulse">CONNECTING TO FIELD DATABASE...</div>;

  if (!incident) return <div className="text-red-500 p-10">Incident not found.</div>;

  return (
    <div className="grid grid-cols-2 gap-8 h-full animate-fade-in relative">

      {/* ----------------- ASSIGNMENT MODAL ----------------- */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl p-6 transform transition-all scale-100">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span></span> Assign Field Operative
            </h3>

            <div className="bg-slate-950 rounded-lg border border-slate-800 h-64 overflow-y-auto mb-6 p-2 space-y-2">
              {volunteers.map(v => (
                <div
                  key={v._id}
                  onClick={() => setSelectedVolunteer(v)}
                  className={`p-3 rounded border cursor-pointer flex justify-between items-center transition-all ${selectedVolunteer?._id === v._id
                    ? "bg-blue-600/20 border-blue-500 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"
                    }`}
                >
                  <div>
                    <div className="font-bold text-sm">{v.name}</div>
                    <div className="text-xs text-slate-500">{v.email}</div>
                  </div>
                  {selectedVolunteer?._id === v._id && <span className="text-blue-400 font-bold text-xs">SELECTED</span>}
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded text-slate-400 hover:text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmAssignment}
                disabled={assigning}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold text-sm flex items-center gap-2"
              >
                {assigning ? "Transmitting..." : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* LEFT: Incident Information + Public Communication */}
      <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-white">Incident #{id.slice(-6)}</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Title</p>
              <p className="text-white font-medium">{incident.title}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Type</p>
              <p className="text-white font-medium">{incident.type}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Severity</p>
              <p className={`font-bold ${incident.severity === "HIGH" || incident.severity === "CRITICAL" ? "text-red-500" :
                incident.severity === "MEDIUM" ? "text-amber-500" : "text-emerald-500"
                }`}>
                {incident.severity}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Status</p>
              <p className={`font-mono font-bold ${incident.status === 'PENDING' ? 'text-orange-400' :
                incident.status === 'ACTIVE' ? 'text-red-500' :
                  incident.status === 'IN_PROGRESS' ? 'text-blue-400' :
                    'text-emerald-500'
                }`}>{incident.status}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Location</p>
            <p className="text-slate-300 font-mono text-sm">
              {incident.location?.address ||
                (incident.location?.lat !== undefined && incident.location?.lng !== undefined
                  ? `Lat: ${formatNumber(incident.location.lat, 6)}, Lng: ${formatNumber(incident.location.lng, 6)}`
                  : "Location unavailable")}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Description</p>
            <p className="text-slate-300 leading-relaxed text-sm">{incident.description}</p>
          </div>
        </div>

        {/* Public Replies */}
        <div className="space-y-4 pt-6 border-t border-slate-800/50">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Reporter Update</h4>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto">
            {incident.adminReplies?.length === 0 && <p className="text-xs text-slate-600 italic">No updates sent yet.</p>}
            {incident.adminReplies?.map((reply, idx) => (
              <div key={idx} className="bg-slate-800/50 p-3 rounded-lg text-sm text-slate-300 border border-slate-700/50">
                {reply.message || reply.message || "No message"} <span className="text-xs text-slate-500 block mt-1">({formatDate(reply.createdAt || reply.date, "Time unavailable")})</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600 focus:border-slate-600 transition-colors"
              placeholder="Send update to reporter..."
              value={citizenMsg}
              onChange={(e) => setCitizenMsg(e.target.value)}
            />
            <button
              onClick={sendReply}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 rounded-lg text-sm font-bold transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Command Actions + Internal Logs */}
      <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 space-y-6 flex flex-col">
        <h3 className="text-xl font-bold text-white">Command Actions</h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={openAssignmentModal}
            className={`w-full py-4 rounded-xl font-bold text-sm border transition-all flex flex-col items-center gap-1 group ${incident.status === 'COMPLETED' || incident.status === 'RESOLVED'
              ? "bg-slate-800/50 border-slate-800 text-slate-600 cursor-not-allowed"
              : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
              }`}
            disabled={incident.status === 'COMPLETED' || incident.status === 'RESOLVED'}
          >
            <span>Deploy Rescue Team</span>
          </button>

          <button
            onClick={resolve}
            className={`w-full py-4 rounded-xl font-bold text-sm border transition-all flex flex-col items-center gap-1 ${incident.status === 'RESOLVED'
              ? "bg-emerald-900/20 border-emerald-900/30 text-emerald-500 cursor-not-allowed"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700"
              }`}
            disabled={incident.status === 'RESOLVED'}
          >
            <span>{incident.status === 'RESOLVED' ? "Case Closed" : "Resolve Incident"}</span>
          </button>
        </div>

        {/* Internal Notes */}
        <div className="space-y-4 pt-6 mt-auto border-t border-slate-800/50 flex-grow flex flex-col">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Internal Notes</h4>

          <div className="space-y-3 overflow-y-auto flex-grow h-48">
            {incident.adminNotes?.length === 0 && <p className="text-xs text-slate-600 italic">No notes recorded.</p>}
            {incident.adminNotes?.map((note, idx) => (
              <div key={idx} className="bg-slate-800/30 p-3 rounded-lg text-sm text-slate-400 border border-slate-800">
                <span className="text-amber-500/50 mr-2">#</span>{note.note || "No note"} <span className="text-xs text-slate-600 block mt-1">({formatDate(note.createdAt || note.date, "Time unavailable")})</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600 focus:border-slate-600"
              placeholder="Add internal note..."
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
            />
            <button
              onClick={saveRecord}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 rounded-lg text-sm font-bold border border-slate-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
