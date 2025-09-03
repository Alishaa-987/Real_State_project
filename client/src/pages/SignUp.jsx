import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAth from "../components/OAth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.CLIENT_URL}/auth/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);

      // Flag to detect fresh signup
      localStorage.setItem("justSignedUp", "true");
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md border border-slate-200">
        {/* Heading */}
        <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-6">
          Create Account
        </h2>
        {/* <p className="text-center text-slate-500 mb-8 text-sm">
          Join our community and start exploring premium real estate listings.
        </p> */}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-slate-300 rounded-2xl 
                         focus:ring-2 focus:ring-slate-600 focus:border-slate-600 
                         transition shadow-sm"
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">
              Email
            </label>
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
            <label className="block text-slate-700 text-sm font-medium mb-1">
              Password
            </label>
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
            {loading ? "Loading..." : "Sign Up"}
          </button>

          {/* OAuth */}
          <OAth />
        </form>

        {/* Link */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-slate-800 font-medium hover:underline"
          >
            Sign In
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
