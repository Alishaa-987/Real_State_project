import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: "",
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🟢 IMAGE UPLOAD TO CLOUDINARY
  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);

      try {
        const uploadedUrls = [];

        for (let i = 0; i < files.length; i++) {
          const data = new FormData();
          data.append("file", files[i]);
          data.append("upload_preset", "profile_preset"); // 🔴 apna preset daalna
          data.append("cloud_name", "dkukhmlxh"); // 🔴 apna cloud_name daalna

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dkukhmlxh/image/upload",
            {
              method: "POST", 
              body: data,
            }
          );

          const uploadedImage = await res.json();

          if (uploadedImage.secure_url) {
            uploadedUrls.push(uploadedImage.secure_url);
          }
        }

        setFormData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls.concat(uploadedUrls),
        }));

        setUploading(false);
      } catch (err) {
        console.error(err);
        setImageUploadError("⚠️ Image upload failed");
        setUploading(false);
      }
    } else {
      setImageUploadError("⚠️ You can only upload up to 6 images");
      setUploading(false);
    }
  };

  // 🟢 IMAGE REMOVE FUNCTION
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // 🟢 INPUT CHANGE HANDLER
  // const handleChange = (e) => {
  //   if (e.target.id === "sale" || e.target.id === "rent") {
  //     setFormData({ ...formData, type: e.target.id });
  //   }

  //   if (
  //     e.target.id === "parking" ||
  //     e.target.id === "furnished" ||
  //     e.target.id === "offer"
  //   ) {
  //     setFormData({ ...formData, [e.target.id]: e.target.checked });
  //   }

  //   if (
  //     e.target.type === "number" ||
  //     e.target.type === "text" ||
  //     e.target.type === "textarea"
  //   ) {
  //     setFormData({ ...formData, [e.target.id]: e.target.value });
  //   }
  // };
const handleChange = (e) => {
  const { id, type, value, checked } = e.target;

  if (id === "sale" || id === "rent") {
    setFormData({ ...formData, type: id });
  } else if (type === "checkbox") {
    setFormData({ ...formData, [id]: checked });
  } else if (type === "number") {
    setFormData({ ...formData, [id]: Number(value) });
  } else {
    setFormData({ ...formData, [id]: value });
  }
};

  // 🟢 FORM SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("⚠️ You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("⚠️ Discount price must be lower than regular price");

      setLoading(true);
      setError(false);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // 🟢 RETURN UI
  return (
    <main className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-slate-700">
        Create a Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-6"
      >
        {/* Left Side */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* Options */}
          <div className="flex gap-4 flex-wrap">
            {["sale", "rent", "parking", "furnished", "offer"].map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={item}
                  className="w-5 h-5"
                  onChange={handleChange}
                  checked={
                    item === "sale"
                      ? formData.type === "sale"
                      : item === "rent"
                      ? formData.type === "rent"
                      : formData[item]
                  }
                />
                <span className="capitalize">{item}</span>
              </label>
            ))}
          </div>

          {/* Numbers */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10000000"
                required
                className="p-3 border rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <p>RegularPrice</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="1000000"
                required
                className="p-3 border rounded-lg"
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <p>Discounted Price</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-3 border rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded-lg hover:bg-green-50 disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {imageUploadError && (
            <p className="text-red-600 text-sm">{imageUploadError}</p>
          )}

          {formData.imageUrls.map((url, index) => (
            <div
              key={url}
              className="flex justify-between p-2 border rounded-lg items-center"
            >
              <img
                src={url}
                alt="listing"
                className="w-20 h-20 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-2 text-red-600 rounded-lg hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
