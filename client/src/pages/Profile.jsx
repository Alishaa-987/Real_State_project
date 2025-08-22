import React from 'react'
import { useSelector } from 'react-redux'
export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100">

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Profile
        </h1>

        {/* Form */}
        <form className="space-y-5 flex flex-col gap-4">
          {/* Profile Image */}
          <div className="flex justify-center">
            <img
              src={currentUser.avatar || currentUser.photoURL}
              alt="profile"
              className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
            />
          </div>

          <input
            type="text"
            placeholder="username"
            id="username"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />

          <input
            type="text"
            placeholder="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />

          <input
            type="text"
            placeholder="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />

          <button className="w-full py-2 rounded-xl font-semibold text-white shadow-md 
          bg-gradient-to-r from-indigo-500 to-blue-700 
          hover:from-indigo-700 hover:to-blue-800 
          transition duration-200">
            Update
          </button>
        </form>

        {/* Delete / Sign Out */}
        <div className="flex justify-between mt-5">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer">Sign Out</span>
        </div>
      </div>
    </div>
  );

}