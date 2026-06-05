import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./VerifyCertificates.css";
import {
  LayoutDashboard, BookOpen, ShieldCheck, Bell, LogOut, User,
  Award, Search, ChevronDown, Eye, Download, X,
  CheckCircle2, XCircle, ChevronLeft, ChevronRight
} from "lucide-react";

const API = "http://localhost:8081";
const ITEMS_PER_PAGE = 5;

export default function VerifyCertificates() {
  const navigate = useNavigate();

  const [token] = useState(() => localStorage.getItem("token"));
  const [userId] = useState(() => localStorage.getItem("userId"));
  const [fullName] = useState(() => localStorage.getItem("fullName") || "Faculty");

  const statusDropdownRef = useRef(null);
  const deptDropdownRef = useRef(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [department, setDepartment] = useState("All Departments");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [certificates, setCertificates] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [reviewing, setReviewing] = useState(false);

  const DEPARTMENTS = ["All Departments", "CSE", "IT", "ECE", "AIDS", "MECH"];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) setShowStatusDropdown(false);
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(e.target)) setShowDeptDropdown(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => { setCurrentPage(1); }, [search, status, department]);

  const fetchCertificates = useCallback(async () => {
    try {
      const res = await fetch(`${API}/certificates/faculty/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCertificates(await res.json());
    } catch (error) { console.error("Fetch certificates error:", error); }
  }, [token, userId]);

  useEffect(() => {
    if (!token || !userId) { navigate("/"); return; }
    fetchCertificates();
  }, [token, userId, navigate, fetchCertificates]);

  // Filter
  const filteredCertificates = certificates.filter((item) => {
    const matchSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.studentName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "All Status" ? true : item.status?.toLowerCase() === status.toLowerCase();
    const matchDept = department === "All Departments" ? true : item.department === department;
    return matchSearch && matchStatus && matchDept;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCertificates.length / ITEMS_PER_PAGE);
  const paginatedCertificates = filteredCertificates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDownload = async (fileURL) => {
    if (!fileURL) { alert("File not found"); return; }
    try {
      const res = await fetch(fileURL);
      if (!res.ok) { alert("Download failed: file not found"); return; }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileURL.split("/").pop() || "certificate";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed");
    }
  };

  const handleVerify = async (newStatus) => {
    if (!remarks && newStatus === "REJECTED") { alert("Please provide remarks for rejection"); return; }
    setReviewing(true);
    try {
      const params = new URLSearchParams({ status: newStatus, remarks: remarks || "Approved" });
      const res = await fetch(`${API}/certificates/${selectedCertificate.id}/verify?${params}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSelectedCertificate(null);
        setRemarks("");
        fetchCertificates();
      } else {
        alert("Verification failed");
      }
    } catch (error) { console.error("Verify error:", error); }
    setReviewing(false);
  };

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <div className="verify-page">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="logo">
            <div className="logo-box">🎓</div>
            <h2>ProjectHub+</h2>
          </div>
          <div className="menu">
            <div className="menu-item" onClick={() => navigate("/faculty-dashboard")}><LayoutDashboard size={20} /> Dashboard</div>
            <div className="menu-item" onClick={() => navigate("/review-projects")}><BookOpen size={20} /> Review Projects</div>
            <div className="menu-item active"><ShieldCheck size={20} /> Verify Certificates</div>
            <div className="menu-item" onClick={() => navigate("/faculty-profile")}><User size={20} /> Profile</div>
            <div className="menu-item" onClick={() => navigate("/faculty-notifications")}><Bell size={20} /> Notifications</div>
          </div>
        </div>
        <div className="user-section">
          <div className="user">
            <div className="avatar">{fullName.charAt(0)}</div>
            <div className="user-text"><h4>{fullName}</h4><p>Faculty</p></div>
          </div>
          <div className="logout" onClick={handleLogout}><LogOut size={18} /> Sign Out</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="verify-main">
        <div className="verify-header">
          <div className="verify-left">
            <h1>Verify Certificates</h1>
            <p>Review and approve student certificates.</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters">
          <div className="search-box">
            <Search size={20} color="#9ca3af" />
            <input type="text" placeholder="Search by student or title..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="dropdown-wrapper" ref={deptDropdownRef}>
            <div className="filter-dropdown" onClick={() => setShowDeptDropdown(!showDeptDropdown)}>
              {department}<ChevronDown size={20} />
            </div>
            {showDeptDropdown && (
              <div className="dropdown-menu">
                {DEPARTMENTS.map((item) => (
                  <div key={item} className={department === item ? "dropdown-item active" : "dropdown-item"} onClick={() => { setDepartment(item); setShowDeptDropdown(false); }}>{item}</div>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown-wrapper" ref={statusDropdownRef}>
            <div className="filter-dropdown" onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
              {status}<ChevronDown size={20} />
            </div>
            {showStatusDropdown && (
              <div className="dropdown-menu">
                {["All Status", "Pending", "Approved", "Rejected", "Resubmitted"].map((item) => (
                  <div key={item} className={status === item ? "dropdown-item active" : "dropdown-item"} onClick={() => { setStatus(item); setShowStatusDropdown(false); }}>{item}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RESULTS */}
        <div className="results-info">
          Showing {paginatedCertificates.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredCertificates.length)} of {filteredCertificates.length} certificates
        </div>

        {/* LIST */}
        <div className="certificate-list">
          {paginatedCertificates.length === 0 ? (
            <div className="empty-state"><Award size={48} color="#d1d5db" /><p>No certificates found.</p></div>
          ) : (
            paginatedCertificates.map((item) => (
              <div className="certificate-card" key={item.id}>
                <div className="certificate-left">
                  <div className="certificate-icon"><Award size={28} /></div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.studentName} · {item.organization} · {item.category}</p>
                  </div>
                </div>
                <div className="certificate-right">
                  {item.department && <span className="dept-tag">{item.department}</span>}
                  <div className={item.status?.toLowerCase() === "approved" ? "approved-badge" : item.status?.toLowerCase() === "rejected" ? "rejected-badge" : item.status?.toLowerCase() === "resubmitted" ? "resubmit-badge" : "pending-badge"}>
                    {item.status?.toLowerCase() === "resubmitted" ? "resubmitted" : item.status?.toLowerCase()}
                  </div>
                  <button className="review-btn" onClick={() => { setSelectedCertificate(item); setRemarks(""); }}>
                    <Eye size={18} /> Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              <ChevronLeft size={18} /> Previous
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} className={currentPage === page ? "page-number active" : "page-number"} onClick={() => setCurrentPage(page)}>{page}</button>
              ))}
            </div>
            <button className="page-btn" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
              Next <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>

      {/* REVIEW MODAL */}
      {selectedCertificate && (
        <div className="review-modal-overlay">
          <div className="certificate-review-modal">
            <button className="close-btn" onClick={() => setSelectedCertificate(null)}><X size={24} /></button>
            <h2>Review: {selectedCertificate.title}</h2>

            <div className="modal-grid">
              <div>
                <p><strong>Student:</strong> {selectedCertificate.studentName}</p>
                <p><strong>Category:</strong> {selectedCertificate.category}</p>
                <p><strong>Issue Date:</strong> {selectedCertificate.issueDate || "-"}</p>
                <p><strong>Submitted:</strong> {(selectedCertificate.submittedDate || selectedCertificate.uploadDate) ? new Date(selectedCertificate.submittedDate || selectedCertificate.uploadDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}</p>
              </div>
              <div>
                <p><strong>Organization:</strong> {selectedCertificate.organization}</p>
                <p><strong>Department:</strong> {selectedCertificate.department || "-"}</p>
                <p><strong>Status:</strong> {selectedCertificate.status}</p>
              </div>
            </div>

            {selectedCertificate.fileURL && (
              <button className="download-file-btn" onClick={() => handleDownload(selectedCertificate.fileURL)}>
                <Download size={20} /> Download Certificate File
              </button>
            )}

            <div className="remarks-box">
              <label>Remarks</label>
              <textarea placeholder="Add verification remarks..." value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>

            <div className="modal-actions">
              <button className="approve-btn" onClick={() => handleVerify("APPROVED")} disabled={reviewing}>
                <CheckCircle2 size={22} /> {reviewing ? "..." : "Approve"}
              </button>
              <button className="reject-btn" onClick={() => handleVerify("REJECTED")} disabled={reviewing}>
                <XCircle size={22} /> {reviewing ? "..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}