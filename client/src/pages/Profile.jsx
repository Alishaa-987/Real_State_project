import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice.js';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    avatar: currentUser?.avatar || ""
  });

  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Upload avatar
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "profile_preset");
    data.append("cloud_name", "dkukhmlxh");

    try {
      setUploading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dkukhmlxh/image/upload`,
        { method: "POST", body: data }
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
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signOut');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch {
      setShowListingError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) return;
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '480px', border: '1px solid #e5e7eb' }}>

        {/* Heading */}
        <h2 style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center', color: '#1e293b', marginBottom: '2rem' }}>
          My Profile
        </h2>

        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <img
            src={formData?.avatar || "https://via.placeholder.com/150"}
            alt="avatar"
            style={{ width: '7rem', height: '7rem', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.75rem', border: '1px solid #d1d5db', cursor: 'pointer' }}
            onClick={() => fileInputRef.current.click()}
          />
          <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileChange} />
          {uploading && <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Uploading...</p>}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'Arial, sans-serif' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'Arial, sans-serif' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid #d1d5db', outline: 'none', paddingRight: '2.5rem', fontFamily: 'Arial, sans-serif' }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#4b5563' }}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <button
            disabled={loading || uploading}
            type="submit"
            style={{
              width: '100%',
              padding: '0.625rem',
              borderRadius: '0.75rem',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(to right, #374151, #111827)',
              cursor: loading || uploading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading || uploading ? "Updating..." : "Update Profile"}
          </button>

          <Link
            to="create-listing"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              padding: '0.625rem',
              borderRadius: '0.75rem',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(to right, #059669, #047857)',
              textDecoration: 'none',
              marginTop: '0.5rem',
            }}
          >
            Create Listing
          </Link>
        </form>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', padding: '0 0.25rem' }}>
          <p onClick={handleDeleteUser} style={{ color: '#dc2626', cursor: 'pointer', fontWeight: 500 }}>Delete Account</p>
          <p onClick={handleSignOut} style={{ color: '#dc2626', cursor: 'pointer', fontWeight: 500 }}>Sign Out</p>
        </div>

        {/* Messages */}
        {updateSuccess && (
          <p style={{ color: '#16a34a', textAlign: 'center', marginTop: '1rem', fontWeight: 500 }}>
            Profile updated successfully!
          </p>
        )}
        <button onClick={handleShowListings} style={{ color: '#374151', marginTop: '1rem', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          Show Listings
        </button>
        <p style={{ color: '#dc2626', textAlign: 'center', marginTop: '0.75rem' }}>
          {showListingError ? "Error showing listings" : ""}
        </p>

        {/* Listings */}
        {userListings && userListings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <h1 style={{ textAlign: 'left', fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>Your Listings</h1>
            {userListings.map((listing) => (
              <div key={listing._id} style={{ border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', backgroundColor: '#f9fafb' }}>
                <Link to={`/listing/${listing._id}`}>
                  <img src={listing.imageUrls[0]} alt="listing cover" style={{ height: '5rem', width: '7rem', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid #d1d5db' }} />
                </Link>
                <Link to={`/listing/${listing._id}`} style={{ flex: 1, color: '#374151', fontWeight: 500, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <p>{listing.title}</p>
                </Link>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center' }}>
                  <button onClick={() => handleDeleteListing(listing._id)} style={{ color: '#dc2626', fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer' }}>Delete</button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button style={{ color: '#059669', fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
