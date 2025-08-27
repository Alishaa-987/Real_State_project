import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {   signInStart } from '../redux/user/userSlice';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice.js';
import { deleteUserFailure , deleteUserStart , deleteUserSuccess } from '../redux/user/userSlice.js';
import { signOutUserFailure , signOutUserSuccess, signOutUserStart } from '../redux/user/userSlice';
import { set } from 'mongoose';

export default function Profile() {
  const { currentUser ,loading, error } = useSelector((state) => state.user);
  const [updateSuccess , setUpdateSuccess] = useState(false); // 🔹 new state for success message
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    avatar: currentUser?.avatar || "" // 🔹 add avatar to state
  });

  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  // const {currentUser} = useSelector((state) => state.user);

  // Handle file upload to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "profile_preset"); // 🔹 replace with your Cloudinary preset
    data.append("cloud_name", "dkukhmlxh"); // 🔹 replace with your Cloudinary cloud name

    try {
      setUploading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dkukhmlxh/image/upload`,
        {
          method: "POST",
          body: data
        }
      );
      const uploaded = await res.json();
      setFormData({ ...formData, avatar: uploaded.secure_url });
      setUploading(false);
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      setUploading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true); // 🔹 set success message
// dispatch(updateUserSuccess({ ...currentUser, photoURL: downloadURL }));

    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };


const handleDeleteUser = async () => {
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
      credentials:"include",
    });

    const data = await res.json();
    if (data.success === false){
      dispatch(deleteUserFailure(data.message));
      return;
    }

    dispatch(deleteUserSuccess(data)); // clears redux user state
  } catch (err) {
    dispatch(deleteUserFailure(err.message));
    console.error(err);
  }
};
  const handleSignOut = async ()=>{
    try{
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signOut');
      const data = await res.json();
      if (data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    }catch(error){
        dispatch(signOutUserFailure(error.message));
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100">
        
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Profile
        </h2>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={formData.avatar || "https://via.placeholder.com/150"}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover mb-2 cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          />
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Password with toggle */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 cursor-pointer text-sm text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            disabled={loading || uploading}
            type="submit"
            className="w-full py-2 rounded-xl font-semibold text-white shadow-md 
              bg-gradient-to-r from-indigo-500 to-blue-700 
              hover:from-indigo-700 hover:to-blue-800 
              transition duration-200 disabled:opacity-50"
          >
            {loading || uploading ? "Loading..." : "Update Profile"}
          </button>
        </form>
      <div className='flex flex-row justify-between p-3 font-stretch-normal'>
        <p onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</p>
        <p onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</p>
      </div>
        {/* Error */}
        {/* {error && <p className="text-red-500 text-center mt-4">{error}</p>} */}
        {updateSuccess && <p className="text-green-500 text-center mt-4">Profile updated successfully!</p>}
      </div>
    </div>
  )

};
