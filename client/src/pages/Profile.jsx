
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);

  // Function to open file picker
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Function to handle selected file and preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };

  // Function to upload image to Cloudinary
  const handleUpload = async () => {
    if (!image) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "profile_preset"); // create free preset in Cloudinary

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dkukhmlxh/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      console.log("Uploaded URL:", data.secure_url);

      // TODO: Save URL in your Redux store or MongoDB
      // dispatch(updateUserAvatar(data.secure_url));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100">

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Profile
        </h1>

        {/* Form */}
        <form className="space-y-5 flex flex-col gap-4">
          <input
            type='file'
            ref={fileInputRef}
            hidden
            accept='image/*'
            onChange={handleFileChange}
          />

          {/* Profile Image */}
          <div className="flex justify-center">
            <img
              src={preview || currentUser.avatar || currentUser.photoURL}
              alt="profile"
              className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
              onClick={handleImageClick}
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
