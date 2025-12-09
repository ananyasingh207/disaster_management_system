import { useState } from "react";
import api from "../../api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/admin";
    } catch {
      setMsg("Invalid credentials. Access Denied.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decoration */}
      <div className="absolute w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px] -top-20 -left-20"></div>
      
      <div className="w-full max-w-md bg-[#0b0f19] border border-slate-800 p-10 rounded-2xl shadow-2xl relative z-10">
        
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white tracking-widest mb-2">COMMAND<span className="text-amber-500">.CTR</span></h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em]">Restricted Access</p>
        </div>

        {msg && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold text-center rounded-lg">{msg}</div>}

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Operative ID</label>
            <input
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Passkey</label>
            <input
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold py-3.5 rounded-lg shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02]">
            AUTHENTICATE
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-slate-600 text-xs hover:text-white transition-colors">← Return to Public Portal</a>
        </div>
      </div>
    </div>
  );
}