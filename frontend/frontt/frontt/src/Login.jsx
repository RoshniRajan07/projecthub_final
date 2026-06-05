import React, { useEffect, useState } from "react";
import "./Login.css";

import {
  GraduationCap,
  BookOpen,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setEmail("");
    setPassword("");
    const clearSavedValues = setTimeout(() => {
      setEmail("");
      setPassword("");
    }, 100);

    return () => clearTimeout(clearSavedValues);
  }, []);

  /* LOGIN */
  const handleLogin = async () => {

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Store auth data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("role", data.role);
      localStorage.setItem("fullName", data.fullName);

      // Navigate based on role from backend
      const userRole = data.role.toLowerCase();
      setShowSuccess(true);

      setTimeout(() => {
        if (userRole === "student") {
          navigate("/dashboard");
        } else if (userRole === "faculty") {
          navigate("/faculty-dashboard");
        } else if (userRole === "admin") {
          navigate("/admin-dashboard");
        }
      }, 900);

    } catch (err) {
      setError("Server not reachable. Please try again.");
    }

    setLoading(false);
  };

  return (

    <div className="login-page">
      {showSuccess && (
        <div className="login-success-popup" role="status">
          Logged in successfully
        </div>
      )}

      {/* LEFT SIDE */}
      <div className="login-left">

        <div className="logo" onClick={() => navigate("/")}>
          <div className="logo-box">🎓</div>
          <h1>ProjectHub+</h1>
        </div>

        <p className="left-description">
          A unified portal for student project submissions,
          certificate verification, and academic portfolio
          management.
        </p>

        <ul className="feature-list">
          <li>Submit & track project submissions</li>
          <li>Certificate verification workflow</li>
          <li>Professional profile integration</li>
          <li>Faculty review & grading system</li>
        </ul>

      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">

        <h2>Welcome back</h2>
        <p className="subtitle">Sign in to your account to continue</p>

        {/* ROLES */}
        <div className="roles">

          <div
            className={role === "student" ? "role active" : "role"}
            onClick={() => setRole("student")}
          >
            <GraduationCap size={22} />
            <span>Student</span>
          </div>

          <div
            className={role === "faculty" ? "role active" : "role"}
            onClick={() => setRole("faculty")}
          >
            <BookOpen size={22} />
            <span>Faculty</span>
          </div>

          <div
            className={role === "admin" ? "role active" : "role"}
            onClick={() => setRole("admin")}
          >
            <Shield size={22} />
            <span>Admin</span>
          </div>

        </div>

        {/* FORM */}
        <form className="form" autoComplete="off" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>

          <label>Email</label>
          <input
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="new-password"
            name="projecthub-login-email"
            readOnly
            onFocus={(e) => { e.currentTarget.readOnly = false; }}
          />

          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              name="projecthub-login-passcode"
              readOnly
              onFocus={(e) => { e.currentTarget.readOnly = false; }}
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* ERROR MESSAGE */}
          {error && <p style={{ color: "red", fontSize: "13px", marginTop: "8px" }}>{error}</p>}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : `Sign In as ${role}`}
          </button>

          <p className="demo">
            Use your registered email and password to sign in.
          </p>

        </form>

      </div>

    </div>
  );
}
