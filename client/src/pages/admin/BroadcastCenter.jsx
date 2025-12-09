import { useEffect, useState } from "react";
import api from "../../api";
import LocationMap from "../../components/LocationMap";

export default function BroadcastCenter() {
  const [alerts, setAlerts] = useState([]);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const [form, setForm] = useState({
    title: "", 
    message: "", 
    type: "WEATHER", 
    region: "", 
    severity: "LOW",
    target: "CITIZEN" 
  });

  const loadHistory = async () => {
    try {
      const res = await api.get("/admin/alerts");
      // Filter to show ONLY items tagged as 'BROADCAST' (if your backend supports this tag logic)
      // Otherwise it shows all. 
      // Assuming the previous logic of filtering or showing all:
      setAlerts(res.data); 
    } catch (err) {
      console.error("Failed to load history");
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLocationSelect = (coords) => {
    setForm((prev) => ({ ...prev, region: coords }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    try {
      const payload = { ...form };

      if (form.target === "CITIZEN" || form.target === "ALL") {
        await api.post("/admin/alerts/citizen", payload);
      }
      
      if (form.target === "VOLUNTEER" || form.target === "ALL") {
        await api.post("/admin/alerts/volunteer", payload);
      }
      
      setStatus({ type: "success", msg: `Signal successfully broadcasted to: ${form.target}` });
      setForm({ ...form, title: "", message: "", region: "" }); 
      loadHistory(); 
    } catch (err) {
      setStatus({ type: "error", msg: "Transmission Failed. Check System Logs." });
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in-up">
      
      {/* HEADER */}
      <div className="mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Broadcast Center</h1>
        <p className="text-slate-400 font-medium">Issue public safety warnings & emergency protocols.</p>
      </div>

      {/* STATUS MESSAGE */}
      {status.msg && (
        <div className={`p-4 mb-8 rounded-xl border flex items-center gap-3 shadow-lg ${
          status.type === "error" 
            ? "bg-red-500/10 border-red-500/50 text-red-400" 
            : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
        }`}>
          <span className="text-xl">{status.type === "error" ? "⚠️" : "📡"}</span>
          <span className="font-bold text-sm uppercase tracking-wide">{status.msg}</span>
        </div>
      )}

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* LEFT COLUMN: CONTROLS */}
            <div className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alert Headline</label>
                <input 
                  name="title" 
                  value={form.title} 
                  onChange={change} 
                  required 
                  placeholder="Ex: Tsunami Warning Sector 7" 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600 font-bold" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Target Audience</label>
                <select 
                  name="target" 
                  value={form.target} 
                  onChange={change} 
                  className="w-full bg-slate-950 border border-blue-500/30 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all cursor-pointer hover:bg-slate-900"
                >
                  <option value="CITIZEN">Citizens Only (Public Channel)</option>
                  <option value="VOLUNTEER">Volunteers Only (Encrypted)</option>
                  <option value="ALL">Global Broadcast (All Channels)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
                  <select 
                    name="type" 
                    value={form.type} 
                    onChange={change}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="WEATHER">Weather Event</option>
                    <option value="REGION_WARNING">Regional Hazard</option>
                    <option value="EVACUATION">Evacuation Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Severity</label>
                  <select 
                    name="severity" 
                    value={form.severity} 
                    onChange={change}
                    className={`w-full bg-slate-950 border rounded-lg px-4 py-3 text-sm font-bold outline-none transition-all cursor-pointer ${
                      form.severity === 'CRITICAL' ? 'border-red-500 text-red-500' : 
                      form.severity === 'HIGH' ? 'border-orange-500 text-orange-500' : 'border-slate-700 text-white'
                    }`}
                  >
                    <option value="LOW">Low Level</option>
                    <option value="MEDIUM">Medium Level</option>
                    <option value="HIGH">High Level</option>
                    <option value="CRITICAL">CRITICAL (OMEGA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Region</label>
                <input 
                  name="region" 
                  value={form.region} 
                  onChange={change} 
                  placeholder="Select on map..." 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all font-mono" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Transmission Message</label>
                <textarea 
                  name="message" 
                  rows="4" 
                  value={form.message} 
                  onChange={change} 
                  required 
                  placeholder="Enter detailed protocol instructions..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all resize-none" 
                />
              </div>
            </div>

            {/* RIGHT COLUMN: MAP */}
            <div className="flex flex-col h-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Designator</label>
              
              <div className="flex-1 rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative min-h-[300px]">
                <LocationMap onSelect={handleLocationSelect} severity={form.severity} />
              </div>
              
              <button 
                type="submit" 
                className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black py-4 rounded-xl shadow-lg shadow-red-900/30 transition-all transform hover:scale-[1.02] tracking-widest text-sm"
              >
                INITIATE BROADCAST SEQUENCE
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* --- HISTORY SECTION --- */}
      <div className="mt-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
          <span className="text-slate-500">📜</span> Transmission History
        </h2>
        
        {alerts.length === 0 && <div className="text-center py-10 text-slate-600 italic border border-dashed border-slate-800 rounded-xl">No outgoing broadcasts recorded in the system log.</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((a) => (
            <div key={a._id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:bg-slate-800/50 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 uppercase tracking-wider">
                  {a.audience || "BROADCAST"}
                </span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                  a.severity === 'CRITICAL' ? 'bg-red-500 text-white' : 
                  a.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-700 text-slate-300'
                }`}>
                  {a.severity}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{a.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2 mb-4">{a.message}</p>
              
              <div className="flex justify-between items-center text-[10px] text-slate-600 font-mono pt-3 border-t border-slate-800">
                <span className="uppercase">{a.type}</span>
                <span>{new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}