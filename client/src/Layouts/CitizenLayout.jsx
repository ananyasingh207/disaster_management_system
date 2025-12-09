import { Outlet } from "react-router-dom";
// 👇 You were missing this import line!
import CitizenNavbar from "../components/CitizenNavbar"; 
import Footer from "../components/Footer";

export default function CitizenLayout() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      {/* Navbar at the top */}
      <CitizenNavbar />
      
      {/* Main Content Area */}
      <main className="container mx-auto p-6 flex-1">
        <Outlet />
      </main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}