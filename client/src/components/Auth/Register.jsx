import React, { useState, useContext } from "react";
import axios from "axios";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Update form state on input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit registration data, update context, and redirect on success
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", formData);
      register(res.data.token, res.data.user);
      navigate("/"); // Redirect to homepage
    } catch (err) {
      alert("Registration failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="split-auth-page">
      <div className="auth-left">
        <h1>
          Welcome to <span className="scroll-name">The Daily Scroll</span>
        </h1>
        <p>Join to personalize your news experience and never miss a headline.</p>
      </div>
      <div className="auth-right">
        <div className="auth-container">
          <h2 className="auth-title">Sign Up</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              name="username"
              className="auth-input"
              placeholder="Username"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              className="auth-input"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button type="submit" className="auth-button">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;