import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const SearchFreelancers = () => {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(API_PATH.GIGS.GET_ALL);
                if (res.data?.gigs) {
                    setGigs(res.data.gigs);
                } else {
                    setGigs([]);
                }
            } catch (err) {
                console.error("Failed to fetch gigs", err);
                setError("Failed to load gigs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchGigs();
    }, []);

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header / Search Area */}
            <div className="bg-black rounded-2xl p-8 sm:p-12 text-center shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white relative z-10 mb-4">
                    Explore <span className="italic font-light">Freelance Gigs</span>
                </h1>
                <p className="text-gray-300 relative z-10 max-w-2xl mx-auto">
                    Discover top talent and amazing services to help your business grow.
                </p>
                {/* Search Bar Placeholder for Future Integration */}
                <div className="mt-8 max-w-xl mx-auto relative z-10">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Search for services..."
                            className="w-full bg-white text-black px-6 py-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                            disabled
                        />
                        <button className="absolute right-2 bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors" disabled>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Search functionality coming soon</p>
                </div>
            </div>

            {/* Gigs List */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold font-serif text-gray-900">All Available Services</h2>
                    <span className="text-sm text-gray-500 font-medium">{gigs.length} Gigs found</span>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-gray-500 flex flex-col items-center">
                        <svg className="animate-spin w-8 h-8 text-black mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p>Loading amazing gigs...</p>
                    </div>
                ) : error ? (
                    <div className="py-12 text-center text-red-500 bg-red-50 rounded-xl">
                        {error}
                    </div>
                ) : gigs.length === 0 ? (
                    <div className="py-16 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">No Gigs Found</h3>
                        <p className="text-gray-500 text-sm">There are currently no active gigs available on the platform.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {gigs.map((gig) => {
                            let textLowestPrice = "N/A";
                            if (gig.packages && gig.packages.length > 0) {
                                const lowestPricing = Math.min(...gig.packages.map(p => p.price));
                                textLowestPrice = `$${lowestPricing}`;
                            }
                            let coverImage = gig.cover_pic_url;
                            if (!coverImage && gig.media && gig.media.length > 0) {
                                const imageMedia = gig.media.find(m => m.type === 'IMAGE');
                                if (imageMedia) {
                                    coverImage = imageMedia.url;
                                }
                            }
                            if (!coverImage) {
                                coverImage = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=400&auto=format&fit=crop";
                            }

                            return (
                                <Link to={`/client/gigs/${gig.id}`} key={gig.id} className="group relative rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all bg-white flex flex-col h-full hover:-translate-y-1 duration-300">
                                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                        <img src={coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={gig.title} />
                                        <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                                            {gig.category && (
                                                <span className="bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                                    {gig.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <h4 className="font-semibold text-gray-900 text-[15px] mb-3 leading-tight group-hover:text-black transition-colors line-clamp-2">
                                            {gig.title}
                                        </h4>
                                        <div className="mt-auto">
                                            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-gray-500 tracking-wider">STARTING AT</span>
                                                <span className="font-bold text-gray-900 text-lg">{textLowestPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchFreelancers;
