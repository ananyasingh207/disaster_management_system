import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

export default function IncidentDetails() {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    api.get(`/admin/incidents/${id}/notes`).then((res) => setNotes(res.data));
  }, [id]);

  const addNote = async () => {
    await api.post(`/admin/incidents/${id}/notes`, { content });
    window.location.reload();
  };

  return (
    <div className="glass-panel p-6">
      <h1 className="text-xl font-bold">Incident Notes</h1>

      <textarea
        className="glass-input mt-4"
        placeholder="Add note"
        rows="3"
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <button
        className="bg-red-600 px-4 py-2 rounded mt-3"
        onClick={addNote}
      >
        Add Note
      </button>

      <h2 className="text-lg font-semibold mt-6">Previous Notes</h2>
      {notes.map((n) => (
        <div className="border border-gray-700 p-3 rounded mt-2" key={n._id}>
          <p>{n.content}</p>
          <small className="text-gray-400">By {n.author}</small>
        </div>
      ))}
    </div>
  );
}
