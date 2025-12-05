import { Outlet } from "react-router-dom";
import "../github-css/bootstrap.min.css";
import "../github-css/citizen-navbar.css";
import CitizenNavbar from "../components/CitizenNavbar";

export default function CitizenLayout() {
  return (
    <div className="citizen-bg">
      <CitizenNavbar />
      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
}
