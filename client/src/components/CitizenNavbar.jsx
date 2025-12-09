import { Link, useLocation, useNavigate } from "react-router-dom";

export default function CitizenNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="bg-[#1e293b] border-b border-slate-700 w-full sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">

        {/* LEFT: LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_#ef4444]"></div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase group-hover:text-red-100 transition-colors">
            DISASTER<span className="text-red-500">PORTAL</span>
          </h1>
        </Link>

        {/* MIDDLE: NAVIGATION LINKS */}
        <div className="flex items-center gap-2 md:gap-6 flex-wrap">

          <Link
            to="/citizen/incidents"
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              isActive("/incidents")
                ? "text-white bg-slate-700/50"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            My Reports
          </Link>

          <Link
            to="/citizen/relief"
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              isActive("/relief")
                ? "text-white bg-slate-700/50"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Shelter & Relief
          </Link>

          <Link
            to="/citizen/alerts"
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              isActive("/alerts")
                ? "text-white bg-slate-700/50"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            Alerts
          </Link>

          {/* REPORT INCIDENT */}
          <Link to="/citizen/report">
            <button className="bg-gradient-to-r from-red-600 to-red-500 
                               hover:from-red-500 hover:to-red-400 
                               text-white px-4 py-2 rounded-lg font-bold text-xs 
                               shadow-[0_4px_14px_rgba(239,68,68,0.4)]
                               transition-all transform hover:scale-105 active:scale-95 ml-2">
              REPORT INCIDENT
            </button>
          </Link>

        </div>

        {/* RIGHT: LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-500 transition-all"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}
