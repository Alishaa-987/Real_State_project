
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

function Header() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setShowProfile(true);
    }
  }, [currentUser]);

  // ✅ JSX return MUST be inside the function
  return (
    <header className="bg-slate-100 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-3">
        <h1 className="font-bold text-lg sm:text-2xl flex flex-wrap">
          <span className="text-indigo-500">Real </span>
          <span className="text-slate-800">Estate</span>
        </h1>

        <form className="bg-slate-50 px-3 py-2 rounded-lg flex items-center border border-slate-200 shadow-sm">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-28 sm:w-64 text-slate-700 placeholder-slate-400"
          />
          <FaSearch className="text-slate-500 hover:text-indigo-500 transition-colors duration-200" />
        </form>

        <ul className="flex gap-5 text-sm font-medium items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:text-indigo-500 transition-colors">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:text-indigo-500 transition-colors">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser && showProfile ? (
              <li>
                <img
                  src={currentUser.avatar || currentUser.photoURL}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="profile"
                />
              </li>
            ) : (
              <li className="text-slate-700 hover:text-indigo-500 transition-colors">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
