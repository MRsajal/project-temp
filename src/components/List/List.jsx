import React, { useState, useEffect } from "react";
import "./List.css";
import { NavLink } from "react-router";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function List() {
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
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div className="show finisher-header">
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
      <div className="todo-list" style={{ display: "grid" }}>
        <div className="positive">
          <h3>Good Habits </h3>
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
              setPoints={setPoints}
              setDoneTask={setDoneTask}
              setTotalTask={setTotalTask}
            />
          ) : (
            <ShowGoodHabit
              goodHabit={goodHabitWeekly}
              setGoodHabit={setGoodHabitWeekly}
              setPoints={setPoints}
              setDoneTask={setDoneTaskWeekly}
              setTotalTask={setTotalTaskWeekly}
            />
          )}
        </div>
        <div className="negative">
          <h3>Bad Habits </h3>
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
            />
          ) : (
            <ShowBadHabit
              badHabit={badHabitWeekly}
              setBadHabit={setBadHabitWeekly}
              setPoints={setPoints}
            />
          )}
        </div>
        <div className="reward">
          <h3>Reward</h3>
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

function ShowGoodHabit({
  goodHabit,
  setGoodHabit,
  setPoints,
  setDoneTask,
  setTotalTask,
}) {
  function handlePoint(id) {
    let addPoint = 0;

    setGoodHabit((goodHabit) =>
      goodHabit.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
    for (let i = 0; i < goodHabit.length; i++) {
      if (goodHabit[i].id === id) {
        if (goodHabit[i].done === false) {
          addPoint = goodHabit[i].point;
          setDoneTask((s) => s + 1);
        } else {
          addPoint = -goodHabit[i].point;
        }
        setPoints((s) => s + addPoint);
      }
    }
  }
  function handleDeleteItem(id) {
    setGoodHabit((goodHabit) => goodHabit.filter((item) => item.id !== id));
    setTotalTask((s) => s - 1);
  }
  return (
    <div className="card-container">
      {goodHabit.map((habits) =>
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
              onClick={() => handlePoint(habits.id)}
            >
              Complete habit
            </button>
          </div>
        )
      )}
    </div>
  );
}
function ShowBadHabit({ badHabit, setBadHabit, setPoints }) {
  function handlePoint(id) {
    let addPoint = 0;

    setBadHabit((badHabit) =>
      badHabit.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
    for (let i = 0; i < badHabit.length; i++) {
      if (badHabit[i].id === id) {
        if (badHabit[i].done === true) {
          addPoint = badHabit[i].point;
        } else {
          addPoint = -badHabit[i].point;
        }
        setPoints((s) => s + addPoint);
      }
    }
  }
  function handleDeleteItem(id) {
    setBadHabit((badHabit) => badHabit.filter((item) => item.id !== id));
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
              onClick={() => handlePoint(habits.id)}
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
  const [claimedReward, setClaimedReward] = useState([]);
  const [showClaimedReward, setShowClaimedReward] = useState(false);
  function handleDeleteItem(id) {
    setReward((rewards) => rewards.filter((item) => item.id !== id));
  }
  function handleReward(reward) {
    setPoints((s) => {
      if (s - reward.cost >= 0) {
        setClaimedReward((prev) => [...prev, reward]);
        setReward((prevRewards) =>
          prevRewards.map((r) =>
            r.id === reward.id ? { ...r, gain: true } : r
          )
        );
        return s - reward.cost;
      } else {
        alert("Not enough points to redeem this reward!");
        return s; // Keep points unchanged
      }
    });
  }

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
          claimedReward.length > 0 ? (
            claimedReward.map((rewards) => (
              <div className="card" key={rewards.id}>
                <p>{rewards.des}</p>
                <p style={{ color: "#86A788" }}>Cost: {rewards.cost} points</p>
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
