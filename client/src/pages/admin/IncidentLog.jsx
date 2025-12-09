import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function IncidentLog() {
  const [incidents, setIncidents] = useState([]);
  const [filter, setFilter] = useState("CITIZEN"); // 'CITIZEN' or 'VOLUNTEER'

  useEffect(() => {
    api.get("/admin/alerts").then((res) => {
      // Filter out Broadcasts, keep only reports
      const reports = res.data.filter(i => i.typeTag === 'CITIZEN' || i.typeTag === 'VOLUNTEER');
      setIncidents(reports);
    });
  }, []);

  const displayed = incidents.filter(i => i.typeTag === filter);

  return (
    <div className="animate-enter">
      <div className="page-header">
        <h1>Incident Log</h1>
        <p>Incoming reports registry.</p>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setFilter("CITIZEN")}
          className={`px-6 py-2 rounded font-bold border transition ${filter === 'CITIZEN' ? 'bg-red-600/20 border-red-500 text-red-400' : 'border-gray-700 text-gray-500'}`}
        >
          CITIZEN REPORTS
        </button>
        <button 
          onClick={() => setFilter("VOLUNTEER")}
          className={`px-6 py-2 rounded font-bold border transition ${filter === 'VOLUNTEER' ? 'bg-orange-600/20 border-orange-500 text-orange-400' : 'border-gray-700 text-gray-500'}`}
        >
          VOLUNTEER REPORTS
        </button>
      </div>

      {/* LIST */}
      <div className="card-grid">
        {displayed.length === 0 && <p className="text-gray-500">No reports found in this category.</p>}
        
        {displayed.map((inc) => (
          <div key={inc._id} className="glass-panel p-6 relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${filter === 'CITIZEN' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
            
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold text-white">{inc.title}</h3>
                <span className="text-xs text-gray-400 uppercase tracking-wider">{inc.typeTag} REPORT</span>
              </div>
              <span className={`badge badge-${inc.severity?.toLowerCase()}`}>{inc.severity}</span>
            </div>

            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{inc.message}</p>

            <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
              <span>By: {inc.source}</span>
              <span>{new Date(inc.createdAt).toLocaleDateString()}</span>
            </div>

            <Link to={`/admin/incidents/${inc._id}`}>
              <button className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded transition">
                OPEN CASE FILE
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}