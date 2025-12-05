import { useState } from "react";
import { Link } from "react-router-dom";
import "../github-css/home.css";

function Home() {

  const [open, setOpen] = useState(false);

  return (
    <div className="home-wrapper">

      {/* ALERT BANNER */}
      <div className="alert-banner">
        🚨 Emergency Helpline: <strong>108</strong> | NDMA: <strong>011-1078</strong>
      </div>

      <nav className="top-nav">
  <div className="dropdown-container">
    <button className="menu-btn" onClick={() => setOpen(!open)}>
      Login / Register
    </button>

    {open && (
      <div className="dropdown-box">
        <div className="drop-section-title">Citizen</div>
        <Link to="/citizen/login">Citizen Login</Link>
        <Link to="/citizen/register">Citizen Register</Link>

        <div className="drop-section-title">Volunteer</div>
        <Link to="/volunteer/login">Volunteer Login</Link>

        <div className="drop-section-title admin-title">Admin</div>
        <Link to="/admin/login" className="admin-link">Admin Login</Link>
      </div>
    )}
  </div>
</nav>


      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-left">
          <h1 className="hero-title">
            Stay Alert. <span>Stay Prepared.</span>
          </h1>

          <p className="hero-desc">
            A modern disaster reporting & awareness platform designed
            to keep you informed, safe, and ready for emergencies.
            Act fast — your timely report can save lives.
          </p>

          </div>

        <div className="hero-right">
          <img
            src="https://illustrations.popsy.co/amber/emergency-team.svg"
            alt="hero"
            className="hero-img"
          />
        </div>

      </section>

      {/* STATS SECTION */}
      <section className="stats">
        <div className="stat-box">
          <h2>🌍 250M+</h2>
          <p>People affected yearly</p>
        </div>
        <div className="stat-box">
          <h2>🚑 40%</h2>
          <p>Lives saved by early reporting</p>
        </div>
        <div className="stat-box">
          <h2>⏱️ 15s</h2>
          <p>Avg alert response time</p>
        </div>
        <div className="stat-box">
          <h2>🤝 50,000+</h2>
          <p>Active volunteers</p>
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="info">

        <h2 className="info-title">Know the Threats. Be Prepared.</h2>

        <div className="info-grid">

          <div className="info-card">
            <img src="https://cdn-icons-png.flaticon.com/512/4832/4832940.png" alt="fire" />
            <h3>Fire Accidents</h3>
            <p>Instant reporting leads to early evacuation and fast fire response.</p>
          </div>

          <div className="info-card">
            <img src="https://cdn-icons-png.flaticon.com/512/1146/1146869.png" alt="flood" />
            <h3>Flood Awareness</h3>
            <p>Floods affect millions every year. Stay updated and stay safe.</p>
          </div>

          <div className="info-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2913/2913465.png" alt="earthquake" />
            <h3>Earthquake Safety</h3>
            <p>Seconds matter — knowing what to do saves lives.</p>
          </div>

          <div className="info-card">
            <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="accident" />
            <h3>Road Accidents</h3>
            <p>Fast reporting increases survival chances by up to 35%.</p>
          </div>

        </div>
      </section>

      {/* QUOTE */}
      <section className="quote">
        <p>“Preparedness is the calm before the storm.”</p>
        <span>— National Disaster Center</span>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        © 2025 DisasterSafe | Safety Through Awareness & Quick Reporting
      </footer>

    </div>
  );
}

export default Home;
