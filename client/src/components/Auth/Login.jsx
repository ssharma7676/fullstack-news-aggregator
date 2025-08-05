import React, { useState, useContext } from "react";
import axios from "axios";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Update form data state on input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit login credentials, update context and navigate on success
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", formData);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      alert("Login failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="split-auth-page">
      <div className="auth-left">
        <h1>Welcome Back</h1>
        <p>Catch up on what the scroll has gathered.</p>
      </div>
      <div className="auth-right">
        <div className="auth-container">
          <h2 className="auth-title">Login</h2>
          <form onSubmit={handleSubmit} className="auth-form">
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
            <button type="submit" className="auth-button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;