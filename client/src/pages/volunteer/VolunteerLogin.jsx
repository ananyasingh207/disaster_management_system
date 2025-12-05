import { useState } from "react";
import api from "../../api";

export default function VolunteerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/volunteer/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/volunteer";
    } catch {
      setMsg("Invalid email or password");
    }
  };

  return (
    <div className="login-box">
      <h2>Volunteer Login</h2>

      {msg && <p className="error">{msg}</p>}

      <form onSubmit={submit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Login</button>
      </form>
    </div>
  );
}
