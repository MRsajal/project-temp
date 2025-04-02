import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { auth, db, storage } from "../../firebase/firebase";
import "./login.css";

export default function Register({ onImageSelect }) {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedImageURL, setSelectedImageURL] = useState(null); // State for selected image URL
  const [imageUrls, setImageUrls] = useState(["/2.png", "/1.png"]);
  const [loadingImages, setLoadingImages] = useState(true);
  const navigate = useNavigate();
  const imageNames = ["/2.png", "/1.png"];
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
  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const urls = [];
        for (const imageName of imageNames) {
          const imageRef = ref(storage, imageName);
          const url = await getDownloadURL(imageRef);
          urls.push(url);
        }
        setImageUrls(urls);
        setLoadingImages(false);
      } catch (err) {
        console.error("Error fetching image URLs:", err);
        setError("Failed to load profile images.");
        setLoadingImages(false);
      }
    };

    fetchImageUrls();
  }, []);
  const handleImageClick = (imageUrl) => {
    setSelectedImageURL(imageUrl);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!selectedImageURL) {
      setError("Please select a profile image.");
      return;
    }
    try {
      const userCredentail = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentail.user;
      await updateProfile(userCredentail.user, {
        displayName: username,
        photoURL: selectedImageURL,
      });
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        photoURL: selectedImageURL,
        points: 10,
      });
      navigate("/login");
      onImageSelect(selectedImageURL);
    } catch (error) {
      console.error("Error registering: ", error.message);
      setError(error.message);
    }
  };
  // if(loadingImages){
  //   return <div>

  //   </div>
  // }

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
        <h2>Register</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="form-item">
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
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
          <div className="form-item">
            <label htmlFor="confirmPassword">Confirm Password: </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Select Profile Image:</label>
            <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
              {imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="Profile Pic"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border:
                      selectedImageURL === url
                        ? "2px solid blue"
                        : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(url)}
                />
              ))}
            </div>
            {selectedImageURL && (
              <p style={{ marginTop: "5px" }}>
                Selected:{" "}
                <img
                  src={selectedImageURL}
                  alt="Selected"
                  style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                />
              </p>
            )}
          </div>
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link href="/login">Login</Link>{" "}
        </p>
      </div>
    </div>
  );
}

const ImageSelection = () => {
  //const navigate = useNavigate();
  const images = [
    { id: "img1", src: "/2.png" },
    { id: "img2", src: "/1.png" },
  ];
  const [selectImage, setSelectImage] = useState(null);
  const handleSelect = async (imageSrc) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const imageRef = ref(storage, `selectedImages/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      await addDoc(collection(db, "selectedImages"), { imageUrl: downloadURL });
      console.log("Image selected: ", imageSrc);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  return (
    <div>
      {images.map((image) => (
        <img
          key={image.id}
          src={image.src}
          alt="choice"
          style={{ width: 150, cursor: "pointer", margin: 10 }}
          onClick={() => handleSelect(image.src)}
        />
      ))}
    </div>
  );
};
