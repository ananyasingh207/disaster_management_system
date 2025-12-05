import { useState } from "react";
import api from "../../api";

export default function ReportIncident() {
  const [form, setForm] = useState({
    missionId: "",
    type: "",
    description: "",
    address: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/reports", {
      ...form,
      location: { address: form.address },
    });
    window.location.href = "/volunteer";
  };

  return (
    <div className="glass-panel p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Report Incident</h1>

      <form onSubmit={submit}>
        <input
          className="glass-input mb-3"
          placeholder="Mission ID (optional)"
          value={form.missionId}
          onChange={(e) => setForm({ ...form, missionId: e.target.value })}
        />

        <select
          className="glass-input mb-3"
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option>Select Type</option>
          <option value="damage">Damage</option>
          <option value="hazard">Hazard</option>
          <option value="need">Needs</option>
        </select>

        <textarea
          className="glass-input mb-3"
          placeholder="Description"
          rows="3"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        ></textarea>

        <input
          className="glass-input mb-4"
          placeholder="Address"
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <button className="bg-red-600 px-4 py-2 rounded w-full">
          Submit
        </button>
      </form>
    </div>
  );
}
