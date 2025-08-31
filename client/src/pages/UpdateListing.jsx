import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    title: "",
    description: "",
    address: "",
    type: "rent",
    bedroom: 1,
    bathroom: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);

      try {
        const uploadedUrls = [];

        for (let i = 0; i < files.length; i++) {
          const data = new FormData();
          data.append("file", files[i]);
          data.append("upload_preset", "profile_preset");
          data.append("cloud_name", "dkukhmlxh");

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
        setImageUploadError("Image upload failed");
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload up to 6 images");
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");

      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "PUT",
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
        navigate(`/listing/${params.listingId}`);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-100">
      <h1 className="text-3xl font-bold text-left mb-6 text-gray-800 tracking-tight">
        Update Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
        {/* Left Side */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-gray-400 focus:outline-none"
            id="title"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            placeholder="Description"
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-gray-400 focus:outline-none"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
            rows={4}
          />
          <input
            type="text"
            placeholder="Address"
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-gray-400 focus:outline-none"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* Options */}
          <div className="flex gap-6 flex-wrap">
            {["sale", "rent", "parking", "furnished", "offer"].map((item) => (
              <label key={item} className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  id={item}
                  className="w-5 h-5 rounded-md border-gray-400"
                  onChange={handleChange}
                  checked={
                    item === "sale"
                      ? formData.type === "sale"
                      : item === "rent"
                      ? formData.type === "rent"
                      : formData[item]
                  }
                />
                <span className="capitalize font-medium">{item}</span>
              </label>
            ))}
          </div>

          {/* Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedroom"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-xl w-20"
                onChange={handleChange}
                value={formData.bedroom}
              />
              <p className="text-gray-600">Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathroom"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-xl w-20"
                onChange={handleChange}
                value={formData.bathroom}
              />
              <p className="text-gray-600">Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-xl w-28"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <p className="text-gray-600">Regular</p>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="1000000"
                  required
                  className="p-3 border border-gray-300 rounded-xl w-28"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <p className="text-gray-600">Discount</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold text-gray-800">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-3">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-3 border border-gray-300 rounded-xl w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-400 rounded-xl hover:bg-gray-100 transition disabled:opacity-70"
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
              className="flex justify-between p-2 border border-gray-300 rounded-xl items-center"
            >
              <img
                src={url}
                alt="listing"
                className="w-20 h-20 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="px-3 py-1 text-sm font-medium text-red-600 rounded-lg hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            disabled={loading || uploading}
            className="p-3 bg-gray-800 text-white rounded-xl uppercase font-medium hover:bg-gray-900 transition disabled:opacity-70"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
