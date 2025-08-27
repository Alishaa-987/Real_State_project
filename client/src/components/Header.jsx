
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

  // JSX return MUST be inside the function
  return (
  <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
    <div className="flex justify-between items-center max-w-7xl mx-auto px-5 py-4">
      {/* Logo */}
      <h1 className="font-medium text-xl sm:text-3xl tracking-tight flex flex-wrap">
        <span className="text-indigo-600">Real </span>
        <span className="text-slate-900">Estate</span>
      </h1>

      {/* Search */}
      <form className="bg-slate-50 px-4 py-2 rounded-full flex items-center border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 transition">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none w-28 sm:w-64 text-slate-700 placeholder-slate-400 text-sm sm:text-base"
        />
        <FaSearch className="ml-2 text-slate-500 hover:text-indigo-600 transition-colors duration-200 cursor-pointer" />
      </form>

      {/* Navigation */}
      <ul className="flex gap-6 text-sm sm:text-base font-medium items-center">
        <Link to="/">
          <li className="hidden sm:inline text-slate-700 hover:text-indigo-600 transition-colors duration-200">
            Home
          </li>
        </Link>
        <Link to="/about">
          <li className="hidden sm:inline text-slate-700 hover:text-indigo-600 transition-colors duration-200">
            About
          </li>
        </Link>
        <Link to="/profile">
          {currentUser && showProfile ? (
            <li>
              <img
                src={currentUser.avatar || currentUser.photoURL}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500 hover:scale-105 transition-transform duration-200"
                alt="profile"
              />
            </li>
          ) : (
            <li className="text-slate-700 hover:text-indigo-600 transition-colors duration-200">
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
