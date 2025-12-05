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
      setMsg("Invalid admin credentials");
    }
  };

  return (
    <div className="login-box">
      <h2>Admin Login</h2>

      {msg && <p className="error">{msg}</p>}

      <form onSubmit={submit}>
        <input
          placeholder="Admin Email"
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
