import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

export default function CitizenRegister() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", otp: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!form.email) return setMsg("Please enter email address first.");
    setMsg("Sending Code...");
    try {
      await api.post("/citizen/otp/send", { email: form.email });
      setOtpSent(true);
      setMsg("✓ OTP Sent");
    } catch { setMsg("⚠ Failed to send OTP"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/citizen/auth/register", form);
      setMsg("✓ Success! Redirecting...");
      setTimeout(() => navigate("/citizen/login"), 1500);
    } catch (err) { setMsg("⚠ Registration Failed"); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="w-full max-w-md p-10 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl mx-4 z-10">
        <h1 className="text-3xl font-black text-white text-center mb-2">Join the Network</h1>
        <p className="text-slate-400 text-sm text-center mb-8">Citizen Reporting Registration</p>

        {msg && <div className="p-3 mb-6 rounded text-center text-sm bg-slate-800 border border-slate-700 text-blue-400 font-bold">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="name" onChange={handleChange} required placeholder="Full Name" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-blue-500" />
          <input name="phone" onChange={handleChange} required placeholder="Phone Number" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-blue-500" />
          
          <div className="flex gap-2">
            <input name="email" type="email" onChange={handleChange} required placeholder="Email Address" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-blue-500" />
            {!otpSent && <button type="button" onClick={handleSendOtp} className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors whitespace-nowrap">GET OTP</button>}
          </div>

          {otpSent && <input name="otp" onChange={handleChange} required placeholder="Enter 6-digit OTP" className="w-full bg-slate-950 border border-green-500/50 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-green-500 animate-fade-in" />}

          <input name="password" type="password" onChange={handleChange} required placeholder="Password" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-blue-500" />

          <button type="submit" disabled={!otpSent} className={`w-full py-3.5 rounded-lg font-bold text-sm shadow-lg transition-all ${otpSent ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}>
            {otpSent ? "CREATE ACCOUNT" : "VERIFY EMAIL FIRST"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-500">Already registered? <Link to="/citizen/login" className="text-blue-400 hover:text-white ml-1 font-bold transition-colors">Login</Link></div>
      </div>
    </div>
  );
}