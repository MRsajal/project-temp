import React, { useEffect, useState } from "react";
import { storage, auth, db } from "../firebase/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router";
import { async } from "@firebase/util";

export default function UpdateProfilePic() {
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState([
    "/1.png",
    "/2.png",
    "/3.png",
    "/4.png",
  ]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  // useEffect(() => {
  //   const fetchImageUrls = async () => {
  //     try {
  //       const iamgeNames = ["/2.png", "/1.png"];
  //       const urls = [];
  //       for (const imageName of iamgeNames) {
  //         const imageRef = ref(storage, imageName);
  //         const url = await getDownloadURL(imageRef);
  //         urls.push(url);
  //       }
  //       setImageUrls(urls);
  //       setloading(false);
  //     } catch (error) {
  //       console.error("Error fetching image URLs:", err);
  //       setError("Failed to load profile images.");
  //       setloading(false);
  //     }
  //   };
  // });
  const handleImageClick = (iamgeUrl) => {
    setSelectedImageUrl(iamgeUrl);
  };
  const handleSaveProfileImage = async () => {
    if (!selectedImageUrl) {
      alert("Please select an image.");
      return;
    }
    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { photoURL: selectedImageUrl });
        alert("Profile image updated successfully");
        navigate("/home");
      } else {
        alert("User not logged in");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      alert("Failed to update profile image.");
    }
  };
  if (loading) {
    return <div>Loading images....</div>;
  }
  if (error) {
    return <div>Error loading images: {error}</div>;
  }
  return (
    <div>
      <h2>Select Profile Image</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {imageUrls.map((url, index) => (
          <div key={index} style={{ position: "relative", cursor: "pointer" }}>
            <img
              src={url}
              alt={`Profile Option ${index + 1}`}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                border:
                  selectedImageUrl === url
                    ? "3px solid blue"
                    : "1px solid #ccc",
              }}
              onClick={() => handleImageClick(url)}
            />
            {selectedImageUrl === url && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "1.2em",
                  fontWeight: "bold",
                  color: "blue",
                }}
              >
                ✓
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedImageUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>Selected Image:</p>
          <img
            src={selectedImageUrl}
            alt="Selected"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        </div>
      )}
      <button
        onClick={handleSaveProfileImage}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Save Profile Image
      </button>
    </div>
  );
}
