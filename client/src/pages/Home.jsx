import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import '../App.css'
SwiperCore.use([Navigation]);

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);



  return (
    <div className="bg-[#FAF9F6] font-[Inter]">
      {/* Hero Section */}
      <div className="relative h-[85vh] flex items-center justify-center text-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt="Luxury Home"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>

        <div className="z-10 px-6 md:px-12 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-[Playfair_Display] font-bold mb-6 leading-tight text-white">
            Modern Homes. Timeless Comfort.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Explore thoughtfully designed properties that bring elegance,
            serenity, and sophistication into everyday living.
          </p>
          <Link
            to="/search"
            className=" sm:hidden inline-block bg-white text-[#0F172A] px-10 py-4 rounded-full text-base font-semibold shadow-lg hover:bg-gray-200 transition-colors duration-300"
          >
            Start Exploring
          </Link>
        </div>
      </div>

      {/* Swiper Section */}
      <div className="max-w-7xl mx-auto mt-24">
        <Swiper
          navigation
          loop  // loop sirf tab chalega jab 1 se zyada slides hain
          spaceBetween={30}
          slidesPerView={1}
          className="rounded-3xl shadow-2xl border"
        >
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden">
                <img
                  src={listing.imageUrls[0]}
                  alt="listing"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h2 className="text-3xl md:text-4xl font-[Playfair_Display] font-semibold mb-2 drop-shadow-lg">
                    {listing.title}
                  </h2>
                  <p className="text-gray-200 max-w-md text-sm md:text-base">
                    {listing.address || "A perfect blend of luxury and modern living."}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Listings Section */}
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-12 space-y-24">
        {[{ title: "Recent Offers", desc: "Discover our latest handpicked listings.", listings: offerListings, link: "/search?offer=true" },
        { title: "For Rent", desc: "Find homes that fit your lifestyle and budget.", listings: rentListings, link: "/search?type=rent" },
        { title: "For Sale", desc: "Browse properties waiting for their perfect owner.", listings: saleListings, link: "/search?type=sale" }]
          .map(({ title, desc, listings, link }) => listings.length > 0 && (
            <div key={title}>
              {/* Heading always on left side */}
              <div className="mb-10">
                <h2 className="text-4xl font-[Playfair_Display] font-bold text-[#0F172A] mb-2">
                  {title}
                </h2>
                <p className="text-gray-600">{desc}</p>
                <Link
                  to={link}
                  className="mt-3 inline-block text-[#1E3A8A] font-medium hover:underline"
                >
                  View All →
                </Link>
              </div>

              {/* Cards grid wider */}
              {/* Cards grid wider */}
              <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {listings.map((listing) => (
                  <div
                    key={listing._id}
                    className="rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition duration-300"
                  >
                    <div className="h-72 w-full overflow-hidden">
                      <img
                        src={listing.imageUrls[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-[Playfair_Display] font-semibold text-gray-900 mb-3 truncate">
                        {listing.title}
                      </h3>
                      <p className="text-base text-gray-600 line-clamp-2 mb-4">
                        {listing.address || "Luxury modern property in a prime location."}
                      </p>
                      <Link
                        to={`/listing/${listing._id}`}
                        className="text-[#1E3A8A] font-medium hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
      </div>
    </div>)
}