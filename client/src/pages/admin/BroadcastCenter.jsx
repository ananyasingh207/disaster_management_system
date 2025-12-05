import { useEffect, useState } from "react";
import api from "../../api";
import LocationMap from "../../components/LocationMap";

export default function BroadcastCenter() {
  const [alerts, setAlerts] = useState([]);
  
  // State for messages
  const [status, setStatus] = useState({ type: "", msg: "" });

  const [form, setForm] = useState({
    title: "", message: "", type: "WEATHER", region: "", severity: "LOW"
  });

  const loadAlerts = async () => {
    try {
      const res = await api.get("/admin/alerts");
      setAlerts(res.data);
    } catch (err) {
      console.error("Failed to load alerts:", err);
    }
  };

  useEffect(() => { loadAlerts(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLocationSelect = (coords) => {
    setForm((prev) => ({ ...prev, region: coords }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" }); // Clear previous msg

    try {
      await api.post("/admin/alerts/citizen", form);
      
      setStatus({ type: "success", msg: "Alert Broadcasted Successfully!" });
      setForm({ title: "", message: "", type: "WEATHER", region: "", severity: "LOW" });
      loadAlerts(); // Refresh list
    } catch (err) {
      console.error("Broadcast Error:", err.response?.data || err.message);
      
      // Show specific error message from backend if available
      const errMsg = err.response?.data?.message || "Failed to send broadcast. Check console.";
      setStatus({ type: "error", msg: errMsg });
    }
  };

  return (
    <div className="animate-enter">
      <div className="page-header">
        <h1>Broadcast Center</h1>
        <p>Issue public safety warnings and designate target zones.</p>
      </div>

      {/* DYNAMIC MESSAGE BOX (Red for Error, Green for Success) */}
      {status.msg && (
        <div style={{ 
          padding: "1rem", 
          marginBottom: "1rem", 
          borderRadius: "12px", 
          border: status.type === "error" ? "1px solid #ef4444" : "1px solid #4ade80",
          background: status.type === "error" ? "rgba(239, 68, 68, 0.2)" : "rgba(74, 222, 128, 0.2)",
          color: status.type === "error" ? "#ef4444" : "#4ade80"
        }}>
          {status.type === "error" ? "⚠ " : "✓ "} {status.msg}
        </div>
      )}

      <div className="glass-panel" style={{ padding: "2rem" }}>
        <form onSubmit={submit}>
          <div className="grid-2" style={{ gap: "2rem" }}>
            
            {/* Inputs Section */}
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Alert Title</label>
                <input name="title" value={form.title} onChange={change} required />
              </div>

              <div className="grid-2" style={{ gap: "1rem", marginBottom: "0" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label>Type</label>
                  <select name="type" value={form.type} onChange={change}>
                    <option value="WEATHER">Weather</option>
                    <option value="REGION_WARNING">Regional Hazard</option>
                    <option value="EVACUATION">Evacuation</option>
                  </select>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label>Severity</label>
                  <select name="severity" value={form.severity} onChange={change}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label>Target Region</label>
                <input name="region" value={form.region} onChange={change} placeholder="Click map..." />
              </div>

              <div>
                <label>Message</label>
                <textarea name="message" rows="3" value={form.message} onChange={change} required />
              </div>
            </div>

            {/* Map Section */}
            <div>
              <label>Target Designator</label>
              <LocationMap onSelect={handleLocationSelect} severity={form.severity} />
              
              <button type="submit" style={{ width: "100%", marginTop: "1.5rem", background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" }}>
                INITIATE BROADCAST
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}