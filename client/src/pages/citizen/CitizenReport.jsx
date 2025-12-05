import { useState } from "react";
import api from "../../api";
import "../../github-css/citizen-report.css";

export default function CitizenReport() {
  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    address: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/citizen/incidents", {
      title: form.title,
      type: form.type,
      description: form.description,
      location: { address: form.address },
    });
    window.location.href = "/citizen/incidents";
  };

  return (
    <div className="report-box">
      <h3>Report Incident</h3>

      <form onSubmit={submit}>
        <input className="form-control mb-3" placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })} />

        <select className="form-control mb-3"
          onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="">Select Type</option>
          <option value="fire">Fire</option>
          <option value="flood">Flood</option>
          <option value="accident">Accident</option>
        </select>

        <textarea className="form-control mb-3" placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>

        <input className="form-control mb-3" placeholder="Address"
          onChange={(e) => setForm({ ...form, address: e.target.value })} />

        <button className="btn btn-danger w-100">Submit</button>
      </form>
    </div>
  );
}
