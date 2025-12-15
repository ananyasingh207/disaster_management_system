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
          Current Assignment
        </NavLink>
        <NavLink to="/volunteer/training" className={getLinkClass}>
          Training & Readiness
        </NavLink>
        <NavLink to="/volunteer/broadcasts" className={getLinkClass}>
          Broadcasts
        </NavLink>
        <NavLink to="/volunteer/profile" className={getLinkClass}>
          My Profile
        </NavLink>
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all text-sm font-medium"
        >
          Sign Out
        </button>
      </div>

    </aside>
  );
}
