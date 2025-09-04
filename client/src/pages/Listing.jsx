import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import { useState, useEffect } from "react";
import "swiper/css/bundle";
import "../App.css";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
SwiperCore.use([Navigation]);

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        // const res = await fetch(`/api/listing/get/${params.listingId}`);
// This is the correct way to make the fetch call
const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen">
      {loading && (
        <p className="text-center my-10 text-2xl text-gray-500 animate-pulse">
          Loading...
        </p>
      )}
      {error && (
        <p className="text-center my-10 text-2xl text-red-600">
          Something went wrong!
        </p>
      )}

      {listing && !loading && !error && (
        <div className="max-w-6xl mx-auto py-8 px-4">
          {/* Swiper / Image gallery */}
          <Swiper
            navigation
            className="rounded-2xl shadow-xl overflow-hidden mb-10"
          >
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <img
                  src={url}
                  alt="listing"
                  className="w-full h-[550px] object-cover rounded-2xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share button */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-md cursor-pointer hover:scale-110 transition">
            <FaShare
              className="text-slate-600"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-lg bg-white shadow-lg px-3 py-1 text-sm text-gray-700">
              Link copied!
            </p>
          )}

          {/* Listing details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-5">
            {/* Title & Price */}
            <h1 className="text-3xl font-bold text-gray-900">{listing.name}</h1>
            <p className="text-xl font-semibold text-indigo-600">
              {listing.offer
                ? (listing.regularPrice - listing.discountPrice).toLocaleString(
                    "en-US"
                  )
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>

            {/* Address */}
            <p className="flex items-center mt-2 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>

            {/* Badges */}
            <div className="flex gap-3 mt-3 flex-wrap">
              <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm shadow-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </span>
              {listing.offer && (
                <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm shadow-md">
                  ${+listing.discountPrice} OFF
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 mt-4 leading-relaxed">
              <span className="font-semibold text-gray-900">
                Description -{" "}
              </span>
              {listing.description}
            </p>

            {/* Features */}
            <ul className="flex flex-wrap items-center gap-5 sm:gap-8 text-gray-800 font-medium text-sm mt-5">
              <li className="flex items-center gap-2">
                <FaBed className="text-lg text-indigo-600" />
                {listing.bedroom > 1
                  ? `${listing.bedroom} beds`
                  : `${listing.bedroom} bed`}
              </li>
              <li className="flex items-center gap-2">
                <FaBath className="text-lg text-indigo-600" />
                {listing.bathroom > 1
                  ? `${listing.bathroom} baths`
                  : `${listing.bathroom} bath`}
              </li>
              <li className="flex items-center gap-2">
                <FaParking className="text-lg text-indigo-600" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-2">
                <FaChair className="text-lg text-indigo-600" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>

            {/* Contact */}
            {currentUser && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-xl uppercase hover:opacity-95 p-3 mt-6 font-semibold shadow-md transition"
              >
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
