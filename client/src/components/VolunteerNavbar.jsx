import { NavLink, useNavigate } from "react-router-dom";

export default function VolunteerNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getLinkClass = ({ isActive }) => {
    const base =
      "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200";
    const active =
      "bg-blue-500/10 text-blue-400 border-l-4 border-blue-500 shadow-lg shadow-blue-900/20";
    const inactive =
      "text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent";

    return isActive ? `${base} ${active}` : `${base} ${inactive}`;
  };

  return (
    <aside className="h-screen w-72 bg-[#0f172a] border-r border-slate-700 flex flex-col sticky top-0 z-50">

      {/* HEADER */}
      <div className="p-8 border-b border-slate-700/50">
        <h2 className="text-2xl font-black text-white tracking-tight">
          VOLUNTEER<span className="text-blue-500">.OS</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Disaster Response Unit
        </p>
      </div>

      {/* NAVIGATION (scrollable) */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
        <NavLink to="/volunteer" end className={getLinkClass}>
          <span>🏠</span> Dashboard
        </NavLink>
        <NavLink to="/volunteer/training" className={getLinkClass}>
          <span>🎓</span> Training Center
        </NavLink>
        <NavLink to="/volunteer/missions" className={getLinkClass}>
          <span>🚀</span> Missions
        </NavLink>
        <NavLink to="/volunteer/report" className={getLinkClass}>
          <span>📝</span> Report Incident
        </NavLink>
        <NavLink to="/volunteer/profile" className={getLinkClass}>
          <span>👤</span> My Profile
        </NavLink>
      </nav>

      {/* STATUS + LOGOUT (NON-scrollable bottom) */}
      <div className="p-4 m-4 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
        <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2">
          Status
        </p>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
          ONLINE
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-500 transition-all"
        >
          🚪 Logout
        </button>
      </div>

    </aside>
  );
}
