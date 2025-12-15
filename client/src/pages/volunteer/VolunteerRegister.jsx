import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

export default function VolunteerRegister() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    skills: "",
    location: "",
    otp: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!form.email) return setMsg("Enter email first.");
    setMsg("Sending verification code...");
    try {
      await api.post("/volunteer/auth/send-otp", { email: form.email });
      setOtpSent(true);
      setMsg("✓ OTP Sent Successfully");
    } catch {
      setMsg("⚠ Failed to send OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/volunteer/auth/register", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim())
      });
      setMsg("✓ Registration Successful. Awaiting Approval...");
      setTimeout(() => navigate("/volunteer/login"), 2000);
    } catch {
      setMsg("⚠ Registration Error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] relative overflow-hidden">

      {/* Soft Red Glow */}
      <div className="absolute w-[550px] h-[550px] bg-red-700/15 rounded-full blur-[150px] -top-24 -left-24 pointer-events-none"></div>

      {/* FORM CARD */}
      <div className="w-full max-w-2xl p-10 bg-slate-900 border border-white/5 rounded-2xl 
                      shadow-xl shadow-black/30 relative z-10 mx-4">

        {/* HEADER */}
        <div className="mb-10">

          {/* Top Red Line */}
          <div className="w-12 h-1 bg-red-600 mb-5 opacity-80"></div>

          <h1 className="text-2xl font-black text-white uppercase tracking-wide">
            Volunteer Registration
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Disaster Response Force – Onboarding
          </p>
        </div>

        {/* STATUS MESSAGE */}
        {msg && (
          <div className="p-3 mb-6 bg-red-500/10 text-red-400 border border-red-500/20 
                          rounded text-xs font-bold shadow-sm shadow-red-900/10">
            {msg}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Identity Section */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Identity
            </h4>

            <input
              name="name"
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 
                         text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />

            <input
              name="phone"
              onChange={handleChange}
              required
              placeholder="Contact Number"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 
                         text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />

            <input
              name="password"
              type="password"
              onChange={handleChange}
              required
              placeholder="Set Password"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 
                         text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Logistics Section */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Logistics & Verification
            </h4>

            <input
              name="location"
              onChange={handleChange}
              required
              placeholder="City / Region"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 
                         text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />

            <input
              name="skills"
              onChange={handleChange}
              required
              placeholder="Skills (Medic, Driver, etc.)"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 
                         text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />

            {/* Email + OTP */}
            <div className="flex gap-2">
              <input
                name="email"
                type="email"
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 
                           text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
              />

              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-4 bg-red-600 hover:bg-red-500 text-white 
                             rounded-lg text-xs font-bold transition-all"
                >
                  GET OTP
                </button>
              )}
            </div>

            {/* OTP INPUT */}
            {otpSent && (
              <input
                name="otp"
                onChange={handleChange}
                required
                placeholder="Enter OTP Code"
                className="w-full bg-slate-950 border border-red-500/50 rounded-lg px-3 py-2.5 
                           text-white text-sm focus:border-red-500 outline-none"
              />
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!otpSent}
            className={`md:col-span-2 mt-4 py-3.5 rounded-lg font-bold text-sm tracking-widest uppercase 
                        transition-all shadow-lg ${otpSent
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
              }`}
          >
            {otpSent ? "Submit Registration" : "Verify Email First"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Already registered?
          <Link
            to="/volunteer/login"
            className="text-red-400 hover:text-white ml-1 font-bold transition-colors"
          >
            Volunteer Login →
          </Link>
        </div>

      </div>
    </div>
  );
}
