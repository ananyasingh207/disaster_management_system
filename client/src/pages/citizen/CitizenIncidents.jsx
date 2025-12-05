import { useEffect, useState } from "react";
import api from "../../api";
import "../../github-css/citizen-incident.css";

export default function CitizenIncidents() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/citizen/incidents").then((res) => setList(res.data));
  }, []);

  return (
    <div>
      <h3 className="mb-4">My Incidents</h3>

      {list.map((inc) => (
        <div key={inc._id} className="incident-item mb-3">
          <h5>{inc.title}</h5>
          <p className="text-muted">{inc.type}</p>
          <p>{inc.description}</p>
          <span className="badge bg-danger">{inc.status}</span>
        </div>
      ))}
    </div>
  );
}
