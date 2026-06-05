import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./Home";
import Login from "./Login";

import Dashboard from "./Dashboard";
import SubmitProject from "./SubmitProject";
import Certificates from "./Certificates";
import Profile from "./Profile";
import Notifications from "./Notifications";

import FacultyDashboard from "./FacultyDashboard";
import ReviewProjects from "./ReviewProjects";
import VerifyCertificates from "./VerifyCertificates";
import FacultyNotifications from "./FacultyNotifications";

import AdminDashboard from "./AdminDashboard";
import ManageUsers from "./ManageUsers";
import AdminNotifications
from "./AdminNotifications";
import AdminSettings from "./AdminSettings";
import ViewSubmissions from "./ViewSubmissions";
function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* STUDENT */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/submit-project"
          element={<SubmitProject />}
        />

        <Route
          path="/certificates"
          element={<Certificates />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        {/* FACULTY */}

        <Route
          path="/faculty-dashboard"
          element={<FacultyDashboard />}
        />

        <Route
          path="/review-projects"
          element={<ReviewProjects />}
        />

        <Route
          path="/verify-certificates"
          element={<VerifyCertificates />}
        />

        <Route
          path="/faculty-profile"
          element={<Profile role="FACULTY" />}
        />

        <Route
          path="/faculty-notifications"
          element={<FacultyNotifications />}
        />

        {/* ADMIN */}

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/manage-users"
          element={<ManageUsers />}
        />
        <Route
  path="/admin-notifications"
  element={<AdminNotifications />}
/>
<Route
          path="/admin-settings"
          element={<AdminSettings />}
        />

        <Route
          path="/view-submissions"
          element={<ViewSubmissions />}
        />

        <Route
          path="/admin-profile"
          element={<Profile role="ADMIN" />}
        />
      </Routes>

    </BrowserRouter>

  );

}

export default App;