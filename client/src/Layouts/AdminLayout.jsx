import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="theme-admin" style={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      {/* Sidebar Container */}
      <div style={{ width: "280px", flexShrink: 0 }}>
        <AdminNavbar />
      </div>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        padding: "2rem 3rem", 
        overflowY: "auto", 
        height: "100vh",
        background: "radial-gradient(circle at 90% 10%, rgba(245, 158, 11, 0.05), transparent 40%)"
      }}>
        <Outlet />
      </main>
    </div>
  );
}