import { async } from "@firebase/util";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { auth } from "../../firebase/firebase";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      console.error("Erro loggin in:", error.message);
      setError(error.message);
    }
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./finisher-header.es5.min.js";
    script.type = "text/javascript";
    script.onload = () => {
      new FinisherHeader({
        count: 90,
        size: {
          min: 1,
          max: 20,
          pulse: 0,
        },
        speed: {
          x: {
            min: 0,
            max: 0.4,
          },
          y: {
            min: 0,
            max: 0.1,
          },
        },
        colors: {
          background: "#2558a2",
          particles: ["#ffffff", "#87ddfe", "#acaaff", "#1bffc2", "#f88aff"],
        },
        blending: "screen",
        opacity: {
          center: 0,
          edge: 0.4,
        },
        skew: -2,
        shapes: ["c", "s", "t"],
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div className="login">
      <div className="about header finisher-header">
        <h2>Gamified Habit Tracker</h2>
        <p>
          Welcome to our website. It is designed to make self-improvement fun
          and rewarding! We've turned habit tracking into an engaging experience
          where you can earn points, unlock achievements, and stay motivated
          every day. Whether you're trying to exercise more, read daily, or
          develop a new skill, our platform keeps you accountable with a
          game-like approach.
        </p>
      </div>
      <div className="login-cls">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-item">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-item">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
