import React, { useState, useEffect } from "react";
import "./List.css";
import { NavLink } from "react-router";
import { db, auth } from "../../firebase/firebase";
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
} from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function List({ darkMode, setDarkMode }) {
  const [user, setUser] = useState(null);
  const [goodHabit, setGoodHabit] = useState([]);
  const [goodHabitWeekly, setGoodHabitWeekly] = useState([]);
  const [dailyGoodhabit, setDailyGoodHabit] = useState(true);
  const [dailyBadhabit, setDailyBadHabit] = useState(true);
  const [badHabit, setBadHabit] = useState([]);
  const [badHabitWeekly, setBadHabitWeekly] = useState([]);
  const [reward, setReward] = useState([]);
  const [des, setDes] = useState("");
  const [cost, setCost] = useState(0);
  const [points, setPoints] = useState(0);
  const [doneTask, setDoneTask] = useState(0);
  const [doneTaskWeekly, setDoneTaskWeekly] = useState(0);
  const [totatTask, setTotalTask] = useState(0);
  const [totatTaskWeekly, setTotalTaskWeekly] = useState(0);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "dailyGoodhabit"),
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGoodHabit(fetchedData);
      }
    );

    return () => unsubscribe();
  }, [db]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user when auth state changes
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "weeklyGoodhabit"),
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGoodHabitWeekly(fetchedData);
      }
    );

    return () => unsubscribe();
  }, [db]);

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
        target: document.body,
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  //dailyGoodhabit
  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = onSnapshot(
        collection(db, "users", auth.currentUser.uid, "dailyGoodhabit"),
        (snapshot) => {
          const fetchedData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGoodHabit(fetchedData);
        }
      );
      return () => unsubscribe();
    }
  }, [db, auth.currentUser]);
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
  //dailyBadhabit
  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = onSnapshot(
        collection(db, "users", auth.currentUser.uid, "dailyBadhabit"),
        (snapshot) => {
          const fetchedData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBadHabit(fetchedData);
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
  //const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#121212";
  }, [darkMode]);
  const toggleMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRewardPopupOpen, setIsRewardPopupOpen] = useState(false);
  const [isNegativePopupOpen, setIsNegativePopupOpen] = useState(false);

  return (
    <div className="show">
      <div className="list">
        <nav className="topnav1">
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
            <li onClick={toggleMode} style={{ marginLeft: "15px" }}>
              {darkMode ? "🌙" : "🌑"}
            </li>
          </ul>
        </nav>
      </div>
      <div className="todo-list-2">
        <div className="positive">
          <div className="good-habit">
            <h3 style={{ color: "#67AE6E" }}>Good Habits </h3>
            <button
              style={{ backgroundColor: "#9ACBD0" }}
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
            />
          )}
        </div>
        <div className="negative">
          <div className="good-habit">
            <h3 style={{ color: "red" }}>Bad Habits </h3>
            <button
              style={{ backgroundColor: "#9ACBD0" }}
              onClick={() => setIsNegativePopupOpen(true)}
            >
              ➕
            </button>
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
            <button
              style={{ backgroundColor: "#9ACBD0" }}
              onClick={() => setIsRewardPopupOpen(true)}
            >
              ➕
            </button>
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
  const [suggestionLoading, setSuggestionLoading] = useState(false);

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

  async function generateRandomReward() {
    setSuggestionLoading(true);
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
      });
      const prompt =
        "Give one short and simple reward idea for someone who completed their daily habit task(It's for an website, user will use points to get this reward). Do not include bullet points, no asterisks, and no titles like 'Fun' or 'Relaxing'. Keep it concise and fun.For example, Have a 1h movie time.";
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text();
      const cleanedText = rawText
        .replace(/(\*\*|[*:_-])/g, "") // remove bold, bullets, etc.
        .split("\n") // if multiple lines, pick one
        .find((line) => line.trim().length > 0) // pick first non-empty line
        .trim();
      setDes(cleanedText);
    } catch (error) {
      console.error("Error fetching AI reward:", err);
      setDes("Watch your favorite movie!");
    }
    setSuggestionLoading(false);
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
      <button onClick={generateRandomReward} disabled={suggestionLoading}>
        {suggestionLoading ? "Loading..." : "🎲 Random Reward"}
      </button>
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
  const [habitType, setHabitType] = useState("study");
  const [customType, setCustomType] = useState("");
  const [habitCount, setHabitCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const getFinalType = () =>
    habitType === "custom" && customType.trim() ? customType : habitType;

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

  const generatdHabits = async () => {
    setIsLoading(true);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    // const models = await genAI.listModels();
    // console.log(models);

    const finalType = getFinalType();
    const prompt = `Generate ${habitCount} ${difficulty.toLowerCase()} ${finalType} habits. Just return habit titles, no descriptions.`;
    try {
      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      const habits = text.split("\n").filter(Boolean).slice(0, habitCount);
      habits.forEach((habit) => {
        const habitItem = {
          description: habit.replace(/^\d+\.\s*/, ""), // remove leading "1. "
          point,
          type: true,
          done: false,
          createdAt: new Date().getDay(),
        };
        setTotalTask((s) => s + 1);
        handleAddList(habitItem);
      });
    } catch (error) {
      console.error("Error generating habits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-container">
      {goodHabit.map((habits) =>
        habits.done ? null : (
          <div key={habits.id} className="card">
            <p>
              <span
                style={{ cursor: "pointer", marginRight: "8px" }}
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
                padding: "8px",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "auto",
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
function Negative({ List, setList, setTotalTask, db, dailyBadhabit }) {
  const [description, setDescription] = useState("");
  const [point, setPoint] = useState(10);
  const [difficulty, setDifficulty] = useState("Easy");

  const [habitType, setHabitType] = useState("eating");
  const [customType, setCustomType] = useState("");
  const [habitCount, setHabitCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddList(listItem) {
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

  const generateAIHaibts = async () => {
    setIsLoading(true);
    const selectedType = customType || habitType;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const prompt = `Generate ${habitCount} ${difficulty.toLowerCase()} bad habits related to ${selectedType}. Only return a simple list of habit titles.`;
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const habits = text.split("\n").filter(Boolean).slice(0, habitCount);

      const currentDay = new Date().getDay();
      const points =
        difficulty === "Easy" ? 10 : difficulty === "Medium" ? 15 : 20;
      for (const h of habits) {
        const newItem = {
          description: h.replace(/^\d+\.\s*/, ""),
          point: points,
          type: false,
          done: false,
          createdAt: currentDay,
        };
        await handleAddList(newItem);
      }
    } catch (error) {
      console.error("Error generating habits:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <div style={{ textAlign: "center" }}>
          <h4>Generate Habits with AI</h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <select
              value={habitType}
              onChange={(e) => setHabitType(e.target.value)}
            >
              <option value="eating">Eating</option>
              <option value="sleep">Sleep</option>
              <option value="study">Study</option>
              <option value="exercise">Exercise</option>
              <option value="custom">Custom</option>
            </select>

            {habitType === "custom" && (
              <input
                type="text"
                placeholder="Enter custom type"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
              />
            )}

            <input
              type="number"
              placeholder="Number of habits"
              min={1}
              max={10}
              value={habitCount}
              onChange={(e) => setHabitCount(parseInt(e.target.value))}
            />

            <select
              value={difficulty}
              onChange={(e) => handleDifficultyChage(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <button onClick={generateAIHaibts} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Habits"}
            </button>
          </div>
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
  const [showModal, setShowModal] = useState(false);
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

  const incompleteHabits = goodHabit.filter((habits) => !habits.done);
  const firstThreeHabits = incompleteHabits.slice(0, 3);
  const remainingHabits = incompleteHabits.slice(3);
  const HabitCard = ({ habits }) => (
    <div key={habits.id} className="card">
      <p>
        <span
          style={{ cursor: "pointer", marginRight: "8px" }}
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
          padding: "8px",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "auto",
        }}
        onClick={() => handlePoint(habits.id, habits.point, habits.done)}
      >
        Complete habit
      </button>
    </div>
  );

  return (
    <>
      <div className="card-container">
        {firstThreeHabits.map((habits) => (
          <HabitCard key={habits.id} habits={habits} />
        ))}
        {remainingHabits.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: "#ccc",
              padding: "10px",
              borderRadius: "6px",
              marginTop: "10px",
              cursor: "pointer",
              border: "none",
            }}
          >
            Show More
          </button>
        )}
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              maxHeight: "80vh",
              overflowY: "auto",
              maxWidth: "80vw",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>
                All <span style={{ color: "green" }}>Positive</span> Habits
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  marginTop: "10px",
                  padding: "8px",
                  borderRadius: "6px",
                  backgroundColor: "lightcoral",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  height: "fit-content",
                }}
              >
                Close
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {remainingHabits.map((habits) => (
                <HabitCard key={habits.id} habits={habits} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
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
  const [showModal, setShowModal] = useState(false);
  async function handlePoint(id, point, done) {
    try {
      const documentRef = doc(db, collectionName, id);
      const docSnap = await getDoc(documentRef);
      if (!docSnap.exists()) {
        console.error("Document does not exist:", id);
        return;
      }
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

  const incompleteHabits = badHabit.filter((habits) => !habits.done);
  const firstThreeHabits = incompleteHabits.slice(0, 3);
  const remainingHabits = incompleteHabits.slice(3);

  const HabitCard = ({ habits }) => (
    <div key={habits.id} className="card">
      <p>
        <span
          style={{ cursor: "pointer", marginRight: "8px" }}
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
          padding: "8px",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "auto",
        }}
        onClick={() => handlePoint(habits.id, habits.point, habits.done)}
      >
        Complete habit
      </button>
    </div>
  );

  return (
    <>
      <div className="card-container">
        {firstThreeHabits.map((habits) => (
          <HabitCard key={habits.id} habits={habits} />
        ))}
        {remainingHabits.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: "#ccc",
              padding: "10px",
              borderRadius: "6px",
              marginTop: "10px",
              cursor: "pointer",
              border: "none",
            }}
          >
            Show More
          </button>
        )}
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              maxHeight: "80vh",
              overflowY: "auto",
              maxWidth: "80vw",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>
                All <span style={{ color: "green" }}>Positive</span> Habits
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  marginTop: "10px",
                  padding: "8px",
                  borderRadius: "6px",
                  backgroundColor: "lightcoral",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  height: "fit-content",
                }}
              >
                Close
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {remainingHabits.map((habits) => (
                <HabitCard key={habits.id} habits={habits} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ShowReward({ rewards, setReward, setPoints }) {
  const [showClaimedReward, setShowClaimedReward] = useState(false);
  const [claimedRewardsList, setClaimedRewardsList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setClaimedRewardsList(rewards.filter((reward) => reward.gain));
  }, [rewards]);

  const handleDeleteItem = async (id) => {
    if (!auth.currentUser) return console.error("User not authenticated");

    const rewardRef = doc(
      db,
      "users",
      auth.currentUser.uid,
      "AvaiableReward",
      id
    );
    try {
      await deleteDoc(rewardRef);
      setReward((prevRewards) => prevRewards.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting reward:", error);
    }
  };

  const handleReward = async (reward) => {
    if (!auth.currentUser) return console.error("User not authenticated");

    const rewardRef = doc(
      db,
      "users",
      auth.currentUser.uid,
      "AvaiableReward",
      reward.id
    );

    try {
      const docSnap = await getDoc(rewardRef);
      if (!docSnap.exists()) return alert("Reward not found!");

      setPoints((prevPoints) => {
        if (prevPoints < reward.cost) {
          alert("Not enough points to redeem this reward!");
          return prevPoints;
        }

        updateDoc(rewardRef, { gain: true })
          .then(() => {
            setReward((prevRewards) =>
              prevRewards.map((r) =>
                r.id === reward.id ? { ...r, gain: true } : r
              )
            );
          })
          .catch((error) => console.error("Error updating reward:", error));

        return prevPoints - reward.cost;
      });
    } catch (error) {
      console.error("Error processing reward:", error);
    }
  };

  const filteredRewards = showClaimedReward
    ? claimedRewardsList
    : rewards.filter((r) => !r.gain);

  const visibleRewards = filteredRewards.slice(0, 3);
  const extraRewards = filteredRewards.length > 3;

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
        {visibleRewards.map((reward) => (
          <div className="card" key={reward.id}>
            <p>
              {!showClaimedReward && (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDeleteItem(reward.id)}
                >
                  ❌
                </span>
              )}
              {reward.des}
            </p>
            <p style={{ color: "#86A788" }}>
              {showClaimedReward
                ? `Cost: ${reward.cost} points`
                : `Cost: ${reward.cost} points`}
            </p>
            {showClaimedReward ? (
              <p style={{ color: "green" }}>Claimed ✅</p>
            ) : (
              <button
                style={{
                  backgroundColor: "beige",
                  color: "gray",
                  border: "none",
                  padding: "8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={() => handleReward(reward)}
              >
                Get Reward
              </button>
            )}
          </div>
        ))}

        {extraRewards && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              marginTop: "10px",
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: "#ccc",
              border: "none",
              cursor: "pointer",
            }}
          >
            Show More
          </button>
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              maxHeight: "80vh",
              overflowY: "auto",
              width: "90%",
              maxWidth: "500px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ marginBottom: "10px" }}>
                {showClaimedReward
                  ? "Claimed Rewards"
                  : "All Available Rewards"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  marginTop: "10px",
                  padding: "8px",

                  backgroundColor: "lightcoral",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {filteredRewards.map((reward) => (
                <div
                  className="card"
                  key={reward.id}
                  style={{ marginBottom: "10px" }}
                >
                  <p>
                    {!showClaimedReward && (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteItem(reward.id)}
                      >
                        ❌
                      </span>
                    )}
                    {reward.des}
                  </p>
                  <p style={{ color: "#86A788" }}>Cost: {reward.cost} points</p>
                  {showClaimedReward ? (
                    <p style={{ color: "green" }}>Claimed ✅</p>
                  ) : (
                    <button
                      onClick={() => handleReward(reward)}
                      style={{
                        backgroundColor: "beige",
                        color: "gray",
                        border: "none",
                        padding: "8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Get Reward
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
