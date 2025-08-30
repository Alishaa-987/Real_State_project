import { useNavigate } from 'react-router-dom';
import {useState , useEffect} from 'react'
import ListingItem from '../components/ListingItem';
import { set } from 'mongoose';

export default function Search() {
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const navigate = useNavigate();
    const [showMore , setShowMore] = useState(false);
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
            searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl
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
                if (data.length > 8){
                    setShowMore(true);
                }else{
                    setShowMore(false);
                }
            } catch (error) {
                console.error("Error fetching listings:", error);
                setListings([]);
            } finally {
                setLoading(false);
            }

        }

        fetchListing();
    }, [location.search]);

    console.log(sidebardata);

    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebarData({ ...sidebardata, type: e.target.id });
        }
        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebardata, searchTerm: e.target.value });
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebarData({ ...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
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

    const onShowMoreClick = async()=>{
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 8){
            setShowMore(false);
        }
        setListings([...listings , ...data]);
    }
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Sidebar (30%) */}
            <div className="w-1/3 bg-white p-8 border-r shadow-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Search */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Search Term
                        </label>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={sidebardata.searchTerm}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Type
                        </label>
                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id='all'
                                    className="w-5 h-5 text-indigo-600 rounded"
                                    onChange={handleChange}
                                    checked={sidebardata.type === 'all'}
                                />
                                <span>Rent & Sale</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox"
                                    id='rent'
                                    className="w-5 h-5 text-indigo-600 rounded"
                                    onChange={handleChange}
                                    checked={sidebardata.type === 'rent'}
                                />
                                <span>Rent</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox"
                                    id='sale'
                                    className="w-5 h-5 text-indigo-600 rounded"
                                    onChange={handleChange}
                                    checked={sidebardata.type === 'sale'}
                                />
                                <span>Sale</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox"
                                    id='offer'
                                    className="w-5 h-5 text-indigo-600 rounded"
                                    onChange={handleChange}
                                    checked={sidebardata.offer}
                                />
                                <span>Offer</span>
                            </label>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Amenities
                        </label>
                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox"
                                    id='parking'
                                    className="w-5 h-5 text-indigo-600 rounded"
                                    onChange={handleChange}
                                    checked={sidebardata.parking}
                                />
                                <span>Parking</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id='furnished'
                                    className="w-5 h-5 text-indigo-600 rounded"
                                    onChange={handleChange}
                                    checked={sidebardata.furnished}
                                />
                                <span>Furnished</span>
                            </label>
                        </div>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Sort
                        </label>
                        <select
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                            id='sort-data'

                            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to high</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>

                    {/* Search Button */}
                    <button className="bg-indigo-600 text-white py-3 rounded-lg font-semibold uppercase tracking-wide hover:bg-indigo-700 shadow transition">
                        Search
                    </button>
                </form>
            </div>

            {/* Right Section (70%) */}
            <div className="w-2/3 p-8 bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-800 border-b pb-3">
                    Listing Results:
                </h1>
                {/* Khali rakha gaya */}
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700 text-center'>No listing Found</p>
                    )}
                    {
                        loading && (
                            <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                        )
                    }

                    {
                        !loading &&
                        listings &&
                        listings.map((listing) => <ListingItem key={listing._id} listing={listing} />)
                    }

                    {
                        showMore && (
                            <button onClick={onShowMoreClick} 
                            className='text-green-700 hover:underline p-7 text-center w-full'>Show More</button>
                        )
                    }
                </div>
            </div>
        </div>
    );
}