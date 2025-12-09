import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

export default function VolunteerRegister() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", skills: "", location: "", otp: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!form.email) return setMsg("Enter email first.");
    setMsg("Sending verification packet...");
    try {
      await api.post("/volunteer/auth/send-otp", { email: form.email });
      setOtpSent(true);
      setMsg("✓ CODE TRANSMITTED");
    } catch { setMsg("⚠ Transmission Failed"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/volunteer/auth/register", {
        ...form,
        skills: form.skills.split(",").map(s => s.trim()) // Format skills array
      });
      setMsg("✓ ENLISTMENT SUCCESSFUL. STANDBY FOR APPROVAL.");
      setTimeout(() => navigate("/volunteer/login"), 2000);
    } catch { setMsg("⚠ Registration Error"); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] relative">
      <div className="w-full max-w-2xl p-10 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-10 mx-4">
        
        <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">New Recruit</h1>
            <p className="text-slate-500 text-xs font-mono mt-1">Personnel Onboarding Form</p>
          </div>
          <div className="text-xs text-blue-500 font-bold border border-blue-500/30 px-2 py-1 rounded bg-blue-500/10">OPEN ENROLLMENT</div>
        </div>

        {msg && <div className="p-3 mb-6 bg-slate-900 border border-slate-700 text-blue-400 text-xs font-mono">{msg}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Identity */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-600 uppercase">Identity</h4>
            <input name="name" onChange={handleChange} required placeholder="Full Name" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2.5 text-white text-sm focus:border-blue-500 outline-none" />
            <input name="phone" onChange={handleChange} required placeholder="Contact Number" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2.5 text-white text-sm focus:border-blue-500 outline-none" />
            <input name="password" type="password" onChange={handleChange} required placeholder="Set Password" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2.5 text-white text-sm focus:border-blue-500 outline-none" />
          </div>

          {/* Logistics */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-600 uppercase">Logistics & Verification</h4>
            
            <input name="location" onChange={handleChange} required placeholder="Base City / Region" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2.5 text-white text-sm focus:border-blue-500 outline-none" />
            
            <input name="skills" onChange={handleChange} required placeholder="Skills (ex: Medic, Driver)" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2.5 text-white text-sm focus:border-blue-500 outline-none" />

            <div className="flex gap-2">
              <input name="email" type="email" onChange={handleChange} required placeholder="Email Address" className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2.5 text-white text-sm focus:border-blue-500 outline-none" />
              {!otpSent && <button type="button" onClick={handleSendOtp} className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold">OTP</button>}
            </div>

            {otpSent && <input name="otp" onChange={handleChange} required placeholder="Enter Code" className="w-full bg-slate-900 border border-green-500/50 rounded px-3 py-2.5 text-white text-sm focus:border-green-500" />}
          </div>

          <button type="submit" disabled={!otpSent} className={`md:col-span-2 mt-4 py-3.5 rounded font-bold text-sm tracking-widest uppercase transition-all ${otpSent ? "bg-white text-black hover:bg-slate-200" : "bg-slate-800 text-slate-600 cursor-not-allowed"}`}>
            {otpSent ? "Submit Dossier" : "Verify Email Required"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600">
          Already verified? <Link to="/volunteer/login" className="text-blue-500 hover:text-white transition-colors">Unit Login</Link>
        </div>
      </div>
    </div>
  );
}