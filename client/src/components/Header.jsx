import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = useSelector((state) => state.user.currentUser);
  const [showProfile, setShowProfile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white/70 backdrop-blur-xl shadow-md sticky top-0 z-50 border-b border-slate-200">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-8 py-4">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center">
          {/* Mobile Menu Button - Only visible on small screens */}
          <button
            className="md:hidden mr-3 text-slate-700"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          
          {/* Logo */}
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight flex items-center hover:scale-105 transition-transform duration-300">
              <span className="text-slate-800">Sahand</span>
              <span className="ml-1 text-slate-500">Estate</span>
            </h1>
          </Link>
        </div>

        {/* Search Bar - Visible on all screens */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 mx-4 md:mx-6 lg:mx-8 bg-gradient-to-r from-slate-100 to-slate-200 px-3 sm:px-5 py-2 rounded-full items-center shadow-md border border-slate-300 focus-within:ring-2 focus-within:ring-slate-500 transition hover:shadow-lg hidden sm:flex"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none flex-1 text-slate-700 placeholder-slate-400 text-xs sm:text-base font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="ml-1 sm:ml-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 cursor-pointer text-base sm:text-xl" />
          </button>
        </form>

        {/* Desktop Navigation - Always visible on large screens */}
        <div className="hidden md:flex items-center gap-6 text-base font-medium">
          <Link
            to="/"
            className="text-slate-700 hover:text-slate-900 transition-colors duration-200 font-semibold"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-slate-700 hover:text-slate-900 transition-colors duration-200 font-semibold"
          >
            About
          </Link>
          
          {currentUser && showProfile ? (
            <Link to="/profile">
              <img
                src={currentUser.avatar || currentUser.photoURL}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-500 shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 border-2 border-white"
                alt="profile"
              />
            </Link>
          ) : (
            <Link
              to="/signin"
              className="px-8 py-6 bg-slate-800 text-white hover:bg-slate-900 transition-colors duration-300 shadow-md"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Search and Profile - Only visible on mobile */}
        <div className="flex md:hidden items-center gap-4">
          {/* Mobile Search Icon */}
          <Link to="/search" className="text-slate-700">
            <FaSearch size={24} />
          </Link>
          
          {/* Mobile Profile */}
          {currentUser && showProfile ? (
            <Link to="/profile">
              <img
                src={currentUser.avatar || currentUser.photoURL}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-500 shadow-md"
                alt="profile"
              />
            </Link>
          ) : (
            <Link
              to="/signin"
              className="px-6 py-3 rounded-full bg-slate-800 text-white hover:bg-slate-900 transition-colors duration-300 shadow-md text-xs"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu - Only visible on mobile when menu is open */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200">
          <div className="px-4 py-4 flex flex-col space-y-4">
            <form
              onSubmit={handleSubmit}
              className="flex bg-gradient-to-r from-slate-100 to-slate-200 px-4 py-2 rounded-full items-center shadow-md border border-slate-300 focus-within:ring-2 focus-within:ring-slate-500 transition w-full"
            >
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent focus:outline-none flex-1 text-slate-700 placeholder-slate-400 text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">
                <FaSearch className="ml-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 cursor-pointer text-lg" />
              </button>
            </form>
            
            <Link
              to="/"
              className="text-slate-700 hover:text-slate-900 text-lg transition-colors duration-200 font-semibold py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            <Link
              to="/about"
              className="text-slate-700 hover:text-slate-900 text-lg transition-colors duration-200 font-semibold py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;