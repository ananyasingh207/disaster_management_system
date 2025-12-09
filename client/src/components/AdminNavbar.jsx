import { NavLink, useNavigate } from "react-router-dom";

export default function AdminNavbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getLinkClass = ({ isActive }) => {
    const base =
      "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200";
    const active =
      "bg-amber-500/10 text-amber-500 border-l-4 border-amber-500 shadow-lg shadow-amber-900/20";
    const inactive =
      "text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent";

    return isActive ? `${base} ${active}` : `${base} ${inactive}`;
  };

  return (
    <aside className="h-screen w-72 bg-[#0b0f19] border-r border-slate-800 flex flex-col sticky top-0 z-50">

      {/* HEADER */}
      <div className="p-8 border-b border-slate-800/50">
        <h2 className="text-2xl font-black text-white tracking-tighter">
          COMMAND<span className="text-amber-500">.CTR</span>
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]"></div>
          <p className="text-[10px] font-bold text-amber-500/80 tracking-[0.2em] uppercase">
            Admin Overwatch
          </p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
        <NavLink to="/admin" end className={getLinkClass}>
          <span>📊</span> Overwatch Dashboard
        </NavLink>
        <NavLink to="/admin/teams" className={getLinkClass}>
          <span>🛡️</span> Team Assignment
        </NavLink>
        <NavLink to="/admin/incidents" className={getLinkClass}>
          <span>⚠️</span> Incident Reports
        </NavLink>
        <NavLink to="/admin/broadcast" className={getLinkClass}>
          <span>📡</span> Broadcast Alerts
        </NavLink>
        <NavLink to="/admin/relief" className={getLinkClass}>
          <span>📦</span> Relief Ops
        </NavLink>
      </nav>

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="m-4 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition-all text-center"
      >
        🚪 Logout
      </button>

    </aside>
  );
}
