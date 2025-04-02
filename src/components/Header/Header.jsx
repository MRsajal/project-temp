// import React from "react";
// import "./Header.css";
// import { NavLink } from "react-router";

// export default function Header() {
//   return (
//     <div className="header">
//       <nav className="topnav">
//         <ul>
//           <li>
//             <NavLink
//               to="/"
//               className={({ isActive }) => `${isActive ? "active" : ""}`}
//             >
//               Home
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/list"
//               className={({ isActive }) => `${isActive ? "active" : ""}`}
//             >
//               List
//             </NavLink>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// }
import React from "react";
import { Link, useNavigate } from "react-router";
// import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import "./Header.css";
import { useAuth } from "../../context/authContext";

const Header = () => {
  const navigate = useNavigate();
  const authContext = useAuth(); // Debugging step
  console.log("AuthContext:", authContext); // Check if this logs correctly

  if (!authContext) {
    return null; // Prevent rendering if context is missing
  }

  const { userLoggedIn } = authContext;

  return (
    <nav className="flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200">
      {userLoggedIn ? (
        <button
          onClick={() => {
            doSignOut().then(() => navigate("/login"));
          }}
          className="text-sm text-blue-600 underline"
        >
          Logout
        </button>
      ) : (
        <>
          <Link className="text-sm text-blue-600 underline" to={"/login"}>
            Login
          </Link>
          <Link className="text-sm text-blue-600 underline" to={"/register"}>
            Register New Account
          </Link>
        </>
      )}
    </nav>
  );
};

export default Header;
