// // import { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import api from "../../api";

// // export default function IncidentLog() {
// //   const [incidents, setIncidents] = useState([]);
// //   const [filter, setFilter] = useState("CITIZEN"); // 'CITIZEN' or 'VOLUNTEER'

// //   useEffect(() => {
// //     api.get("/admin/alerts").then((res) => {
// //       // Filter out Broadcasts, keep only reports
// //       const reports = res.data.filter(i => i.typeTag === 'CITIZEN' || i.typeTag === 'VOLUNTEER');
// //       setIncidents(reports);
// //     });
// //   }, []);

// //   const displayed = incidents.filter(i => i.typeTag === filter);

// //   return (
// //     <div className="animate-enter">
// //       <div className="page-header">
// //         <h1>Incident Log</h1>
// //         <p>Incoming reports registry.</p>
// //       </div>

// //       {/* TABS */}
// //       <div className="flex gap-4 mb-6">
// //         <button 
// //           onClick={() => setFilter("CITIZEN")}
// //           className={`px-6 py-2 rounded font-bold border transition ${filter === 'CITIZEN' ? 'bg-red-600/20 border-red-500 text-red-400' : 'border-gray-700 text-gray-500'}`}
// //         >
// //           CITIZEN REPORTS
// //         </button>
// //         <button 
// //           onClick={() => setFilter("VOLUNTEER")}
// //           className={`px-6 py-2 rounded font-bold border transition ${filter === 'VOLUNTEER' ? 'bg-orange-600/20 border-orange-500 text-orange-400' : 'border-gray-700 text-gray-500'}`}
// //         >
// //           VOLUNTEER REPORTS
// //         </button>
// //       </div>

// //       {/* LIST */}
// //       <div className="card-grid">
// //         {displayed.length === 0 && <p className="text-gray-500">No reports found in this category.</p>}
        
// //         {displayed.map((inc) => (
// //           <div key={inc._id} className="glass-panel p-6 relative overflow-hidden group">
// //             <div className={`absolute top-0 left-0 w-1 h-full ${filter === 'CITIZEN' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
            
// //             <div className="flex justify-between items-start mb-2">
// //               <div>
// //                 <h3 className="text-xl font-bold text-white">{inc.title}</h3>
// //                 <span className="text-xs text-gray-400 uppercase tracking-wider">{inc.typeTag} REPORT</span>
// //               </div>
// //               <span className={`badge badge-${inc.severity?.toLowerCase()}`}>{inc.severity}</span>
// //             </div>

// //             <p className="text-gray-300 text-sm mb-4 line-clamp-2">{inc.message}</p>

// //             <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
// //               <span>By: {inc.source}</span>
// //               <span>{new Date(inc.createdAt).toLocaleDateString()}</span>
// //             </div>

// //             <Link to={`/admin/incidents/${inc._id}`}>
// //               <button className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded transition">
// //                 OPEN CASE FILE
// //               </button>
// //             </Link>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // import { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import api from "../../api";

// // export default function IncidentLog() {
// //   const [alerts, setAlerts] = useState([]);

// //   useEffect(() => {
// //     fetchAlerts();
// //   }, []);

// //   const fetchAlerts = async () => {
// //     try {
// //       const res = await api.get("/admin/alerts");
// //       setAlerts(res.data);
// //     } catch (err) {
// //       console.error("Failed to fetch incidents", err);
// //     }
// //   };
// //   return (
// //   <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
// //     <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
// //       <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
// //       Live Incident Feed
// //     </h3>

// //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //       {alerts.length === 0 && (
// //         <p className="text-slate-500 italic">
// //           No active data streams found.
// //         </p>
// //       )}

// //       {alerts.map((a) => {
// //         const isCitizen = a.typeTag === "CITIZEN";
// //         const isVol = a.typeTag === "VOLUNTEER";

// //         const borderColor = isCitizen
// //           ? "border-red-500"
// //           : isVol
// //           ? "border-orange-500"
// //           : "border-blue-500";

// //         const textColor = isCitizen
// //           ? "text-red-500"
// //           : isVol
// //           ? "text-orange-500"
// //           : "text-blue-500";

// //         const bgColor = isCitizen
// //           ? "bg-red-500/5"
// //           : isVol
// //           ? "bg-orange-500/5"
// //           : "bg-blue-500/5";

// //         return (
// //           <div
// //             key={a._id}
// //             className={`bg-slate-900 border-l-4 ${borderColor} ${bgColor} p-6 rounded-r-xl shadow-sm hover:shadow-md transition-shadow`}
// //           >
// //             <div className="flex justify-between items-start mb-3">
// //               <span
// //                 className={`text-[10px] font-bold px-2 py-1 rounded border ${borderColor} ${textColor}`}
// //               >
// //                 {a.typeTag}
// //               </span>
// //               <span className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">
// //                 {a.severity || "INFO"}
// //               </span>
// //             </div>

// //             <h3 className="text-lg font-bold text-white mb-2">
// //               {a.title}
// //             </h3>

// //             <p className="text-slate-400 text-sm mb-4 line-clamp-2">
// //               {a.message || a.description}
// //             </p>

// //             <div className="flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-slate-800/50">
// //               <span>
// //                 Source:{" "}
// //                 <span className="text-slate-300 font-semibold">
// //                   {a.source}
// //                 </span>
// //               </span>
// //               <span>
// //                 {new Date(a.createdAt).toLocaleDateString()}
// //               </span>
// //             </div>

// //             {(isCitizen || isVol) && (
// //               <Link to={`/admin/incidents/${a._id}`}>
// //                 <button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded transition-colors border border-slate-700">
// //                   RESPOND TO INCIDENT →
// //                 </button>
// //               </Link>
// //             )}
// //           </div>
// //         );
// //       })}
// //     </div>
// //   </div>
// // )}

// // import { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import api from "../../api";

// // const normalizeAlert = (a) => ({
// //   id: a._id,
// //   title: a.message,
// //   message: a.message,
// //   severity: a.severity,
// //   source: "ADMIN",
// //   status: a.active ? "PENDING" : "COMPLETED",
// //   date: a.createdAt,
// // });

// // const normalizeCitizenAlert = (c) => ({
// //   id: c._id,
// //   title: c.title,
// //   message: c.message,
// //   severity: c.severity,
// //   source: "CITIZEN",
// //   status: c.status === "ACTIVE" ? "PENDING" : "COMPLETED",
// //   date: c.createdAt,
// // });

// // const normalizeCitizenIncident = (ci) => ({
// //   id: ci._id,
// //   title: ci.title,
// //   message: ci.description,
// //   severity: ci.severity,
// //   source: "CITIZEN",
// //   status: ci.status === "ACTIVE" ? "PENDING" : "COMPLETED",
// //   date: ci.createdAt,
// // });


// // export default function IncidentLog() {
// //   const [alerts, setAlerts] = useState([]);
// //   const [activeTab, setActiveTab] = useState("pending");

// //   useEffect(() => {
// //     fetchAlerts();
// //   }, []);

// //   const fetchAlerts = async () => {
// //     try {
// //       const res = await api.get("/admin/alerts");
// //       setAlerts(res.data);
// //     } catch (err) {
// //       console.error("Failed to fetch incidents", err);
// //     }
// //   };

// //   const pendingAlerts = alerts.filter(
// //     (a) => a.status !== "COMPLETED"
// //   );

// //   return (
// //     <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">

// //       {/* Header */}
// //       <h2 className="text-2xl font-bold text-white mb-6">
// //         Incident Log
// //       </h2>

// //       {/* Tabs */}
// //       <div className="flex gap-4 mb-8">
// //         <button
// //           onClick={() => setActiveTab("pending")}
// //           className={`px-4 py-2 rounded ${
// //             activeTab === "pending"
// //               ? "bg-red-600 text-white"
// //               : "bg-slate-800 text-slate-300"
// //           }`}
// //         >
// //           Pending Reports
// //         </button>

// //         <button
// //           onClick={() => setActiveTab("all")}
// //           className={`px-4 py-2 rounded ${
// //             activeTab === "all"
// //               ? "bg-blue-600 text-white"
// //               : "bg-slate-800 text-slate-300"
// //           }`}
// //         >
// //           All Incidents
// //         </button>
// //       </div>

// //       {/* TAB 1: Pending Reports */}
// //       {activeTab === "pending" && (
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           {pendingAlerts.length === 0 && (
// //             <p className="text-slate-400 italic">
// //               No pending incidents 🎉
// //             </p>
// //           )}

// //           {pendingAlerts.map((a) => (
// //             <div
// //               key={a._id}
// //               className="bg-slate-900 border-l-4 border-red-500 p-6 rounded-r-xl"
// //             >
// //               <div className="flex justify-between mb-2">
// //                 <span className="text-xs font-bold text-red-500">
// //                   {a.typeTag}
// //                 </span>
// //                 <span className="text-xs text-slate-400">
// //                   {a.severity}
// //                 </span>
// //               </div>

// //               <h3 className="text-lg font-bold text-white mb-2">
// //                 {a.title}
// //               </h3>

// //               <p className="text-slate-400 text-sm mb-4">
// //                 {a.message || a.description}
// //               </p>

// //               <Link to={`/admin/incidents/${a._id}`}>
// //                 <button className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm py-2 rounded">
// //                   RESPOND →
// //                 </button>
// //               </Link>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {/* TAB 2: Full Incident Log */}
// //       {activeTab === "all" && (
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-sm text-slate-300">
// //             <thead>
// //               <tr className="border-b border-slate-700">
// //                 <th className="text-left p-3">Title</th>
// //                 <th className="text-left p-3">Type</th>
// //                 <th className="text-left p-3">Severity</th>
// //                 <th className="text-left p-3">Status</th>
// //                 <th className="text-left p-3">Date</th>
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {alerts.map((a) => (
// //                 <tr
// //                   key={a._id}
// //                   className="border-b border-slate-800 hover:bg-slate-800/40"
// //                 >
// //                   <td className="p-3">{a.title}</td>
// //                   <td className="p-3">{a.typeTag}</td>
// //                   <td className="p-3">{a.severity}</td>
// //                   <td className="p-3">
// //                     <span
// //                       className={`px-2 py-1 rounded text-xs ${
// //                         a.status === "COMPLETED"
// //                           ? "bg-green-600 text-white"
// //                           : "bg-yellow-600 text-black"
// //                       }`}
// //                     >
// //                       {a.status}
// //                     </span>
// //                   </td>
// //                   <td className="p-3">
// //                     {new Date(a.createdAt).toLocaleDateString()}
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../../api";

// /* ---------- NORMALIZERS ---------- */
// const normalizeAlert = (a) => ({
//   id: a._id,
//   title: a.message,
//   message: a.message,
//   severity: a.severity,
//   source: "ADMIN",
//   status: a.active ? "PENDING" : "COMPLETED",
//   date: a.createdAt,
// });

// const normalizeSOS = (s) => ({
//   id: s._id,
//   title: s.title || "SOS Report",
//   message: s.description || s.message,
//   severity: s.severity || "HIGH",
//   source: "CITIZEN",
//   status: s.status === "ACTIVE" ? "PENDING" : "COMPLETED",
//   date: s.createdAt,
// });

// /* ---------- COMPONENT ---------- */
// export default function IncidentLog() {
//   const [incidents, setIncidents] = useState([]);
//   const [activeTab, setActiveTab] = useState("pending");

//   useEffect(() => {
//     loadIncidents();
//   }, []);

//   const loadIncidents = async () => {
//     try {
//       const [alertsRes, sosRes] = await Promise.all([
//         api.get("/admin/alerts"),
//         api.get("/sos/all"),
//       ]);

//       const merged = [
//         ...alertsRes.data.map(normalizeAlert),
//         ...sosRes.data.map(normalizeSOS),
//       ];

//       setIncidents(merged);
//     } catch (err) {
//       console.error("Failed to load incidents", err);
//     }
//   };

//   const pendingIncidents = incidents.filter(
//     (i) => i.status !== "COMPLETED"
//   );

//   return (
//     <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">

//       <h2 className="text-2xl font-bold text-white mb-6">
//         Incident Log
//       </h2>

//       {/* Tabs */}
//       <div className="flex gap-4 mb-8">
//         <button
//           onClick={() => setActiveTab("pending")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "pending"
//               ? "bg-red-600 text-white"
//               : "bg-slate-800 text-slate-300"
//           }`}
//         >
//           Pending Reports
//         </button>

//         <button
//           onClick={() => setActiveTab("all")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "all"
//               ? "bg-blue-600 text-white"
//               : "bg-slate-800 text-slate-300"
//           }`}
//         >
//           All Incidents
//         </button>
//       </div>

//       {/* Pending */}
//       {activeTab === "pending" && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {pendingIncidents.length === 0 && (
//             <p className="text-slate-400 italic">
//               No pending incidents 🎉
//             </p>
//           )}

//           {pendingIncidents.map((i) => (
//             <div
//               key={i.id}
//               className="bg-slate-900 border-l-4 border-red-500 p-6 rounded-r-xl"
//             >
//               <div className="flex justify-between mb-2">
//                 <span className="text-xs font-bold text-red-500">
//                   {i.source}
//                 </span>
//                 <span className="text-xs text-slate-400">
//                   {i.severity}
//                 </span>
//               </div>

//               <h3 className="text-lg font-bold text-white mb-2">
//                 {i.title}
//               </h3>

//               <p className="text-slate-400 text-sm mb-4">
//                 {i.message}
//               </p>

//               <Link to={`/admin/incidents/${i.id}`}>
//                 <button className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm py-2 rounded">
//                   RESPOND →
//                 </button>
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* All */}
//       {activeTab === "all" && (
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-slate-300">
//             <thead>
//               <tr className="border-b border-slate-700">
//                 <th className="text-left p-3">Title</th>
//                 <th className="text-left p-3">Source</th>
//                 <th className="text-left p-3">Severity</th>
//                 <th className="text-left p-3">Status</th>
//                 <th className="text-left p-3">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {incidents.map((i) => (
//                 <tr key={i.id} className="border-b border-slate-800">
//                   <td className="p-3">{i.title}</td>
//                   <td className="p-3">{i.source}</td>
//                   <td className="p-3">{i.severity}</td>
//                   <td className="p-3">{i.status}</td>
//                   <td className="p-3">
//                     {new Date(i.date).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import api from "../../api";
import { normalizeAlert, formatDateOnly } from "../../utils/normalizeAdminData";

export default function IncidentLog() {
  const [incidents, setIncidents] = useState([]);
  const [filter, setFilter] = useState("ALL"); // Optional filter

  useEffect(() => {
    api.get("/admin/alerts")
      .then((res) => {
        // Filter out broadcasts, keep incidents/reports
        const reports = (res.data || []).filter((i) => i.typeTag === "INCIDENT" || i.typeTag === "REPORT");
        // Normalize all incident data using shared helper
        const normalized = reports.map(normalizeAlert);
        setIncidents(normalized);
      })
      .catch((err) => {
        console.error("Failed to load incidents:", err);
        // Set empty array on error to prevent crashes
        setIncidents([]);
      });
  }, []);

  const displayed = incidents.filter((i) => filter === "ALL" || i.typeTag === filter);

  return (
    <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
      <h3 className="text-xl font-bold text-white mb-6">Incident Log</h3>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-lg font-bold text-sm ${
            filter === "ALL" ? "bg-amber-500 text-black" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("INCIDENT")}
          className={`px-4 py-2 rounded-lg font-bold text-sm ${
            filter === "INCIDENT" ? "bg-amber-500 text-black" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Citizen
        </button>
        <button
          onClick={() => setFilter("REPORT")}
          className={`px-4 py-2 rounded-lg font-bold text-sm ${
            filter === "REPORT" ? "bg-amber-500 text-black" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Volunteer
        </button>
      </div>

      {/* Table */}
      {displayed.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800 text-slate-500 uppercase text-xs">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Source</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((i) => (
                <tr key={i._id} className="border-b border-slate-800">
                  <td className="p-3">{i.title}</td>
                  <td className="p-3">{i.source || i.typeTag}</td>
                  <td className="p-3">{i.severity}</td>
                  <td className="p-3">{i.status}</td>
                  <td className="p-3">
                    {formatDateOnly(i.createdAt, "Date unavailable")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-500 text-center">No incidents logged.</p>
      )}
    </div>
  );
}