import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

import { useAuth } from '../../context/AuthContext';

const ClientGigDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user from auth context
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [ordering, setOrdering] = useState(false);
    const [orderMessage, setOrderMessage] = useState("");

    useEffect(() => {
        const fetchGigDetails = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(API_PATH.GIGS.GET_BY_ID(id));
                if (response.data?.gig) {
                    setGig(response.data.gig);
                    // Select first package by default if available
                    if (response.data.gig.packages && response.data.gig.packages.length > 0) {
                        setSelectedPackage(response.data.gig.packages[0]);
                    }
                } else {
                    setError("Gig format unexpected.");
                }
            } catch (err) {
                console.error("Failed to fetch gig details:", err);
                setError("Could not load gig details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchGigDetails();
        }
    }, [id]);

    const handleOrderPackage = async () => {
        if (!selectedPackage) return;

        try {
            setOrdering(true);

            // Expected payload: { client_id, message, package_id }
            const payload = {
                client_id: user?.id,
                message: orderMessage || `I would like to order the ${selectedPackage.type} package for this gig.`,
                package_id: selectedPackage.id
            };

            const response = await axiosInstance.post(`/api/gigs/${id}/order`, payload);

            alert("Gig ordered successfully!");
            navigate('/client/search-freelancers'); // or navigate to orders page if it exists
        } catch (err) {
            console.error("Failed to order gig:", err);
            alert(err.response?.data?.message || "Failed to order gig");
        } finally {
            setOrdering(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-500 min-h-[50vh]">
                <svg className="animate-spin w-10 h-10 text-black mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p className="font-medium">Loading gig details...</p>
            </div>
        );
    }

    if (error || !gig) {
        return (
            <div className="p-12 text-center max-w-md mx-auto">
                <div className="bg-red-50 text-red-500 p-6 rounded-2xl mb-6">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p className="font-medium">{error || "Gig not found."}</p>
                </div>
                <Link to="/client/search-freelancers" className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm">
                    ← Back to Search
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            <Link to="/client/search-freelancers" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-2">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Search
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Column: Gig Main Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex gap-2 mb-4">
                            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                                {gig.category}
                            </span>
                            <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                {gig.subcategory}
                            </span>
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                            {gig.title}
                        </h1>

                        {/* Tags */}
                        {gig.tags && gig.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                                {gig.tags.map(tag => (
                                    <span key={tag} className="text-gray-500 text-sm font-medium">#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* About */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                        <h3 className="font-bold text-gray-900 font-serif text-2xl flex items-center gap-3">
                            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            About This Gig
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-[15px] whitespace-pre-wrap">
                            {gig.description}
                        </p>
                    </div>
                </div>

                {/* Right Column: Pricing Sticky Sidebar */}
                <div className="lg:col-span-1 lg:sticky lg:top-8">
                    <div className="bg-white rounded-3xl p-1 shadow-sm border border-gray-100 overflow-hidden">
                        {gig.packages && gig.packages.length > 0 ? (
                            <div className="flex flex-col h-full">
                                {/* Package Selection Tabs */}
                                <div className="flex p-1 bg-gray-50 rounded-t-3xl border-b border-gray-100">
                                    {gig.packages.map((pkg) => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => setSelectedPackage(pkg)}
                                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider rounded-tl-2xl rounded-tr-2xl transition-all ${selectedPackage?.id === pkg.id
                                                ? 'bg-white text-black shadow-sm'
                                                : 'text-gray-400 hover:text-black hover:bg-gray-100/50'
                                                }`}
                                        >
                                            {pkg.type}
                                        </button>
                                    ))}
                                </div>

                                {/* Selected Package Details */}
                                {selectedPackage && (
                                    <div className="p-6 md:p-8 space-y-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-bold text-gray-900 text-lg tracking-wide">{selectedPackage.type} Package</h4>
                                            <span className="text-3xl font-serif font-bold text-gray-900 border-b-2 border-black pb-1">${selectedPackage.price}</span>
                                        </div>

                                        <p className="text-[15px] text-gray-600 font-medium leading-relaxed">
                                            {selectedPackage.description}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100 my-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 shrink-0">
                                                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-bold text-sm tracking-wide">{selectedPackage.delivery_days} Days</span>
                                                    <span className="text-gray-400 text-[10px] uppercase font-semibold">Delivery</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 shrink-0">
                                                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-bold text-sm tracking-wide">{selectedPackage.revisions}</span>
                                                    <span className="text-gray-400 text-[10px] uppercase font-semibold">Revisions</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleOrderPackage}
                                            disabled={ordering}
                                            className="w-full bg-black hover:bg-gray-900 hover:scale-[1.02] text-white font-bold text-lg py-5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-3 group disabled:opacity-70 disabled:hover:scale-100"
                                        >
                                            {ordering ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Order Now
                                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                </>
                                            )}
                                        </button>
                                        <p className="text-center text-xs text-gray-400 mt-4">You won't be charged yet</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="font-medium text-sm">Pricing packages aren't available for this gig yet.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClientGigDetails;
