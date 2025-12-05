import { NavLink } from "react-router-dom";

export default function AdminNavbar() {
  // Helper to apply CSS classes based on active state
  const getLinkClass = ({ isActive }) => 
    isActive ? "nav-link active" : "nav-link";

  return (
    <aside style={{ 
      height: "100%",
      width: "100%",
      borderRight: "1px solid rgba(245, 158, 11, 0.2)", 
      padding: "2rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      background: "rgba(20, 10, 5, 0.8)", // Dark/Warm Admin Background
      backdropFilter: "blur(10px)"
    }}>
      <div style={{ marginBottom: "3rem", paddingLeft: "0.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", color: "var(--primary)", margin: 0 }}>
          COMMAND<span style={{ color: "#fff" }}>.CTR</span>
        </h2>
        <p style={{ fontSize: "0.75rem", margin: 0, opacity: 0.6, color: "var(--primary)" }}>
          Admin Overwatch
        </p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <NavLink to="/admin" end className={getLinkClass}>
          Overwatch Dashboard
        </NavLink>
        <NavLink to="/admin/teams" className={getLinkClass}>
          Team Assignment
        </NavLink>
        <NavLink to="/admin/broadcast" className={getLinkClass}>
          Broadcast Alerts
        </NavLink>
      </nav>

      <div style={{ marginTop: "auto", borderTop: "1px solid rgba(245, 158, 11, 0.2)", padding: "1rem" }}>
         <p style={{ fontSize: "0.7rem", color: "#666" }}>SYS_VER: 2.4.1-ALPHA</p>
      </div>
    </aside>
  );
}