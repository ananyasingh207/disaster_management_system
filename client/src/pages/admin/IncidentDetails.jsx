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
      // Show Backend Error Message
      alert(err.response?.data?.message || "Failed to assign volunteer.");
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
              {volunteers.map(v => {
                const isAvailable = v.status === "AVAILABLE";
                const isByMe = selectedVolunteer?._id === v._id;

                return (
                  <div
                    key={v._id}
                    onClick={() => {
                      if (isAvailable) setSelectedVolunteer(v);
                    }}
                    className={`p-3 rounded border flex justify-between items-center transition-all ${isByMe
                      ? "bg-blue-600/20 border-blue-500 text-white"
                      : isAvailable
                        ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600 cursor-pointer"
                        : "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed opacity-60"
                      }`}
                  >
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        {v.name}
                        {!isAvailable && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-900/40 text-red-500 rounded border border-red-900/50">
                            {v.status || "BUSY"}
                          </span>
                        )}
                        {isAvailable && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-900/40 text-emerald-500 rounded border border-emerald-900/50">
                            READY
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{v.email}</div>
                    </div>
                    {isByMe && <span className="text-blue-400 font-bold text-xs">SELECTED</span>}
                  </div>
                );
              })}
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
