import React from 'react'
import { Link , useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart , signInFailure , signInSuccess} from '../redux/user/userSlice';
import OAth from '../components/OAth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
const {loading , error } = useSelector((state)=> state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();  // 👈 ye missing tha

  const handleChange = (e) => {
    // form data is used to store whatever the user type
    setFormData({
      ...formData,   // keep previous values store
      [e.target.id]: e.target.value,  // update current input
    });

  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const res = await fetch('http://localhost:3000/api/auth/signIn',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
     dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/')
    } catch(err) {
     dispatch(signInFailure(err.message));
    }

  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100">

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h2>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" >Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" onChange={handleChange}
            />
          </div>

          {/* Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full py-2 rounded-xl font-semibold text-white shadow-md 
             bg-gradient-to-r from-indigo-500 to-blue-700 
             hover:from-indigo-700 hover:to-blue-800 
             transition duration-200"
          >
            {/* Sign Up */}
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <OAth/>
        </form>

        {/* Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <a href="/signUp" className="text-indigo-500 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}

