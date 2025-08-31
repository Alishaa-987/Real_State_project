import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden w-full sm:w-[340px] transition-all duration-300 border border-gray-100">
      <Link to={`/listing/${listing._id}`}>
        {/* Image */}
        <div className="overflow-hidden">
          <img
            src={
              listing.imageUrls[0] ||
              "https://wallpapercave.com/wp/wp7774249.jpg"
            }
            alt="Listing Image"
            className="h-[260px] w-full object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3">
          {/* Title */}
          <p className="text-lg font-semibold truncate text-gray-800">
            {listing.title}
          </p>

          {/* Address */}
          <div className="flex items-center gap-1 text-gray-600">
            <MdLocationOn className="h-5 w-5 text-blue-600" />
            <p className="text-sm truncate">{listing.address}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2">
            {listing.description}
          </p>

          {/* Price */}
          <p className="text-blue-600 mt-2 font-bold text-base">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " /month"}
          </p>

          {/* Beds & Baths */}
          <div className="text-gray-700 flex gap-6 mt-2 text-sm font-semibold">
            <span>
              {listing.bedroom > 1
                ? `${listing.bedroom} Beds`
                : `${listing.bedroom} Bed`}
            </span>
            <span>
              {listing.bathroom > 1
                ? `${listing.bathroom} Baths`
                : `${listing.bathroom} Bath`}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ListingItem;
