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
      const [cRes, vRes] = await Promise.all([
        api.get("/admin/citizens"),
        api.get("/admin/volunteers"),
      ]);

      setCitizens(cRes.data || []);
      setVolunteers(vRes.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (volunteer) => {
    const newStatus = !volunteer.approved;
    const action = newStatus ? "REINSTATE" : "SUSPEND";

    if (!window.confirm(`Are you sure you want to ${action} this volunteer?`))
      return;

    try {
      setVolunteers((prev) =>
        prev.map((v) =>
          v._id === volunteer._id ? { ...v, approved: newStatus } : v
        )
      );

      await api.put(`/admin/volunteers/${volunteer._id}/status`, {
        approved: newStatus,
      });
    } catch (err) {
      alert("Status update failed");
      loadData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* HEADER */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white mb-2">
          User Management
        </h1>
        <p className="text-slate-400">
          Manage citizen accounts and volunteer access permissions.
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("citizens")}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all
              ${activeTab === "citizens"
              ? "bg-slate-700 text-white border border-sky-500/30 shadow-sm shadow-sky-900/20"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
        >
          Citizens
        </button>

        <button
          onClick={() => setActiveTab("volunteers")}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all
            ${activeTab === "volunteers"
              ? "bg-slate-700 text-white border border-sky-500/30 shadow-sm shadow-sky-900/20"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
        >
          Volunteers
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            Loading users...
          </div>
        ) : (
          <>
            {/* CITIZENS TABLE */}
            {activeTab === "citizens" && (
              <table className="w-full text-sm">
                <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Phone</th>
                    <th className="px-6 py-4 text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {citizens.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-10 text-center text-slate-500"
                      >
                        No citizens found.
                      </td>
                    </tr>
                  ) : (
                    citizens.map((user) => (
                      <tr
                        key={user._id}
                        className="border-t border-slate-800 hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4 text-white font-medium">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-mono">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {user.phone || "—"}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* VOLUNTEERS TABLE */}
            {activeTab === "volunteers" && (
              <table className="w-full text-sm">
                <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Skills</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-10 text-center text-slate-500"
                      >
                        No volunteers found.
                      </td>
                    </tr>
                  ) : (
                    volunteers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-t border-slate-800 hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4 text-white font-medium">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-mono">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {user.skills?.length
                            ? user.skills.join(", ")
                            : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${user.approved
                                ? "bg-emerald-900/30 text-emerald-400"
                                : "bg-red-900/30 text-red-400"
                              }`}
                          >
                            {user.approved ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`px-4 py-2 rounded-md text-xs font-semibold transition
                              ${user.approved
                                ? "bg-slate-700 text-red-400 hover:bg-red-900/40"
                                : "bg-emerald-600/80 text-white hover:bg-emerald-600"
                              }`}
                          >
                            {user.approved
                              ? "Suspend"
                              : "Reinstate"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

