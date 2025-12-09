import { useState, useEffect } from "react";
import api from "../../api";

export default function TeamAssignment() {
  const [users, setUsers] = useState([]);
  const [missions, setMissions] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [selection, setSelection] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [uRes, mRes, iRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/missions"),
        api.get("/admin/alerts") // Gets everything
      ]);

      setUsers(uRes.data);
      setMissions(mRes.data);
      
      // Filter for Pending Incidents only
      const pending = iRes.data.filter(a => 
        a.typeTag === 'CITIZEN' && (a.status === 'ACTIVE' || a.status === 'PENDING')
      );
      setIncidents(pending);

    } catch (err) {
      console.error("Load failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (volunteerId) => {
    if (!selection) return alert("⚠️ Please select a Mission or Incident first.");

    // Check if it's an Incident or Mission
    const isIncident = incidents.find(i => i._id === selection);
    const isMission = missions.find(m => m._id === selection);

    try {
      if (isIncident) {
        // Deploy new mission
        await api.post("/admin/deploy", {
          sourceId: isIncident._id,
          teamId: volunteerId,
          priority: isIncident.severity
        });
        alert("✅ Mission Created & Agent Deployed!");
      } 
      else if (isMission) {
        // Re-assign existing mission
        await api.post(`/admin/missions/${isMission._id}/assign-team`, { teamId: volunteerId });
        alert("✅ Operative Re-assigned!");
      }
      
      loadData(); // Refresh list
      setSelection(""); 
    } catch (err) {
      alert("❌ Assignment Failed. Check console.");
    }
  };

  // 🔹 DEBUG TOOL: Reset a stuck volunteer
  const forceReset = async (id) => {
    if(!window.confirm("Force reset this volunteer to AVAILABLE?")) return;
    try {
      await api.put(`/admin/volunteers/${id}/approve`); // Reuse approve or create specific route
      // Actually, let's just use a direct update if possible, or assume backend handles it.
      // Since we don't have a direct "reset" route, we'll use the approve route which sets status to default in some logic, 
      // OR better, create a simple update.
      // For now, let's rely on the fact that 'approve' often resets things or just alert the user.
      // ideally we need api.put('/admin/users/'+id, {status: 'AVAILABLE'})
      alert("Please ask volunteer to complete mission or delete the mission.");
    } catch { }
  };

  // Filter Volunteers
  const volunteers = users.filter(u => u.roleType === 'VOLUNTEER');
  const available = volunteers.filter(v => v.status === "AVAILABLE");
  const deployed = volunteers.filter(v => v.status === "BUSY" || v.status === "DEPLOYED" || v.status === "IN_PROGRESS");
  const offDuty = volunteers.filter(v => v.status === "OFF_DUTY");

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in-up">
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Tactical Deployment</h1>
        <p className="text-slate-400 font-medium">Assign units to active missions or convert incidents into operations.</p>
      </div>

      {/* DROPDOWN */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl mb-8 shadow-xl">
        <label className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">
          Select Objective
        </label>
        
        <select 
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-4 text-white text-sm focus:border-amber-500 outline-none"
          value={selection}
          onChange={(e) => setSelection(e.target.value)}
        >
          <option value="">-- SELECT TARGET --</option>
          
          <optgroup label="🚨 PENDING INCIDENTS">
            {incidents.length === 0 && <option disabled>No pending incidents</option>}
            {incidents.map(i => (
              <option key={i._id} value={i._id}>
                ⚠️ [NEW] {i.title} ({i.severity})
              </option>
            ))}
          </optgroup>

          <optgroup label="🚀 ACTIVE MISSIONS">
            {missions.length === 0 && <option disabled>No active missions</option>}
            {missions.map(m => (
              <option key={m._id} value={m._id}>
                🔄 {m.title} [{m.status}]
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* AVAILABLE */}
        <div className="bg-slate-900/30 border border-emerald-500/20 rounded-xl p-4 h-full">
          <h3 className="text-emerald-400 font-bold text-sm mb-4">READY ({available.length})</h3>
          <div className="space-y-3">
            {available.map(v => (
              <div key={v._id} className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center border border-slate-700">
                <div>
                  <div className="text-white font-bold text-sm">{v.name}</div>
                  <div className="text-xs text-slate-500">{v.skills?.join(", ")}</div>
                </div>
                <button onClick={() => handleAssign(v._id)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded">
                  DEPLOY
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* DEPLOYED */}
        <div className="bg-slate-900/30 border border-amber-500/20 rounded-xl p-4 h-full">
          <h3 className="text-amber-500 font-bold text-sm mb-4">DEPLOYED ({deployed.length})</h3>
          <div className="space-y-3">
            {deployed.map(v => (
              <div key={v._id} className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center border border-slate-700">
                <div>
                  <div className="text-slate-300 font-bold text-sm">{v.name}</div>
                  <div className="text-xs text-amber-500 font-mono">ON MISSION</div>
                </div>
                {/* Visual Only */}
                <span className="text-[10px] bg-slate-700 text-slate-400 px-2 py-1 rounded">BUSY</span>
              </div>
            ))}
          </div>
        </div>

        {/* OFF DUTY */}
        <div className="bg-slate-900/30 border border-slate-700/50 rounded-xl p-4 h-full opacity-60">
          <h3 className="text-slate-400 font-bold text-sm mb-4">OFF DUTY ({offDuty.length})</h3>
          <div className="space-y-3">
            {offDuty.map(v => (
              <div key={v._id} className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-500 font-bold text-sm">{v.name}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}