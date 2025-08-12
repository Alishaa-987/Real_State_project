import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-slate-100 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-3">
        
        {/* Logo */}
        <h1 className="font-bold text-lg sm:text-2xl flex flex-wrap">
          <span className="text-indigo-500">Sahand </span>
          <span className="text-slate-800">Estate</span>
        </h1>

        {/* Search */}
        <form className="bg-slate-50 px-3 py-2 rounded-lg flex items-center border border-slate-200 shadow-sm">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-28 sm:w-64 text-slate-700 placeholder-slate-400"
          />
          <FaSearch className="text-slate-500 hover:text-indigo-500 transition-colors duration-200" />
        </form>

        {/* Navigation */}
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
          <Link to="/signIn">
            <li className="text-slate-700 hover:text-indigo-500 transition-colors">
              Sign In
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
