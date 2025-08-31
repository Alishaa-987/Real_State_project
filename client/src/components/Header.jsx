import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = useSelector((state) => state.user.currentUser);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser) setShowProfile(true);
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  return (
    <header className="bg-white/70 backdrop-blur-xl shadow-md sticky top-0 z-50 border-b border-slate-200">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-8 py-4">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight flex items-center hover:scale-105 transition-transform duration-300">
            <span className="text-slate-800">Sahand</span>
            <span className="ml-1 text-slate-500">Estate</span>
          </h1>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-r from-slate-100 to-slate-200 px-3 sm:px-5 py-2 rounded-full flex items-center shadow-md border border-slate-300 focus-within:ring-2 focus-within:ring-slate-500 transition w-28 sm:w-72 hover:shadow-lg"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none flex-1 text-slate-700 placeholder-slate-400 text-xs sm:text-base font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="hidden sm:inline ml-1 sm:ml-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 cursor-pointer text-base sm:text-xl" />
          </button>
        </form>

        {/* Navigation */}
        <ul className="flex items-center gap-3 sm:gap-4 text-xs sm:text-base font-medium">
          {/* Home & About only visible on sm+ screens */}
          <li className="hidden sm:flex hidden:md-flex">
            <Link
              to="/"
              className="text-slate-700 hover:text-slate-900 text-base sm:text-lg transition-colors duration-200 font-semibold"
            >
              Home
            </Link>
          </li>

          {/* About visible only sm+ */}
          <li className="hidden sm:flex">
            <Link
              to="/about"
              className="text-slate-700 hover:text-slate-900 text-base sm:text-lg transition-colors duration-200 font-semibold"
            >
              About
            </Link>
          </li>
          {/* SignIn / Profile Avatar */}
          <li>
            {currentUser && showProfile ? (
              <Link to="/profile">
                <img
                  src={currentUser.avatar || currentUser.photoURL}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-slate-500 shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 border-2 border-white"
                  alt="profile"
                />
              </Link>
            ) : (
              <Link
                to="/signin"
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-800 text-white hover:bg-slate-900 transition-colors duration-300 shadow-md text-xs sm:text-base"
              >
                Sign In
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
