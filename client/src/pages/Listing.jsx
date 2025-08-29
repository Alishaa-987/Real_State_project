import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import { useState, useEffect } from 'react';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
// import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
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
        const res = await fetch(`/api/listing/get/${params.listingId}`);
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
          <Swiper navigation className="rounded-xl shadow-lg overflow-hidden mb-8">
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <img
                  src={url}
                  alt="listing"
                  className="w-full h-[550px] object-cover rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share button */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-md cursor-pointer hover:scale-110 transition">
            <FaShare
              className="text-slate-500"
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
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-white shadow-md p-2">
              Link copied!
            </p>
          )}

          {/* Listing details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
            <p className="text-2xl font-bold text-gray-800">
              {listing.name} - ${' '}
              {/* {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')} */}
              {listing.offer
                ? (listing.regularPrice - listing.discountPrice).toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}

              {listing.type === 'rent' && ' / month'}

              {/* {listing.offer ? (
                <>
                  <span className="text-red-600">${listing.discountPrice.toLocaleString('en-US')}</span>
                  <span className="line-through text-gray-500 ml-2">${listing.regularPrice.toLocaleString('en-US')}</span>
                </>
              ) : (
                <span>${listing.regularPrice.toLocaleString('en-US')}</span>
              )} */}

              {/* {listing.offer && (
            <span>${listing.regularPrice - listing.discountPrice} OFF</span>
              )} */}
            </p>

            <p className="flex items-center mt-2 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>

            {/* Badges */}
            <div className="flex gap-4 mt-2 flex-wrap">
              <p className="bg-red-600 text-white px-4 py-1 rounded-full shadow-sm">
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className="bg-green-600 text-white px-4 py-1 rounded-full shadow-sm">
                  ${+listing.discountPrice} OFF
                </p>
              )}

            </div>
            {/* Description */}
            <p className="text-gray-700 mt-4">
              <span className="font-semibold text-gray-900">Description - </span>
              {listing.description}
            </p>

            {/* Features */}
            <ul className="flex flex-wrap items-center gap-4 sm:gap-6 text-green-900 font-semibold text-sm mt-3">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedroom > 1
                  ? `${listing.bedroom} beds`
                  : `${listing.bedroom} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathroom > 1
                  ? `${listing.bathroom} baths`
                  : `${listing.bathroom} bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>

            {/* Contact landlord */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-4 transition"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
