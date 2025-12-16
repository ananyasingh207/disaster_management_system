import { useState, useEffect } from "react";
import api from "../../api";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("citizens");
  const [citizens, setCitizens] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch both lists in parallel
      const [cRes, vRes] = await Promise.all([
        api.get("/admin/citizens"),
        api.get("/admin/volunteers")
      ]);

      setCitizens(cRes.data);
      setVolunteers(vRes.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (volunteer) => {
    const newStatus = !volunteer.approved;
    const action = newStatus ? "REINSTATE" : "SUSPEND";

    if (!window.confirm(`Are you sure you want to ${action} this volunteer?`)) return;

    try {
      // Optimistic update
      setVolunteers(prev => prev.map(v =>
        v._id === volunteer._id ? { ...v, approved: newStatus } : v
      ));

      await api.put(`/admin/volunteers/${volunteer._id}/status`, {
        approved: newStatus
      });

    } catch (err) {
      alert("Status update failed");
      loadData(); // Revert on failure
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in-up">
      {/* Header */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">User Management</h1>
        <p className="text-slate-400 font-medium">Manage citizen accounts and volunteer access permissions.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("citizens")}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === "citizens"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
        >
          CITIZENS ({citizens.length})
        </button>
        <button
          onClick={() => setActiveTab("volunteers")}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === "volunteers"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
        >
          VOLUNTEERS ({volunteers.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 min-h-[400px]">
        {loading ? (
          <div className="text-center py-20 text-slate-500 animate-pulse">Loading users...</div>
        ) : (
          <>
            {/* CITIZENS VIEW */}
            {activeTab === "citizens" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {citizens.length === 0 && <p className="text-slate-500 col-span-3">No citizens found.</p>}
                {citizens.map(user => (
                  <div key={user._id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-bold">{user.name}</h3>
                        <p className="text-xs text-slate-400 font-mono">{user.email}</p>
                      </div>
                      <span className="bg-blue-900/30 text-blue-400 text-[10px] font-bold px-2 py-1 rounded">
                        CITIZEN
                      </span>
                    </div>
                    {user.phone && <p className="text-xs text-slate-500">📞 {user.phone}</p>}
                    <div className="mt-2 text-[10px] text-slate-600 font-mono">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VOLUNTEERS VIEW */}
            {activeTab === "volunteers" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {volunteers.length === 0 && <p className="text-slate-500 col-span-3">No volunteers found.</p>}
                {volunteers.map(user => (
                  <div key={user._id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-3 group hover:border-slate-600 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-bold">{user.name}</h3>
                        <p className="text-xs text-slate-400 font-mono">{user.email}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${user.approved
                          ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30"
                          : "bg-red-900/30 text-red-400 border border-red-500/30"
                        }`}>
                        {user.approved ? "ACTIVE" : "SUSPENDED"}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 space-y-1">
                      {user.skills && <p>🛠 {user.skills.join(", ")}</p>}
                      {user.phone && <p>📞 {user.phone}</p>}
                    </div>

                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`w-full py-2 rounded-lg font-bold text-xs transition-colors ${user.approved
                          ? "bg-slate-700 text-red-400 hover:bg-red-900/50 hover:text-red-200"
                          : "bg-emerald-600 text-white hover:bg-emerald-500"
                        }`}
                    >
                      {user.approved ? "SUSPEND ACCOUNT" : "REINSTATE ACCOUNT"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
