import { useState, useEffect } from "react";
import api from "../../api";
import LocationMap from "../../components/LocationMap"; // 👈 Import Map

export default function CitizenRelief() {
  const [activeTab, setActiveTab] = useState("shelters"); 
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [appeal, setAppeal] = useState({
    name: "",
    familySize: 1,
    needs: "SHELTER",
    location: "",
    urgency: "HIGH"
  });

  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/citizen/alerts")
       .then(res => {
         setAlerts(res.data);
         setLoading(false);
       })
       .catch(err => setLoading(false));
  }, []);

  // 🔹 Handle Map Click
  const handleLocationSelect = (coords) => {
    setAppeal((prev) => ({ ...prev, location: coords }));
  };

  const submitAppeal = async (e) => {
    e.preventDefault();
    try {
      await api.post("/citizen/incidents", {
        title: `DIRECT APPEAL: ${appeal.needs} (${appeal.familySize} People)`,
        type: "HUMANITARIAN", 
        severity: appeal.urgency === "HIGH" ? "CRITICAL" : "HIGH",
        description: `Requesting immediate ${appeal.needs}. Family Size: ${appeal.familySize}. Contact Name: ${appeal.name}`,
        address: appeal.location // Uses map coordinates or manual input
      });
      setMsg("Appeal Sent to UNHCR/Gov Coordination Unit.");
      setAppeal({ name: "", familySize: 1, needs: "SHELTER", location: "", urgency: "HIGH" });
    } catch {
      setMsg("Failed to send appeal. Please call 108.");
    }
  };

  const shelters = [
    { id: 1, name: "City Stadium Safe Zone", capacity: "High", status: "OPEN", loc: "Sector 4" },
    { id: 2, name: "Community Hall B", capacity: "Full", status: "FULL", loc: "North District" },
    { id: 3, name: "UNHCR Tent Camp Alpha", capacity: "Medium", status: "OPEN", loc: "Outskirts Hwy 9" },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
      
      {/* HEADER */}
      <div className="mb-10 border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Relief & Shelter Ops</h1>
          <p className="text-slate-400 font-medium">Direct humanitarian aid and safe zone locator.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <span className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-500/30 rounded text-xs font-bold">
            PARTNER: UNHCR
          </span>
          <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold">
            GOVT APPROVED
          </span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-8 border-b border-slate-800">
        <button onClick={() => setActiveTab('shelters')} className={`pb-3 px-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'shelters' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-white'}`}>
          ⛺ FIND SHELTER
        </button>
        <button onClick={() => setActiveTab('appeals')} className={`pb-3 px-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'appeals' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-500 hover:text-white'}`}>
          ✋ DIRECT APPEAL
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      
      {/* 1. SHELTER LOCATOR */}
      {activeTab === 'shelters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelters.map(s => (
            <div key={s.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg hover:border-slate-700 transition-colors">
              <div className="flex justify-between mb-4">
                <span className="text-3xl">⛺</span>
                <span className={`text-xs font-bold px-2 py-1 rounded h-fit ${s.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {s.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{s.name}</h3>
              <p className="text-slate-400 text-sm mb-4">Location: {s.loc}</p>
              <div className="flex justify-between items-center text-xs text-slate-500 font-mono border-t border-slate-800 pt-4">
                <span>Capacity: {s.capacity}</span>
                <button className="text-blue-400 hover:text-blue-300 font-bold transition-colors">GET DIRECTIONS →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. DIRECT APPEAL FORM (With Map) */}
      {activeTab === 'appeals' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Request Humanitarian Aid</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              For refugees, homeless, and crisis victims. We coordinate with Government Agencies to provide tents, food, and medicine.
            </p>
          </div>

          {msg && <div className="p-4 mb-6 bg-blue-500/10 border border-blue-500/50 text-blue-400 rounded-lg text-center font-bold">{msg}</div>}

          <form onSubmit={submitAppeal} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Details */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contact Name</label>
                  <input required className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all" 
                    value={appeal.name} onChange={e => setAppeal({...appeal, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Family Size</label>
                  <input type="number" required className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all" 
                    value={appeal.familySize} onChange={e => setAppeal({...appeal, familySize: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Primary Need</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all cursor-pointer"
                  value={appeal.needs} onChange={e => setAppeal({...appeal, needs: e.target.value})}>
                  <option value="SHELTER">Emergency Shelter / Tent</option>
                  <option value="FOOD">Food & Water Rations</option>
                  <option value="MEDICAL">Medical Aid / Medicine</option>
                  <option value="EVACUATION">Transport / Evacuation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Location</label>
                <input required placeholder="Click map or type address..." className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all font-mono" 
                  value={appeal.location} onChange={e => setAppeal({...appeal, location: e.target.value})} />
              </div>

              <div className="pt-4">
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]">
                  SUBMIT APPEAL TO COORDINATORS
                </button>
              </div>
            </div>

            {/* Right Column: Map */}
            <div className="flex flex-col h-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pinpoint Location</label>
              <div className="flex-1 rounded-xl overflow-hidden border border-slate-700 shadow-inner relative min-h-[300px]">
                {/* 🔹 MAP INTEGRATION */}
                <LocationMap onSelect={handleLocationSelect} />
              </div>
              <p className="text-[10px] text-slate-500 mt-2 text-center">Click on the map to automatically set your GPS coordinates.</p>
            </div>

          </form>
        </div>
      )}

      {/* 3. PUBLIC ALERTS HUB */}
      {activeTab === 'alerts' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {alerts.length === 0 && <p className="text-slate-500 italic text-center py-10">No active public directives.</p>}
          {alerts.map(a => (
            <div key={a._id} className="bg-slate-900 border border-slate-800 border-l-4 border-l-red-500 p-6 rounded-r-xl shadow-md hover:bg-slate-800/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{a.title}</h3>
                <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded text-xs font-bold uppercase">{a.severity}</span>
              </div>
              <p className="text-slate-300 text-sm mb-3 leading-relaxed">{a.message}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider font-mono">
                <span>📍 Target: {a.region || "General"}</span>
                <span>•</span>
                <span>{new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}