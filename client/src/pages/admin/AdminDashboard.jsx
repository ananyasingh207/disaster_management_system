import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import api from "../../api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("feed"); 
  const [personnelTab, setPersonnelTab] = useState("volunteers"); 
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch both Alerts (Feed) and Users
      const [alertRes, userRes] = await Promise.all([
        api.get("/admin/alerts"),
        api.get("/admin/users")
      ]);
      setAlerts(alertRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveVolunteer = async (id) => { try { await api.put(`/admin/volunteers/${id}/approve`); loadData(); } catch {} };
  const toggleVolunteer = async (id) => { if(!window.confirm("Change access status?")) return; try { await api.put(`/admin/volunteers/${id}/toggle-status`); loadData(); } catch {} };
  const toggleCitizen = async (id) => { if(!window.confirm("Change access status?")) return; try { await api.put(`/admin/citizens/${id}/toggle-status`); loadData(); } catch {} };
  const deleteUser = async (id) => { if(!window.confirm("Permanently delete user?")) return; try { await api.delete(`/admin/users/${id}`); loadData(); } catch {} };

  const volunteers = users.filter(u => u.roleType === 'VOLUNTEER');
  const citizens = users.filter(u => u.roleType === 'CITIZEN');

  if (loading) return <div className="text-white p-10 animate-pulse text-lg font-mono">INITIALIZING COMMAND INTERFACE...</div>;

  return (
    <div className="animate-fade-in-up">
      {/* HEADER */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Command Overwatch</h1>
        <p className="text-slate-400 font-medium">System Administration Console</p>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'feed' 
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          LIVE FEED
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'users' 
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          USER DATABASE
        </button>
      </div>

      {/* --- TAB 1: LIVE FEED --- */}
      {activeTab === 'feed' && (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Live Incident Feed
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alerts.length === 0 && <p className="text-slate-500 italic">No active data streams found.</p>}
            
            {alerts.map((a) => {
              // Determine Colors based on Source
              const isCitizen = a.typeTag === 'CITIZEN';
              const isVol = a.typeTag === 'VOLUNTEER';
              
              const borderColor = isCitizen ? 'border-red-500' : isVol ? 'border-orange-500' : 'border-blue-500';
              const textColor = isCitizen ? 'text-red-500' : isVol ? 'text-orange-500' : 'text-blue-500';
              const bgColor = isCitizen ? 'bg-red-500/5' : isVol ? 'bg-orange-500/5' : 'bg-blue-500/5';

              return (
                <div key={a._id} className={`bg-slate-900 border-l-4 ${borderColor} ${bgColor} p-6 rounded-r-xl shadow-sm hover:shadow-md transition-shadow`}>
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${borderColor} ${textColor}`}>
                      {a.typeTag}
                    </span>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">
                      {a.severity || "INFO"}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-2">{a.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{a.message || a.description}</p>
                  
                  {/* Footer Info */}
                  <div className="flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-slate-800/50">
                    <span>Source: <span className="text-slate-300 font-semibold">{a.source}</span></span>
                    <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Respond Button (Only for Incidents) */}
                  {(isCitizen || isVol) && (
                    <Link to={`/admin/incidents/${a._id}`}>
                      <button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded transition-colors border border-slate-700">
                        RESPOND TO INCIDENT →
                      </button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 2: USER MANAGEMENT --- */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
          
          {/* Sub-Tabs for User Type */}
          <div className="flex border-b border-slate-800 mb-6">
            <button 
              onClick={() => setPersonnelTab('volunteers')} 
              className={`pb-4 px-4 text-sm font-bold transition-colors border-b-2 ${
                personnelTab === 'volunteers' ? 'text-amber-500 border-amber-500' : 'text-slate-500 border-transparent hover:text-white'
              }`}
            >
              VOLUNTEERS <span className="bg-slate-800 px-2 py-0.5 rounded ml-2 text-xs text-white">{volunteers.length}</span>
            </button>
            <button 
              onClick={() => setPersonnelTab('citizens')} 
              className={`pb-4 px-4 text-sm font-bold transition-colors border-b-2 ${
                personnelTab === 'citizens' ? 'text-amber-500 border-amber-500' : 'text-slate-500 border-transparent hover:text-white'
              }`}
            >
              CITIZENS <span className="bg-slate-800 px-2 py-0.5 rounded ml-2 text-xs text-white">{citizens.length}</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                  <th className="p-4">Identity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Contact Point</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {(personnelTab === 'volunteers' ? volunteers : citizens).map(u => (
                  <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                    
                    {/* Name */}
                    <td className="p-4 font-semibold text-white">{u.name}</td>
                    
                    {/* Status Badge */}
                    <td className="p-4">
                      {personnelTab === 'volunteers' ? (
                        !u.approved 
                          ? <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded text-xs font-bold">PENDING APPROVAL</span> 
                          : <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-xs font-bold">ACTIVE AGENT</span>
                      ) : (
                        u.isApproved === false 
                          ? <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded text-xs font-bold">ACCOUNT SUSPENDED</span> 
                          : <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-xs font-bold">VERIFIED CITIZEN</span>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="p-4 text-slate-400 font-mono">{u.phone || u.email}</td>
                    
                    {/* Actions */}
                    <td className="p-4 flex gap-2">
                      {/* --- Volunteer Actions --- */}
                      {personnelTab === 'volunteers' && (
                        <button 
                          onClick={async () => {
                            if(u.approved && !window.confirm("Suspend this volunteer? They won't be able to login.")) return;
                            
                            // Use the new toggle endpoint
                            try {
                              await api.put(`/admin/volunteers/${u._id}/toggle-status`);
                              loadData(); // Refresh list
                            } catch (e) { alert("Action Failed"); }
                          }} 
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                            !u.approved 
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white' // Green for Approve
                              : 'bg-red-600/20 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white' // Red for Suspend
                          }`}
                        >
                          {!u.approved ? "APPROVE" : "SUSPEND"}
                        </button>
                      )}
                      {personnelTab === 'citizens' && (
                        <button 
                          onClick={() => toggleCitizen(u._id)} 
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-colors border ${
                            u.isApproved !== false 
                              ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                              : 'bg-emerald-500/10 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                          }`}
                        >
                          {u.isApproved !== false ? "SUSPEND" : "RESTORE"}
                        </button>
                      )}
                      <button onClick={() => deleteUser(u._id)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs font-bold transition-colors">
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}