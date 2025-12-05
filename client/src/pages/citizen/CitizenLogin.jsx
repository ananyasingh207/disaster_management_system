import { useState } from "react";
import api from "../../api";
import "../../github-css/citizen-login.css";

export default function CitizenLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/citizen/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/citizen/incidents";
    } catch {
      setMsg("Invalid email or password");
    }
  };

  return (
    <div className="citizen-login-box">
      <h2 className="text-center mb-3">Citizen Login</h2>

      {msg && <div className="alert alert-danger">{msg}</div>}

      <form onSubmit={submit}>
        <input
          className="form-control mb-2"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-danger w-100">Login</button>
      </form>
    </div>
  );
}
