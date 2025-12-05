import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import VolunteerLayout from "./Layouts/VolunteerLayout";
import AdminLayout from "./Layouts/AdminLayout";
import CitizenLayout from "./Layouts/CitizenLayout";

// Volunteer pages
import Dashboard from "./pages/volunteer/Dashboard";
import MissionsList from "./pages/volunteer/MissionsList";
import MissionDetails from "./pages/volunteer/MissionDetails";
import ReportIncident from "./pages/volunteer/ReportIncident";
import Profile from "./pages/volunteer/Profile";
import VolunteerLogin from "./pages/volunteer/VolunteerLogin";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeamAssignment from "./pages/admin/TeamAssignment";
import BroadcastCenter from "./pages/admin/BroadcastCenter";
import IncidentDetails from "./pages/admin/IncidentDetails";
import AdminLogin from "./pages/admin/AdminLogin";

// Citizen pages
import CitizenLogin from "./pages/citizen/CitizenLogin";
import CitizenRegister from "./pages/citizen/CitizenRegister";
import CitizenReport from "./pages/citizen/CitizenReport";
import CitizenIncidents from "./pages/citizen/CitizenIncidents";
import CitizenAlerts from "./pages/citizen/CitizenAlert";

import Home from "./pages/Home";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME PAGE */}
        <Route path="/" element={<Home />} />

        {/* 🔹 Independent Auth Routes */}
        <Route path="/citizen/login" element={<CitizenLogin />} />
        <Route path="/citizen/register" element={<CitizenRegister />} />

        <Route path="/volunteer/login" element={<VolunteerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 🔹 Citizen Dashboard Area */}
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route path="report" element={<CitizenReport />} />
          <Route path="incidents" element={<CitizenIncidents />} />
          <Route path="alerts" element={<CitizenAlerts />} />
        </Route>

        {/* 🔹 Volunteer Dashboard Area */}
        <Route path="/volunteer" element={<VolunteerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="missions" element={<MissionsList />} />
          <Route path="missions/:id" element={<MissionDetails />} />
          <Route path="report" element={<ReportIncident />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 🔹 Admin Dashboard Area */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="teams" element={<TeamAssignment />} />
          <Route path="broadcast" element={<BroadcastCenter />} />
          <Route path="incidents/:id" element={<IncidentDetails />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
