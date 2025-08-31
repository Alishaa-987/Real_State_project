import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInFailure, signInSuccess } from "../redux/user/userSlice";
import OAth from "../components/OAth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const res = await fetch("http://localhost:3000/api/auth/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md border border-slate-200">
        {/* Heading */}
        <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-6">
          Welcome Back
        </h2>
        {/* <p className="text-center text-slate-500 mb-8 text-sm">
          Sign in to access your personalized dashboard and explore luxury listings.
        </p> */}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-slate-300 rounded-2xl 
                         focus:ring-2 focus:ring-slate-600 focus:border-slate-600 
                         transition shadow-sm"
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-slate-300 rounded-2xl 
                         focus:ring-2 focus:ring-slate-600 focus:border-slate-600 
                         transition shadow-sm"
              onChange={handleChange}
            />
          </div>

          {/* Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 rounded-2xl font-semibold text-white shadow-lg 
                       bg-gradient-to-r from-slate-800 to-slate-600 
                       hover:from-slate-900 hover:to-slate-700 
                       transition duration-300"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>

          {/* OAuth */}
          <OAth />
        </form>

        {/* Link */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signUp"
            className="text-slate-800 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 mt-4 text-sm font-medium">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
