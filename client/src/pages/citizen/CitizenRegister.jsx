import { useState } from "react";
import api from "../../api";
import "../../github-css/citizen-login.css";

export default function CitizenRegister() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [msg, setMsg] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const sendOtp = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!form.email) {
      setMsg("Enter email first.");
      return;
    }

    try {
      await api.post("/citizen/otp/send", { email: form.email });
      setOtpSent(true);
      setMsg("OTP sent to your email.");
    } catch {
      setMsg("Failed to send OTP.");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!otp) {
      setMsg("Enter the OTP.");
      return;
    }

    try {
      await api.post("/citizen/otp/verify", {
        email: form.email,
        code: otp,
      });
      setOtpVerified(true);
      setMsg("OTP verified. You can register now.");
    } catch (err) {
      setMsg("Invalid or expired OTP.");
    }
  };

  const register = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!otpVerified) {
      setMsg("Please verify OTP before registering.");
      return;
    }

    try {
      await api.post("/citizen/auth/register", form);
      window.location.href = "/citizen/login";
    } catch {
      setMsg("Error creating account.");
    }
  };

  return (
    <div className="citizen-login-box">
      <h3 className="text-center mb-3">Citizen Registration</h3>

      {msg && <div className="alert alert-info">{msg}</div>}

      {/* Main form */}
      <form>
        <input
          className="form-control mb-2"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
        />

        <input
          className="form-control mb-2"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={onChange}
        />

        <input
          className="form-control mb-2"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
        />

        <input
          className="form-control mb-2"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        />

        {/* OTP section */}
        {!otpSent && (
          <button className="btn btn-danger w-100 mb-2" onClick={sendOtp}>
            Send OTP
          </button>
        )}

        {otpSent && !otpVerified && (
          <>
            <input
              className="form-control mb-2"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="btn btn-warning w-100 mb-2" onClick={verifyOtp}>
              Verify OTP
            </button>
          </>
        )}

        <button
          className="btn btn-success w-100"
          onClick={register}
          disabled={!otpVerified}
        >
          Register
        </button>
      </form>
    </div>
  );
}
