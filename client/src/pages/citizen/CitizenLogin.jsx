import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

export default function CitizenLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.post("/citizen/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/citizen");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed. Server not reachable.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80 pointer-events-none"></div>

      <div className="w-full max-w-md p-10 relative z-10 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl mx-4">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm font-medium">Secure Citizen Access Portal</p>
        </div>

        {msg && (
          <div className="p-4 mb-6 rounded-lg text-center text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            {msg}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Email Address
            </label>
            <input 
              type="email"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="citizen@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Password
            </label>
            <input 
              type="password" 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required
            />
          </div>

          <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-all transform hover:scale-[1.01] active:scale-95">
            ACCESS DASHBOARD
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-800">
          <p className="text-sm text-slate-500">
            First time reporting? 
            <Link to="/citizen/register" className="text-blue-400 hover:text-white font-bold ml-2 transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}