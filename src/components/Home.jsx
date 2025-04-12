import React, { useState, useEffect, useReducer } from "react";
import "./Home.css";
import { useAuth } from "../context/authContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router";
import { NavLink } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  setDoc,
  increment,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { async } from "@firebase/util";

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [goodHabit, setGoodHabit] = useState([]);
  const [goodHabitWeekly, setGoodHabitWeekly] = useState([]);
  const [dailyGoodhabit, setDailyGoodHabit] = useState(true);
  const [dailyBadhabit, setDailyBadHabit] = useState(true);
  const [showGraph, setShowGraph] = useState(false);
  const [badHabit, setBadHabit] = useState([]);
  const [badHabitWeekly, setBadHabitWeekly] = useState([]);
  const [reward, setReward] = useState([]);
  const [points, setPoints] = useState(0);
  const [doneTask, setDoneTask] = useState(0);
  const [doneTaskWeekly, setDoneTaskWeekly] = useState(0);
  const [totatTask, setTotalTask] = useState(0);
  const [totatTaskWeekly, setTotalTaskWeekly] = useState(0);
  const [imageUrl, setImageUrl] = useState(
    `https://i.pravatar.cc/150?u=${Math.random()}`
  );
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  //dailyGoodhabit

  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = onSnapshot(
        collection(db, "users", auth.currentUser.uid, "dailyGoodhabit"),
        (snapshot) => {
          const todayDayNumber = new Date().getDay();

          const fetchedData = [];

          snapshot.docs.forEach((docItem) => {
            const data = { id: docItem.id, ...docItem.data() };

            if (data.createdAt === todayDayNumber) {
              fetchedData.push(data);
            } else {
              // Delete from Firestore if day not matched
              deleteDoc(
                doc(
                  db,
                  "users",
                  auth.currentUser.uid,
                  "dailyGoodhabit",
                  docItem.id
                )
              );
            }
          });

          setGoodHabit(fetchedData);
          updateDailyTotalTask(fetchedData.length);
        }
      );

      return () => unsubscribe();
    }
  }, [db, auth.currentUser]);

  async function updateDailyTotalTask(taskCount) {
    if (!auth.currentUser) return;
    const userStatsRef = doc(db, "userStats", auth.currentUser.uid);
    try {
      await updateDoc(userStatsRef, {
        dailyTotalTask: taskCount,
      });
      if (taskCount === 0) {
        await updateDoc(userStatsRef, {
          dailyCompletedTask: 0,
        });
      }
    } catch (error) {
      console.error("Error updating dailyTotalTask: ", error);
    }
  }

  //weeklyGoodhabit
  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = onSnapshot(
        collection(db, "users", auth.currentUser.uid, "weeklyGoodhabit"),
        (snapshot) => {
          const fetchedData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGoodHabitWeekly(fetchedData);
        }
      );
      return () => unsubscribe();
    }
  }, [db, auth.currentUser]);
  async function deleteWeeklyList() {
    if (!auth.currentUser) return;
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const habitsCollectionRef = collection(userDocRef, "weeklyGoodhabit");

    try {
      const querySnapshot = await getDocs(habitsCollectionRef);
      const deletePromises = querySnapshot.docs.map((docSnapshot) => {
        return deleteDoc(doc(habitsCollectionRef, docSnapshot.id));
      });
      await Promise.all(deletePromises);
      console.log("Weekly list deleted successfully.");
      await updateDoc(doc(db, "userStats", auth.currentUser.uid), {
        weeklyTotalTask: 0,
      });
      setTotalTaskWeekly(0);
      if (totatTaskWeekly === 0) {
        await updateDoc(doc(db, "userStats", auth.currentUser.uid), {
          weeklyCompletedTask: 0,
        });
      }
    } catch (error) {
      console.error("Error deleting weekly list: ", error);
    }
  }
  useEffect(() => {
    if (!dailyGoodhabit) {
      const now = new Date();
      if (now.getDay() === 6) {
        // 6 represents Saturday
        deleteWeeklyList();
      }
    }
  }, [dailyGoodhabit, db]);
  //dailyBadhabit
  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = onSnapshot(
        collection(db, "users", auth.currentUser.uid, "dailyBadhabit"),
        (snapshot) => {
          const todayDayNumber = new Date().getDay();

          const fetchedData = [];

          snapshot.docs.forEach((docItem) => {
            const data = { id: docItem.id, ...docItem.data() };

            if (data.createdAt === todayDayNumber) {
              fetchedData.push(data);
            } else {
              // Delete from Firestore if day not matched
              deleteDoc(
                doc(
                  db,
                  "users",
                  auth.currentUser.uid,
                  "dailyBadhabit",
                  docItem.id
                )
              );
            }
          });

          setBadHabit(fetchedData);
          //updateDailyTotalTask(fetchedData.length);
        }
      );

      return () => unsubscribe();
    }
  }, [db, auth.currentUser]);
  //weeklyBadhabit
  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = onSnapshot(
        collection(db, "users", auth.currentUser.uid, "weeklyBadhabit"),
        (snapshot) => {
          const fetchedData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBadHabitWeekly(fetchedData);
        }
      );
      return () => unsubscribe();
    }
  }, [db, auth.currentUser]);
  async function deleteWeeklyBadList() {
    if (!auth.currentUser) return;
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const habitsCollectionRef = collection(userDocRef, "weeklyBadhabit");

    try {
      const querySnapshot = await getDocs(habitsCollectionRef);
      const deletePromises = querySnapshot.docs.map((docSnapshot) => {
        return deleteDoc(doc(habitsCollectionRef, docSnapshot.id));
      });
      await Promise.all(deletePromises);
      console.log("Weekly list deleted successfully.");
      // await updateDoc(doc(db, "userStats", auth.currentUser.uid), {
      //   weeklyTotalTask: 0,
      // });
      // setTotalTaskWeekly(0);
    } catch (error) {
      console.error("Error deleting weekly list: ", error);
    }
  }
  useEffect(() => {
    if (!dailyBadhabit) {
      const now = new Date();
      if (now.getDay() === 6) {
        // 6 represents Saturday
        deleteWeeklyBadList();
      }
    }
  }, [dailyBadhabit, db]);
  //available reward
  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = onSnapshot(
        collection(db, "users", auth.currentUser.uid, "AvaiableReward"),
        (snapshot) => {
          const fetchedData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReward(fetchedData);
        }
      );
      return () => unsubscribe();
    }
  }, [db, auth.currentUser]);

  useEffect(() => {
    const fetchPoints = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.log("User not authenticated");
        return;
      }
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setPoints(docSnap.data().points);
        } else {
          setPoints(20);
        }
      } catch (error) {
        console.error("Error fetching Points: ", error);
      }
    };

    fetchPoints();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user when auth state changes
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleUpdateProfilePic = async () => {
    if (points < 50) {
      alert(`You don't have enough points! ${50 - points} points more needed.`);
      return;
    }
    const confirmUpdate = window.confirm(
      "Are you sure? 50 points will be reduced!"
    );
    if (confirmUpdate) {
      const user = auth.currentUser;
      if (!user) {
        console.log("User not authenticated");
        return;
      }
      try {
        const userRef = doc(db, "user", user.uid);
        const newPoints = points - 50;
        await updateDoc(userRef, {
          points: newPoints,
        });
        setPoints(newPoints);
        navigate("/updateProfilePic");
      } catch (error) {
        console.error("Error updating points: ", error);
      }
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => [setImageUrl(reader.result)];
      reader.readAsDataURL(file);
    }
  };
  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error siging our: ", error.message);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./finisher-header.es5.min.js";
    script.type = "text/javascript";
    script.onload = () => {
      new window.FinisherHeader({
        count: 100,
        size: {
          min: 2,
          max: 8,
          pulse: 0,
        },
        speed: {
          x: { min: 0, max: 0.4 },
          y: { min: 0, max: 0.6 },
        },
        colors: {
          background: "#e0e0e5",
          particles: ["#01acdf", "#06e334", "#eaa262"],
        },
        blending: "overlay",
        opacity: { center: 1, edge: 0 },
        skew: -2,
        shapes: ["c"],
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchUserStats = async (userId) => {
    if (!userId) return;
    const todayDayNumber = new Date().getDay();
    try {
      const userStatsRef = doc(db, "userStats", userId);
      const docSnap = await getDoc(userStatsRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lastResetDay !== todayDayNumber && todayDayNumber === 0) {
          const resetData = {};
          for (let i = 0; i < 7; i++) {
            resetData[`day${i}`] = {
              dailyTotalTask: 0,
              dailyCompletedTask: 0,
            };
          }
          await updateDoc(userStatsRef, {
            ...resetData,
            weeklyTotalTask: 0,
            weeklyCompletedTask: 0,
            lastResetDay: todayDayNumber,
          });
        }
        if (todayDayNumber === 1) {
          await updateDoc(userStatsRef, {
            lastResetDay: 1,
          });
        }
        const todayData = data[`day${todayDayNumber}`] || {
          dailyTotalTask: 0,
          dailyCompletedTask: 0,
        };
        setTotalTask(todayData.dailyTotalTask);
        setDoneTask(todayData.dailyCompletedTask);
        setTotalTaskWeekly(data.weeklyTotalTask);
        setDoneTaskWeekly(data.weeklyCompletedTask);
      } else {
        // First time user → Create default data
        const initailData = {
          weeklyTotalTask: 0,
          weeklyCompletedTask: 0,
          lastResetDay: 1,
        };
        for (let i = 0; i < 7; i++) {
          initailData[`day${i}`] = {
            dailyTotalTask: 0,
            dailyCompletedTask: 0,
          };
        }
        await setDoc(userStatsRef, initailData);
        setTotalTask(0);
        setDoneTask(0);
        setTotalTaskWeekly(0);
        setDoneTaskWeekly(0);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (auth.currentUser) {
      fetchUserStats(auth.currentUser.uid);
    }
  }, [auth.currentUser]);

  //graph show
  const [data, setData] = useState([]);
  const days = ["Sun", "Mon", "Tue", "Web", "Thu", "Fri", "Sat"];
  useEffect(() => {
    const fetchWeeklyData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const today = new Date().getDay();
      const userStatsRef = doc(db, "userStats", user.uid);
      const docSnap = await getDoc(userStatsRef);

      if (!docSnap.exists()) {
        setData(days.map((day) => ({ name: day, percentage: 0 })));
        return;
      }

      const statsData = docSnap.data();
      let tempData = [];
      for (let i = 0; i < 7; i++) {
        const daykey = `day${i}`;
        const total = statsData[daykey]?.dailyTotalTask || 0;
        const done = statsData[daykey]?.dailyCompletedTask || 0;
        const percentage = total === 0 ? 0 : (done / total) * 100;

        tempData.push({ name: days[i], percentage });
      }
      setData(tempData);
    };
    fetchWeeklyData();
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRewardPopupOpen, setIsRewardPopupOpen] = useState(false);
  const [isNegativePopupOpen, setIsNegativePopupOpen] = useState(false);
  return (
    <div
      className="main header finisher-header"
      style={{ height: "100vh", width: "100vw" }}
    >
      <div className="list">
        <nav className="topnav">
          <ul>
            <li>
              <NavLink
                to="/home"
                className={({ isActive }) => `${isActive ? "active" : ""}`}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/list"
                className={({ isActive }) => `${isActive ? "active" : ""}`}
              >
                List
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="profile">
        <h3>Profile</h3>
        {/* <div style={{ display: "flex", flexDirection: "column" }}>
          <img src={imageUrl} alt="User Avatar" height="150px" width="150px" />
          <input
            type="file"
            accept="image/"
            onChange={handleImageChange}
            id="fileInput"
            style={{ display: "none" }}
          />
          <label htmlFor="fileInput">Choose Image</label>
        </div> */}
        <div>
          {user && user.photoURL && (
            <img
              src={user.photoURL}
              alt="User Avatar"
              height="150px"
              width="150px"
              style={{ borderRadius: "50%", marginBottom: "10px" }}
            />
          )}
          {!user && (
            <img
              src={imageUrl}
              alt="User Avatar"
              height="150px"
              width="150px"
            />
          )}
        </div>
        <button className="logout-btn" onClick={handleUpdateProfilePic}>
          Update Pic
        </button>
        <h3>{user?.displayName}</h3>
        <p style={{ color: "blue" }}>Today's Date: {formattedDate}</p>
        <p>
          Total points:{" "}
          <span style={{ color: "#86A788" }}>{points} points</span>
        </p>
        <div className="display-task-amount1">
          <h4 style={{ color: dailyGoodhabit ? "purple" : "#01acdf" }}>
            {dailyGoodhabit ? "Daily" : "Weekly"}
          </h4>
          <p style={{ color: "red" }}>
            You have completed {dailyGoodhabit ? doneTask : doneTaskWeekly} out
            of {dailyGoodhabit ? totatTask : totatTaskWeekly} tasks
          </p>
        </div>
        <div style={{ textAlign: "center" }} className="display-task-amount2">
          <h4 style={{ color: dailyGoodhabit ? "purple" : "#01acdf" }}>
            {dailyGoodhabit ? "Daily" : "Weekly"}
          </h4>

          <p style={{ color: "red" }}>
            You have completed {dailyGoodhabit ? doneTask : doneTaskWeekly} out
            of {dailyGoodhabit ? totatTask : totatTaskWeekly} tasks
          </p>
          <button
            onClick={() => setDailyGoodHabit((prev) => !prev)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#01acdf",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Swap
          </button>
        </div>

        <div className="graph">
          <button
            style={{
              backgroundColor: "#FFA955",
              border: "1px solid gray",
              color: "#102E50",
              padding: "4px",
            }}
            className="show-graph-btn"
            onClick={() => setShowGraph(!showGraph)}
          >
            {showGraph ? "Hide Progress" : "Show Daily Progress"}
          </button>
          {showGraph && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="percentage" fill="#4ade80">
                  <LabelList
                    dataKey="percentage"
                    position="top"
                    formatter={(val) => `${val.toFixed(2)}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <button className="logout-btn" onClick={handleLogOut}>
          Logout
        </button>
      </div>
      <div className="todo-list">
        <div className="positive">
          <div className="good-habit">
            <h3 style={{ color: "green" }}>Good Habits </h3>
            <button
              style={{ color: "green" }}
              onClick={() => setIsPopupOpen(true)}
            >
              ➕
            </button>
            {dailyGoodhabit
              ? isPopupOpen && (
                  <PositivePopup
                    setTotalTask={setTotalTask}
                    db={db}
                    dailyGoodhabit={dailyGoodhabit}
                    userId={user}
                    setTotalTaskWeekly={setTotalTaskWeekly}
                    onClose={() => setIsPopupOpen(false)}
                  />
                )
              : isPopupOpen && (
                  <PositivePopup
                    setTotalTask={setTotalTaskWeekly}
                    db={db}
                    dailyGoodhabit={dailyGoodhabit}
                    userId={user}
                    setTotalTaskWeekly={setTotalTaskWeekly}
                    onClose={() => setIsPopupOpen(false)}
                  />
                )}
          </div>

          <div>
            <label>
              <input
                type="radio"
                name="dailyFilter"
                checked={dailyGoodhabit}
                onChange={() => setDailyGoodHabit(true)}
              />
              Daily
            </label>
            <label>
              <input
                type="radio"
                name="dailyFilter"
                checked={!dailyGoodhabit}
                onChange={() => setDailyGoodHabit(false)}
              />
              Weekly
            </label>
          </div>
          {dailyGoodhabit ? (
            <ShowGoodHabit
              goodHabit={goodHabit}
              setGoodHabit={setGoodHabit}
              points={points}
              setPoints={setPoints}
              setDoneTask={setDoneTask}
              setTotalTask={setTotalTask}
              db={db}
              collectionName="dailyGoodhabit"
              dailyGoodhabit={dailyGoodhabit}
              setDoneTaskWeekly={setDoneTaskWeekly}
              setTotalTaskWeekly={setTotalTaskWeekly}
            />
          ) : (
            <ShowGoodHabit
              goodHabit={goodHabitWeekly}
              setGoodHabit={setGoodHabitWeekly}
              points={points}
              setPoints={setPoints}
              setDoneTask={setDoneTaskWeekly}
              setTotalTask={setTotalTaskWeekly}
              db={db}
              collectionName="weeklyGoodhabit"
              dailyGoodhabit={dailyGoodhabit}
              setDoneTaskWeekly={setDoneTaskWeekly}
              setTotalTaskWeekly={setTotalTaskWeekly}
            />
          )}
        </div>
        <div className="negative">
          <div className="good-habit">
            <h3 style={{ color: "red" }}>Bad Habits </h3>
            <button onClick={() => setIsNegativePopupOpen(true)}>➕</button>
            {dailyBadhabit
              ? isNegativePopupOpen && (
                  <NegativePopup
                    onClose={() => setIsNegativePopupOpen(false)}
                    db={db}
                    dailyBadhabit={dailyBadhabit}
                  />
                )
              : isNegativePopupOpen && (
                  <NegativePopup
                    db={db}
                    dailyBadhabit={dailyBadhabit}
                    onClose={() => setIsNegativePopupOpen(false)}
                  />
                )}
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="dailyFilterBad"
                checked={dailyBadhabit}
                onChange={() => setDailyBadHabit(true)}
              />
              Daily
            </label>
            <label>
              <input
                type="radio"
                name="dailyFilterBad"
                checked={!dailyBadhabit}
                onChange={() => setDailyBadHabit(false)}
              />
              Weekly
            </label>
          </div>
          {dailyBadhabit ? (
            <ShowBadHabit
              badHabit={badHabit}
              setBadHabit={setBadHabit}
              setPoints={setPoints}
              db={db}
              collectionName="dailyBadhabit"
              points={points}
              user={user}
            />
          ) : (
            <ShowBadHabit
              badHabit={badHabitWeekly}
              setBadHabit={setBadHabitWeekly}
              setPoints={setPoints}
              db={db}
              collectionName="weeklyBadhabit"
              points={points}
              user={user}
            />
          )}
        </div>
        <div className="reward">
          <div className="good-habit">
            <h3 style={{ color: "rgb(236, 120, 139)" }}>Reward </h3>
            <button onClick={() => setIsRewardPopupOpen(true)}>➕</button>
            {isRewardPopupOpen && (
              <RewardPopup onClose={() => setIsRewardPopupOpen(false)} />
            )}
          </div>
          <ShowReward
            rewards={reward}
            setReward={setReward}
            setPoints={setPoints}
          />
        </div>
      </div>
    </div>
  );
}

function NegativePopup({ onClose, db, dailyBadhabit }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <Negative db={db} dailyBadhabit={dailyBadhabit} />
      </div>
    </div>
  );
}
function PositivePopup({
  onClose,
  setTotalTask,
  db,
  dailyGoodhabit,
  userId,
  setTotalTaskWeekly,
}) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <Positive
          setTotalTask={setTotalTask}
          db={db}
          dailyGoodhabit={dailyGoodhabit}
          userId={userId}
          setTotalTaskWeekly={setTotalTaskWeekly}
        />
      </div>
    </div>
  );
}
function RewardPopup({ onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <RewardAdd db={db} />
      </div>
    </div>
  );
}

function RewardAdd() {
  const [des, setDes] = useState("");
  const [cost, setCost] = useState(0);
  async function handleRewardSubmit(e) {
    e.preventDefault();
    if (!des || !auth.currentUser) return;
    const newReward = { des, cost, gain: false };
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid); // Reference to the user's document
      const rewardsCollectionRef = collection(userDocRef, "AvaiableReward"); // Reference to the rewards subcollection
      await addDoc(rewardsCollectionRef, newReward);
    } catch (error) {
      console.error("Error is saving reward:", error);
    }
    //setReward((prevRewards) => [...prevRewards, newReward]);
    setDes("");
    setCost(0);
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        marginTop: "30px",
      }}
    >
      <div>
        Add
        <span style={{ color: "rgb(236, 120, 139)", textAlign: "center" }}>
          {" "}
          Reward
        </span>
      </div>
      <form style={{ marginTop: "20px" }} onSubmit={handleRewardSubmit}>
        <input
          type="number"
          placeholder="Cost"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
          style={{ width: "50px", marginLeft: "10px", marginRight: "20px" }}
        />
        <input
          type="text"
          placeholder="Enter reward"
          value={des}
          style={{ marginRight: "2px" }}
          onChange={(e) => setDes(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

function Positive({
  setTotalTask,
  db,
  dailyGoodhabit,
  userId,
  setTotalTaskWeekly,
}) {
  const [description, setDescription] = useState("");
  const [point, setPoint] = useState(10);
  const [difficulty, setDifficulty] = useState("Easy");

  const addTask = async () => {
    if (!auth.currentUser) return;
    const userStatsRef = doc(db, "userStats", auth.currentUser.uid);
    const todayDayNumber = new Date().getDay();
    try {
      if (dailyGoodhabit) {
        const dayField = `day${todayDayNumber}.dailyTotalTask`;
        await updateDoc(userStatsRef, {
          [dayField]: increment(1),
        });
        //setTotalTask((prev) => prev + 1);
      } else {
        await updateDoc(userStatsRef, {
          weeklyTotalTask: increment(1),
        });
        //setTotalTaskWeekly((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  async function handleAddList(listItem) {
    // setList((list) => [...list, listItem]);
    // console.log(List);
    if (!userId || !auth.currentUser) {
      console.warn("User ID not availabe, cannot add todo to Firestore.");
      return;
    }
    try {
      const collectionName = dailyGoodhabit
        ? "dailyGoodhabit"
        : "weeklyGoodhabit";
      const userDocRef = doc(db, "users", auth.currentUser.uid); // Reference to the user's document
      const habitsCollectionRef = collection(userDocRef, collectionName); // Reference to the habits subcollection for the user
      const docRef = await addDoc(habitsCollectionRef, listItem);
      addTask();
      console.log("Document written with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
  function handleDescription(e) {
    e.preventDefault();
    if (!description || !point) return;
    const currentDay = new Date().getDay();
    const newItem = {
      description,
      point,
      type: true,
      done: false,
      createdAt: currentDay,
    };
    setTotalTask((s) => s + 1);
    handleAddList(newItem);
    setDescription("");
    setPoint(10);
    setDifficulty("Easy");
  }
  function handleDifficultyChage(e) {
    const selectDificulty = e;
    setDifficulty(selectDificulty);
    if (selectDificulty === "Easy") setPoint(10);
    if (selectDificulty === "Medium") setPoint(15);
    if (selectDificulty === "Hard") setPoint(20);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div>
        Add {dailyGoodhabit ? "Daily" : "Weekly"}
        <span style={{ color: "green" }}> Positive </span>Task
      </div>
      <div className="todo">
        <div className="form">
          <form onSubmit={handleDescription}>
            <select
              value={difficulty}
              onChange={(e) => handleDifficultyChage(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <input
              type="text"
              placeholder="Enter good habit"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
}
function Negative({ List, setList, setTotalTask, db, dailyBadhabit }) {
  const [description, setDescription] = useState("");
  const [point, setPoint] = useState(10);
  const [difficulty, setDifficulty] = useState("Easy");
  async function handleAddList(listItem) {
    // setList((list) => [...list, listItem]);
    // console.log(List);
    if (!auth.currentUser) {
      console.warn("User ID not availabe, cannot add todo to Firestore.");
      return;
    }
    try {
      const collectionName = dailyBadhabit ? "dailyBadhabit" : "weeklyBadhabit";
      const userDocRef = doc(db, "users", auth.currentUser.uid); // Reference to the user's document
      const habitsCollectionRef = collection(userDocRef, collectionName); // Reference to the habits subcollection for the user
      const docRef = await addDoc(habitsCollectionRef, listItem);
      console.log("Document written with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    // try {
    //   const collectionName = dailyBadhabit ? "dailyBadhabit" : "weeklyBadhabit";
    //   const docRef = await addDoc(collection(db, collectionName), listItem);
    //   console.log("Document written with ID:", docRef.id);
    // } catch (error) {
    //   console.error("Error adding document: ", error);
    // }
  }
  function handleDescription(e) {
    e.preventDefault();
    if (!description && !point) return;
    const currentDay = new Date().getDay();
    const newItem = {
      description,
      point,
      type: false,
      done: false,
      createdAt: currentDay,
    };

    handleAddList(newItem);
    setDescription("");
    setPoint(10);
    setDifficulty("Easy");
  }
  function handleDifficultyChage(e) {
    const selectDificulty = e;
    setDifficulty(selectDificulty);
    if (selectDificulty === "Easy") setPoint(10);
    if (selectDificulty === "Medium") setPoint(15);
    if (selectDificulty === "Hard") setPoint(20);
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        Add {dailyBadhabit ? "Daily" : "Weekly"}
        <span style={{ color: "red" }}> Negative </span>Task
      </div>
      <div className="todo">
        <div className="form">
          <form onSubmit={handleDescription} style={{ marginTop: "15px" }}>
            <select
              value={difficulty}
              onChange={(e) => handleDifficultyChage(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <input
              type="text"
              placeholder="Enter bad habit"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ShowGoodHabit({
  goodHabit,
  setGoodHabit,
  points,
  setPoints,
  setDoneTask,
  setTotalTask,
  db,
  collectionName,
  dailyGoodhabit,
  setDoneTaskWeekly,
  setTotalTaskWeekly,
}) {
  const doneTask = async () => {
    if (!auth.currentUser) return;
    const userStatsRef = doc(db, "userStats", auth.currentUser.uid);
    const todayDayNumber = new Date().getDay();
    try {
      if (dailyGoodhabit) {
        //Daily habit -> Update today's data only
        const dayField = `day${todayDayNumber}.dailyCompletedTask`;
        await updateDoc(userStatsRef, {
          [dayField]: increment(1),
        });
        setDoneTask((prev) => prev + 1);
      } else {
        // Weekly habit → Update weeklyCompletedTask
        await updateDoc(userStatsRef, {
          weeklyCompletedTask: increment(1),
        });
        setDoneTaskWeekly((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  async function handlePoint(id, point, done) {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user is logged in.");
        return;
      }

      const documentRef = doc(db, "users", user.uid, collectionName, id);
      await updateDoc(documentRef, { done: !done });

      const updatedDoc = await getDoc(documentRef);
      const updatedDone = updatedDoc.data()?.done;

      setGoodHabit((prevGoodHabit) =>
        prevGoodHabit.map((item) =>
          item.id === id ? { ...item, done: updatedDone } : item
        )
      );
      const userRef = doc(db, "users", user.uid);
      let newPoints = done ? points - point : points + point;
      if (newPoints < 0) newPoints = 0;
      await updateDoc(userRef, { points: newPoints });
      setPoints(newPoints);

      doneTask();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  async function handleDeleteItem(id) {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user is logged in.");
        return;
      }
      const documentRef = doc(db, "users", user.uid, collectionName, id);
      const userStatsRef = doc(db, "userStats", auth.currentUser.uid);
      const todayDayNumber = new Date().getDay();
      await deleteDoc(documentRef);
      if (dailyGoodhabit) {
        const dayField = `day${todayDayNumber}.dailyTotalTask`;
        await updateDoc(userStatsRef, {
          [dayField]: increment(-1),
        });
        setTotalTask((prev) => prev - 1);
      } else {
        await updateDoc(userStatsRef, {
          weeklyTotalTask: increment(-1),
        });
        setTotalTaskWeekly((prev) => prev - 1);
      }
      setGoodHabit((goodHabit) => goodHabit.filter((item) => item.id !== id));
      //setTotalTask((s) => s - 1);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }
  return (
    <div className="card-container">
      {goodHabit.map((habits) =>
        habits.done ? (
          <div></div>
        ) : (
          <div key={habits.id} className="card">
            <p>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => handleDeleteItem(habits.id)}
              >
                ❌
              </span>
              {habits.description}
            </p>
            <p
              style={{
                color:
                  habits.point === 10
                    ? "orange"
                    : habits.point === 15
                    ? "blue"
                    : "#86A788",
              }}
            >
              Gain: {habits.point} points
            </p>
            <button
              style={{
                backgroundColor: "beige",
                color: "gray",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => handlePoint(habits.id, habits.point, habits.done)}
            >
              Complete habit
            </button>
          </div>
        )
      )}
    </div>
  );
}
function ShowBadHabit({
  badHabit,
  setBadHabit,
  setPoints,
  db,
  collectionName,
  points,
  user,
}) {
  async function handlePoint(id, point, done) {
    try {
      const documentRef = doc(db, collectionName, id);
      await updateDoc(documentRef, { done: !done });
      const updatedDoc = await getDoc(documentRef);
      const updatedDone = updatedDoc.data()?.done;
      setBadHabit((badHabit) =>
        badHabit.map((item) =>
          item.id === id ? { ...item, done: updatedDone } : item
        )
      );
      const userRef = doc(db, "users", user.uid);
      let newPoints = done ? points + point : points - point;
      await updateDoc(userRef, { points: newPoints });
      setPoints(newPoints);
    } catch (error) {
      console.error("Error updateing document: ", error);
    }
  }
  async function handleDeleteItem(id) {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user is logged in.");
        return;
      }
      const documentRef = doc(db, "users", user.uid, collectionName, id);
      await deleteDoc(documentRef);
      setBadHabit((badHabit) => badHabit.filter((item) => item.id !== id));
      //setTotalTask((s) => s - 1);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }
  return (
    <div className="card-container">
      {badHabit.map((habits) =>
        habits.done ? (
          <div></div>
        ) : (
          <div className="card">
            <p>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => handleDeleteItem(habits.id)}
              >
                ❌
              </span>
              {habits.description}
            </p>
            <p
              style={{
                color:
                  habits.point === 10
                    ? "orange"
                    : habits.point === 15
                    ? "blue"
                    : "#86A788",
              }}
            >
              Gain: {habits.point} points
            </p>
            <button
              style={{
                backgroundColor: "beige",
                color: "gray",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => handlePoint(habits.id, habits.point, habits.done)}
            >
              Complete habit
            </button>
          </div>
        )
      )}
    </div>
  );
}

function ShowReward({ rewards, setReward, setPoints }) {
  // const [claimedReward, setClaimedReward] = useState([]);
  const [showClaimedReward, setShowClaimedReward] = useState(false);
  async function handleDeleteItem(id) {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      return;
    }

    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const rewardRef = doc(userDocRef, "AvaiableReward", id);

    try {
      await deleteDoc(rewardRef);
      setReward((prevRewards) => prevRewards.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting reward from Firestore:", error);
    }
  }
  const handleReward = async (reward) => {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      return;
    }

    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const rewardRef = doc(userDocRef, "AvaiableReward", reward.id); // Correct path

    try {
      // Fetch the document to check if it exists
      const docSnap = await getDoc(rewardRef);
      if (!docSnap.exists()) {
        console.error("Reward document does not exist:", reward.id);
        alert("Reward not found!");
        return;
      }

      // Check if the user has enough points before updating
      setPoints((prevPoints) => {
        if (prevPoints - reward.cost < 0) {
          alert("Not enough points to redeem this reward!");
          return prevPoints; // Keep points unchanged
        }

        // Update Firestore to mark reward as claimed
        updateDoc(rewardRef, { gain: true })
          .then(() => {
            setReward((prevRewards) =>
              prevRewards.map((r) =>
                r.id === reward.id ? { ...r, gain: true } : r
              )
            );
          })
          .catch((error) => {
            console.error("Error updating Firestore:", error);
          });

        return prevPoints - reward.cost; // Deduct points
      });
    } catch (error) {
      console.error("Error processing reward:", error);
    }
  };

  const [claimedRewardsList, setClaimedRewardsList] = useState([]);

  useEffect(() => {
    setClaimedRewardsList(rewards.filter((reward) => reward.gain));
  }, [rewards]);

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            name="rewardFilter"
            checked={!showClaimedReward}
            onChange={() => setShowClaimedReward(false)}
          />
          Available Rewards
        </label>
        <label>
          <input
            type="radio"
            name="rewardFilter"
            checked={showClaimedReward}
            onChange={() => setShowClaimedReward(true)}
          />
          Claimed Rewards
        </label>
      </div>
      <div className="card-container">
        {showClaimedReward ? (
          claimedRewardsList.length > 0 ? (
            claimedRewardsList.map((reward) => (
              <div className="card" key={reward.id}>
                <p>{reward.des}</p>
                <p style={{ color: "#86A788" }}>Cost: {reward.cost} points</p>
                <p style={{ color: "green" }}>Claimed ✅</p>
              </div>
            ))
          ) : (
            "No claimed rewards yet."
          )
        ) : rewards.length > 0 ? (
          rewards.map((reward) =>
            reward.gain ? (
              <div></div>
            ) : (
              <div className="card">
                <p>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteItem(reward.id)}
                  >
                    ❌
                  </span>
                  {reward.des}
                </p>
                <p
                  style={{
                    color: "#86A788",
                  }}
                >
                  Cost: {reward.cost} points
                </p>
                <button
                  style={{
                    backgroundColor: "beige",
                    color: "gray",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleReward(reward)}
                >
                  Get Reward
                </button>
              </div>
            )
          )
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
