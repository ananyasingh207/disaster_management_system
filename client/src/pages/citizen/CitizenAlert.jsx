import { useEffect, useState } from "react";
import api from "../../api";

export default function CitizenAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.get("/citizen/alerts").then((res) => setAlerts(res.data));
  }, []);

  return (
    <div>
      <h3 className="mb-4">Public Alerts</h3>

      {alerts.map((a) => (
        <div className="alert alert-danger" key={a._id}>
          <h6>{a.title}</h6>
          <p>{a.message}</p>
          <small>Region: {a.region}</small>
        </div>
      ))}
    </div>
  );
}
