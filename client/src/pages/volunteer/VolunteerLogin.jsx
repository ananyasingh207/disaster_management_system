import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

export default function VolunteerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      // Volunteer Auth Endpoint
      const res = await api.post("/volunteer/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/volunteer");
    } catch (err) {
      setMsg(err.response?.data?.message || "Connection Refused. Invalid Credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] relative overflow-hidden">
      
      {/* Tactical Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
      
      {/* Blue Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md p-10 relative z-10 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl mx-4">
        
        <div className="mb-10">
          <div className="w-12 h-1 bg-blue-600 mb-6"></div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            UNIT ACCESS
          </h1>
          <p className="text-slate-400 text-sm font-mono mt-1">Disaster Response Force</p>
        </div>

        {msg && (
          <div className="p-3 mb-6 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-xs font-bold font-mono">
            ⚠ {msg}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
              Operative Email
            </label>
            <input 
              type="email"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="operative@unit.com"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
              Security Code
            </label>
            <input 
              type="password" 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required
            />
          </div>

          <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wider uppercase rounded-lg shadow-lg shadow-blue-600/20 transition-all transform hover:translate-y-[-1px]">
            ESTABLISH LINK
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-900 text-center">
          <Link to="/volunteer/register" className="text-slate-500 text-xs hover:text-blue-400 transition-colors">
            APPLY FOR ENLISTMENT →
          </Link>
        </div>
      </div>
    </div>
  );
}