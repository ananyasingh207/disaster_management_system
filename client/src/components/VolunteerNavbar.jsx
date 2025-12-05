import { NavLink } from "react-router-dom";

export default function VolunteerNavbar() {
  // Helper to apply CSS classes based on active state
  const getLinkClass = ({ isActive }) => 
    isActive ? "nav-link active" : "nav-link";

  return (
    <aside style={{ 
      height: "100%",
      width: "100%",
      borderRight: "1px solid var(--glass-border)", 
      padding: "2rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      background: "rgba(15, 23, 42, 0.4)", // Dark Blue/Slate background
      backdropFilter: "blur(10px)"
    }}>
      {/* Header / Logo */}
      <div style={{ marginBottom: "3rem", paddingLeft: "0.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", color: "var(--primary)", margin: 0 }}>
          VOLUNTEER<span style={{ color: "#fff" }}>.OS</span>
        </h2>
        <p style={{ fontSize: "0.75rem", margin: 0, opacity: 0.6 }}>Disaster Response Unit</p>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {/* 'end' prop ensures Dashboard isn't active for every sub-route */}
        <NavLink to="/" end className={getLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/missions" className={getLinkClass}>
          Missions
        </NavLink>
        <NavLink to="/report" className={getLinkClass}>
          Report Incident
        </NavLink>
        <NavLink to="/profile" className={getLinkClass}>
          Profile
        </NavLink>
      </nav>

      {/* Footer / Status Indicator */}
      <div style={{ marginTop: "auto", padding: "1rem", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)" }}>
        <p style={{ fontSize: "0.75rem", margin: 0, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)" }}>Connection</p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--success)", fontWeight: "600", marginTop: "4px" }}>
          <span style={{ width: "8px", height: "8px", background: "var(--success)", borderRadius: "50%", boxShadow: "0 0 10px var(--success)" }}></span>
          SECURE_LINK
        </div>
      </div>
    </aside>
  );
}