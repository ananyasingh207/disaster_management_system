import { Link } from "react-router-dom";
import "../github-css/citizen-navbar.css";

export default function CitizenNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/citizen/incidents">
          Disaster Portal
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/citizen/report">Report Incident</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/citizen/incidents">My Reports</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/citizen/alerts">Alerts</Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
