import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [sidebardata, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        setListings(data);
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, []);

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebardata, searchTerm: e.target.value });
    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData({
        ...sidebardata,
        [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }
    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebarData({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 8) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
<div className="w-full flex flex-row md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
  {/* Sidebar */}
<div className="w-md md:w-1/3 bg-white p-6 md:p-8 border-b md:border-b-0 md:border-r shadow-lg rounded-b-3xl md:rounded-tr-3xl md:rounded-br-3xl">
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Search Term */}
      <div>
        <label className="text-sm font-semibold text-gray-700">Search Term</label>
        <input
          type="text"
          placeholder="Search listings..."
          className="border rounded-xl p-3 w-full mt-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm font-sans"
          value={sidebardata.searchTerm}
          onChange={handleChange}
          id="searchTerm"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
        <div className="flex flex-wrap gap-4 font-sans">
          {['all', 'rent', 'sale', 'offer'].map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                id={type}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                onChange={handleChange}
                checked={sidebardata.type === type || (type === 'offer' && sidebardata.offer)}
              />
              <span className="capitalize">{type === 'all' ? 'Rent & Sale' : type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
        <div className="flex flex-wrap gap-4 font-sans">
          {['parking', 'furnished'].map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                id={amenity}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                onChange={handleChange}
                checked={sidebardata[amenity]}
              />
              <span className="capitalize">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Sort</label>
        <select
          onChange={handleChange}
          defaultValue={'created_at_desc'}
          id="sort-data"
          className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm font-sans"
        >
          <option value="regularPrice_desc">Price high to low</option>
          <option value="regularPrice_asc">Price low to high</option>
          <option value="createdAt_desc">Latest</option>
          <option value="createdAt_asc">Oldest</option>
        </select>
      </div>

      {/* Button */}
      <button className="bg-slate-700 text-white py-3 rounded-xl font-semibold uppercase tracking-wide hover:opacity-90 shadow-md transition font-sans">
        Search
      </button>

    </form>
  </div>

{/* Listings */}
<div className="w-sm md:w-2/3 p-6 md:p-8 font-sans"> 
   <h1 className="text-2xl font-serif font-bold text-gray-800 border-b pb-3 mb-6">
      Listing Results
    </h1>
    <div className="p-4 flex flex-wrap gap-6">
      {!loading && listings.length === 0 && (
        <p className="text-lg text-slate-700 text-center w-full">No listing found</p>
      )}

      {loading && (
        <p className="text-lg text-slate-700 text-center w-full">Loading...</p>
      )}

      {!loading &&
        listings &&
        listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}

      {showMore && (
        <button
          onClick={onShowMoreClick}
          className="text-indigo-600 hover:underline p-4 text-center w-full font-medium font-sans"
        >
          Show More
        </button>
      )}
    </div>
  </div>
</div>

  );
}
