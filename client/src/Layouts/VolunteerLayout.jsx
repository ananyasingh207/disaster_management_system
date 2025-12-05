import { Outlet } from "react-router-dom";
import VolunteerNavbar from "../components/VolunteerNavbar";

export default function VolunteerLayout() {
  return (
    <div className="theme-volunteer" style={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      {/* Sidebar Container */}
      <div style={{ width: "280px", flexShrink: 0 }}>
        <VolunteerNavbar />
      </div>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        padding: "2rem 3rem", 
        overflowY: "auto", 
        height: "100vh",
        position: "relative"
      }}>
        <Outlet />
      </main>
    </div>
  );
}