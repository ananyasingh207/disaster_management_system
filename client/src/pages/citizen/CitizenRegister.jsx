import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

export default function CitizenRegister() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    otp: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!form.email) return setMsg("Please enter email address first.");
    setMsg("Sending Code...");
    try {
      await api.post("/citizen/otp/send", { email: form.email });
      setOtpSent(true);
      setMsg("✓ OTP Sent");
    } catch {
      setMsg("⚠ Failed to send OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/citizen/auth/register", form);
      setMsg("✓ Success! Redirecting...");
      setTimeout(() => navigate("/citizen/login"), 1500);
    } catch (err) {
      setMsg("⚠ Registration Failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] relative overflow-hidden">

      {/* Soft Red Glow */}
      <div className="absolute w-[500px] h-[500px] bg-red-700/15 rounded-full blur-[150px] -top-24 -left-24 pointer-events-none"></div>

      {/* CARD */}
      <div className="w-full max-w-md p-10 bg-slate-900 border border-white/5 rounded-2xl shadow-xl shadow-black/30 mx-4 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-10">
          
          {/* Top Red Line (global theme) */}
          <div className="w-12 h-1 bg-red-600 mb-5 opacity-80 mx-auto"></div>

          <h1 className="text-3xl font-black text-white mb-1">
            Join the Network
          </h1>
          <p className="text-slate-400 text-sm">
            Citizen Registration
          </p>
        </div>

        {/* STATUS MESSAGE */}
        {msg && (
          <div className="p-3 mb-6 rounded text-center text-sm font-bold 
                          bg-red-500/10 text-red-400 shadow-sm shadow-red-900/10">
            {msg}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* NAME */}
          <input
            name="name"
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 
                       text-white text-sm outline-none 
                       focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />

          {/* PHONE */}
          <input
            name="phone"
            onChange={handleChange}
            required
            placeholder="Phone Number"
            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 
                       text-white text-sm outline-none 
                       focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />

          {/* EMAIL + OTP BUTTON */}
          <div className="flex gap-2">
            <input
              name="email"
              type="email"
              onChange={handleChange}
              required
              placeholder="Email Address"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 
                         text-white text-sm outline-none 
                         focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />

            {!otpSent && (
              <button
                type="button"
                onClick={handleSendOtp}
                className="px-4 bg-red-600 hover:bg-red-500 
                           text-white rounded-lg text-sm font-bold 
                           transition-colors whitespace-nowrap"
              >
                GET OTP
              </button>
            )}
          </div>

          {/* OTP FIELD */}
          {otpSent && (
            <input
              name="otp"
              onChange={handleChange}
              required
              placeholder="Enter 6-digit OTP"
              className="w-full bg-slate-950 border border-red-500/40 rounded-lg px-4 py-3 
                         text-white text-sm outline-none 
                         focus:border-red-500 transition-all"
            />
          )}

          {/* PASSWORD */}
          <input
            name="password"
            type="password"
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 
                       text-white text-sm outline-none 
                       focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={!otpSent}
            className={`w-full py-3.5 rounded-lg font-bold text-sm shadow-lg transition-all 
              ${
                otpSent
                  ? "bg-red-600 hover:bg-red-500 text-white"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
          >
            {otpSent ? "CREATE ACCOUNT" : "VERIFY EMAIL FIRST"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Already registered?
          <Link
            to="/citizen/login"
            className="text-red-400 hover:text-white ml-1 font-bold transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
