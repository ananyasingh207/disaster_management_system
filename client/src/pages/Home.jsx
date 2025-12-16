import { Link } from "react-router-dom";
import { getRoleFromToken } from "../utils/jwt";
import Footer from "../components/Footer";
import { useState } from "react";

export default function Home() {

  // Detect login
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const userRole = getRoleFromToken(token);

  const dashboardRoutes = {
    admin: "/admin",
    volunteer: "/volunteer",
    citizen: "/citizen",
  };

  const dashboardLink = dashboardRoutes[userRole] || "/";

  // Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);


  return (
    <div className="min-h-screen flex flex-col text-white font-sans relative">

      {/* NAVBAR */}
      <header className="absolute top-0 left-0 w-full z-50 px-10 py-6 flex justify-between items-center">

        {/* LOGO LEFT */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
          <h1 className="text-2xl font-black tracking-widest text-white">
            RESCUE<span className="text-red-600">OPS</span>
          </h1>
        </div>

        {/* RIGHT BUTTON GROUP */}
        <div className="flex items-center gap-4">

          {/* SHOW Admin Access & Login ONLY when user is NOT logged in */}
          {!isLoggedIn && (
            <>
              {/* ADMIN ACCESS BUTTON */}
              <Link
                to="/admin/login"
                className="px-5 py-2 text-sm bg-white/10 border border-white/20 
                      text-white rounded-full hover:bg-white/20 transition"
              >
                Admin Access
              </Link>

              {/* LOGIN DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setShowLoginMenu(!showLoginMenu)}
                  className="px-5 py-2 text-sm bg-white/10 border border-white/20 
                        text-white rounded-full hover:bg-white/20 transition"
                >
                  Login
                </button>

                {/* DROPDOWN MENU */}
                {showLoginMenu && (
                  <div
                    className="absolute right-0 mt-2 w-40 bg-[#0f0f0f] border border-white/10 
                          rounded-lg shadow-xl shadow-black/40 overflow-hidden animate-fade-slide"
                  >
                    <Link
                      to="/citizen/login"
                      className="block px-4 py-3 text-sm text-slate-300 hover:bg-white/10 transition"
                      onClick={() => setShowLoginMenu(false)}
                    >
                      Citizen Login
                    </Link>

                    <Link
                      to="/volunteer/login"
                      className="block px-4 py-3 text-sm text-slate-300 hover:bg-white/10 transition"
                      onClick={() => setShowLoginMenu(false)}
                    >
                      Volunteer Login
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* SHOW LOGOUT WHEN LOGGED IN */}
          {isLoggedIn && (
            <>
              <Link
                to={dashboardLink}
                className="px-5 py-2 text-sm bg-white/10 border border-white/20 
                      text-white rounded-full hover:bg-white/20 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="px-5 py-2 text-sm bg-red-600/20 border border-red-600/30 
                      text-white font-bold rounded-full hover:bg-red-600/30 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative w-full min-h-screen flex items-center px-16 py-32 overflow-hidden">

        {/* VIDEO BACKGROUND */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        >
          <source src="/videos/bg.mp4" type="video/mp4" />
        </video>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* LEFT HERO CONTENT */}
        <div className="relative z-10 w-full md:w-1/2 mt-4 text-left">

          {/* UPPER TAG */}
          <p className="uppercase tracking-[0.3em] text-red-400 text-xs mb-4 font-bold">
            Disaster Management System
          </p>

          {/* MAIN TITLE */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Where Every Second
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-orange-300">
              Saves Lives
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="text-slate-300 text-lg max-w-lg mb-8">
            Be part of a real-time platform where citizens and volunteers unite
            for rapid, coordinated disaster response.
          </p>

          {/* REGISTER BUTTON */}
          {/* SHOW "Register Now" ONLY when user is NOT logged in */}
          {!isLoggedIn && (
            <button
              className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full 
                        text-lg shadow-lg shadow-red-900/30 transition"
              onClick={() => setShowRegisterModal(true)}
            >
              Register Now
            </button>
          )}


        </div>

      </main>

      {/* REGISTER MODAL */}
      {showRegisterModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[9999]"
          onClick={() => setShowRegisterModal(false)}
        >
          <div
            className="relative bg-[#0c0c0c] text-white p-6 rounded-xl w-full max-w-sm 
                    shadow-xl shadow-black/50 border border-white/5 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-[-20px] left-[-20px] w-[320px] h-[320px] 
                          bg-red-400/40 blur-[160px] rounded-full pointer-events-none"></div>

            <div className="w-12 h-1 bg-red-600 opacity-90 mx-auto mb-4 relative z-10"></div>

            {/* HEADING */}
            <h1 className="text-xl font-bold mb-5 text-center text-white tracking-wide relative z-10">
              How would you like to register?
            </h1>

            <div className="flex flex-col gap-3 relative z-10">

              {/* CITIZEN */}
              <div className="bg-slate-900 p-4 rounded-lg shadow-sm shadow-black/20 border border-white/10">
                <p className="text-sm font-bold text-white mb-1 text-center">
                  I Need Help
                </p>
                <p className="text-xs text-slate-300 mb-3 text-center">
                  Request assistance during an emergency.
                </p>

                <Link to="/citizen/register">
                  <button className="w-full px-5 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold 
                                  text-sm transition shadow-sm shadow-red-900/20">
                    Register as Citizen
                  </button>
                </Link>
              </div>

              {/* VOLUNTEER */}
              <div className="bg-slate-900 p-4 rounded-lg shadow-sm shadow-black/20 border border-white/10">
                <p className="text-sm font-bold text-white mb-1 text-center">
                  Join The Force
                </p>
                <p className="text-xs text-slate-300 mb-3 text-center">
                  Volunteer to help others during emergencies.
                </p>

                <Link to="/volunteer/register">
                  <button className="w-full px-5 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold 
                                  text-sm transition shadow-sm shadow-red-900/20">
                    Register as Volunteer
                  </button>
                </Link>
              </div>

            </div>

            {/* CLOSE */}
            <button
              className="mt-4 text-xs text-slate-400 hover:text-white w-full text-center relative z-10 transition"
              onClick={() => setShowRegisterModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
