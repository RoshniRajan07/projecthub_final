import React, { useState, useEffect, useCallback } from "react";
import "./FacultyDashboard.css";
import {
  LayoutDashboard, BookOpen, BadgeCheck, Bell, LogOut, User,
  FileText, Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8081";

const FacultyDashboard = () => {
  const navigate = useNavigate();

  const [token] = useState(() => localStorage.getItem("token"));
  const [userId] = useState(() => localStorage.getItem("userId"));
  const [fullName] = useState(() => localStorage.getItem("fullName") || "Faculty");

  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [projRes, certRes] = await Promise.all([
        fetch(`${API}/projects/mongo/faculty/${userId}`, { headers }),
        fetch(`${API}/certificates/faculty/${userId}`, { headers })
      ]);
      if (projRes.ok) setProjects(await projRes.json());
      if (certRes.ok) setCertificates(await certRes.json());
    } catch (error) { console.error("Faculty dashboard fetch error:", error); }
    setLoading(false);
  }, [token, userId]);

  useEffect(() => {
    if (!token || !userId) { navigate("/"); return; }
    fetchData();
  }, [token, userId, navigate, fetchData]);

  // Counts
  const assignedProjects = projects.length;
  const pendingProjects = projects.filter(p => p.status?.toLowerCase() === "pending").length;
  const approvedProjects = projects.filter(p => p.status?.toLowerCase() === "approved").length;
  const pendingCertificates = certificates.filter(c => c.status?.toLowerCase() === "pending").length;
  const approvalRate = assignedProjects > 0 ? Math.round((approvedProjects / assignedProjects) * 100) : 0;

  // Reviewed This Week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const reviewedThisWeek = projects.filter(p => {
    const s = p.status?.toLowerCase();
    if (s !== "approved" && s !== "rejected") return false;
    if (p.reviewedDate) return new Date(p.reviewedDate) >= oneWeekAgo;
    return true;
  }).length;

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  if (loading) {
    return <div className="faculty-page"><p style={{ padding: "2rem" }}>Loading...</p></div>;
  }

  return (
    <div className="faculty-page">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="logo">
            <div className="logo-box">🎓</div>
            <h2>ProjectHub<span>+</span></h2>
          </div>

          <div className="menu">
            <div className="menu-item active"><LayoutDashboard size={20} /><span>Dashboard</span></div>
            <div className="menu-item" onClick={() => navigate("/review-projects")}><BookOpen size={20} /><span>Review Projects</span></div>
            <div className="menu-item" onClick={() => navigate("/verify-certificates")}><BadgeCheck size={20} /><span>Verify Certificates</span></div>
            <div className="menu-item" onClick={() => navigate("/faculty-profile")}><User size={20} /><span>Profile</span></div>
            <div className="menu-item" onClick={() => navigate("/faculty-notifications")}><Bell size={20} /><span>Notifications</span></div>
          </div>
        </div>

        <div className="user-section">
          <div className="user">
            <div className="avatar">{fullName.charAt(0)}</div>
            <div className="user-text"><h4>{fullName}</h4><p>Faculty</p></div>
          </div>
          <div className="logout" onClick={handleLogout}><LogOut size={18} /><span>Sign Out</span></div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="faculty-main">

        {/* HEADER */}
        <div className="faculty-header">
          <div>
            <h1>Faculty Dashboard</h1>
            <p>Manage student submissions and reviews.</p>
          </div>
        </div>

        {/* PENDING PROJECT REVIEWS */}
        <div className="review-section">
          <div className="review-header" onClick={() => navigate("/review-projects")}>
            <h3>Pending Project Reviews</h3>
            <span>Review All</span>
          </div>

          {projects.filter(p => p.status?.toLowerCase() === "pending").length === 0 && (
            <p style={{ padding: "1rem", color: "#888" }}>No pending reviews.</p>
          )}

          {projects.filter(p => p.status?.toLowerCase() === "pending").slice(0, 5).map((item) => (
            <div className="review-item" key={item.id}>
              <div className="left-review">
                <div className="file-box"><FileText size={22} /></div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.studentName} · {item.technology}</p>
                </div>
              </div>
              <div className="right-review">
                <div className="pending-badge">pending</div>
                <span>{item.submittedDate ? new Date(item.submittedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM GRID */}
        <div className="bottom-grid">

          {/* CERTIFICATES */}
          <div className="small-card">
            <div className="small-card-header" onClick={() => navigate("/verify-certificates")}>
              <h3>Certificates to Verify</h3>
              <span>View All</span>
            </div>

            {certificates.filter(c => c.status?.toLowerCase() === "pending").length === 0 && (
              <p style={{ padding: "0.5rem", color: "#888" }}>No pending certificates.</p>
            )}

            {certificates.filter(c => c.status?.toLowerCase() === "pending").slice(0, 3).map((item) => (
              <div className="certificate-item" key={item.id}>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.studentName} · {item.organization}</p>
                </div>
                <div className="pending-badge">pending</div>
              </div>
            ))}
          </div>

          {/* REVIEW STATS */}
          <div className="small-card">
            <div className="small-card-header">
              <h3><Activity size={20} className="gold" /> Review Statistics</h3>
            </div>
            <div className="stats-list">
              <div className="stats-row"><span>Reviewed This Week</span><h4>{reviewedThisWeek}</h4></div>
              <div className="stats-row"><span>Pending Reviews</span><h4>{pendingProjects}</h4></div>
              <div className="stats-row"><span>Approval Rate</span><h4>{approvalRate}%</h4></div>
              <div className="stats-row"><span>Certificates Pending</span><h4>{pendingCertificates}</h4></div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;