import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/Home";
import List from "./components/List/List";
import { auth } from "./firebase/firebase";
import "./App.css";
import UpdateProfilePic from "./components/UpdateProfilePic";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const handleImageSelect = (imageUrl) => {
    setSelectedProfileImage(imageUrl);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  });
  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <Router>
      <div className="">
        <nav>
          <ul>
            {!isAuthenticated && (
              <>
                {/* <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li> */}
              </>
            )}
            {/* {isAuthenticated && (
              <li>
                <Link to="/home">Home</Link>
              </li>
            )} */}
          </ul>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/register"
            element={<Register onImageSelect={handleImageSelect} />}
          />
          <Route path="/list" element={<List />} />
          <Route path="/updateProfilePic" element={<UpdateProfilePic />} />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
          />
        </Routes>
      </div>
    </Router>
  );
}

/* HTML: <div class="loader"></div> */
