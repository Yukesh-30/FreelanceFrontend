import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const ProjectDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const contract = location.state?.contract;
    const [otherPartyInfo, setOtherPartyInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isClient = user?.id === contract?.client_id;
    const isFreelancer = user?.id === contract?.freelancer_id;

    useEffect(() => {
        if (!contract) {
            setError("Contract details not found.");
            setLoading(false);
            return;
        }

        const fetchOtherPartyProfile = async () => {
            try {
                setLoading(true);
                if (isClient) {
                    // Fetch freelancer profile
                    const [freelancerResponse, userResponse] = await Promise.all([
                        axiosInstance.get(API_PATH.FREELANCER.GET_DETAILS(contract.freelancer_id)),
                        axiosInstance.get(API_PATH.USERS.GET_USER(contract.freelancer_id))
                    ]);

                    setOtherPartyInfo({
                        ...userResponse.data.infomations,
                        ...freelancerResponse.data.information,
                        type: 'FREELANCER'
                    });
                } else if (isFreelancer) {
                    // Fetch client profile
                    const [clientResponse, userResponse] = await Promise.all([
                        axiosInstance.get(API_PATH.CLIENT.GET_PROFILE(contract.client_id)),
                        axiosInstance.get(API_PATH.USERS.GET_USER(contract.client_id))
                    ]);

                    setOtherPartyInfo({
                        ...userResponse.data.infomations,
                        ...clientResponse.data,
                        type: 'CLIENT'
                    });
                } else {
                    setError("You do not have permission to view this contract.");
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError("Could not load the other party's profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchOtherPartyProfile();
    }, [contract, isClient, isFreelancer]);

    const daysRemaining = (endDateStr) => {
        if (!endDateStr) return null;
        const now = new Date();
        const end = new Date(endDateStr);
        const diffTime = end - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (!contract) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">{error || "Contract not found."}</p>
                <button onClick={() => navigate(-1)} className="text-black font-semibold hover:underline">← Go Back</button>
            </div>
        );
    }

    const remaining = daysRemaining(contract.end_date);
    const isOverdue = remaining !== null && remaining < 0;

    const roleName = isClient ? 'Freelancer' : 'Client';

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            {/* Header & Navigation */}
            <div className="flex items-center gap-4 mb-2 border-b border-gray-100 pb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {contract.job_title ? 'JOB' : 'GIG'}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {contract.status}
                        </span>
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mt-1">Project Details</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Project Overview */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Overview</h3>
                        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6 leading-tight">
                                {contract.job_title || contract.gig_title || 'Untitled Project'}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Total Payout</p>
                                    <p className="text-2xl font-serif font-bold text-emerald-600">${contract.total_amount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Contract ID</p>
                                    <p className="text-sm font-mono text-gray-700 bg-gray-50 px-3 py-1.5 rounded-md inline-block border border-gray-200 break-all">{contract.id}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Timeline</h3>
                        <div className="flex items-center justify-between bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            {/* Decorative Background Element */}
                            <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                                <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Commenced</p>
                                <p className="text-lg font-bold text-gray-900">{contract.start_date ? new Date(contract.start_date).toLocaleDateString() : 'N/A'}</p>
                            </div>

                            <div className="flex-1 px-4 md:px-8 relative hidden sm:flex items-center">
                                <div className="h-0.5 bg-gray-200 w-full relative">
                                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 z-10 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]"></div>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Deadline</p>
                                <p className="text-lg font-bold text-gray-900">{contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'N/A'}</p>
                                {remaining !== null && (
                                    <div className={`mt-2 inline-block px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${isOverdue ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                        {isOverdue ? `Overdue by ${Math.abs(remaining)} days` : `${remaining} days remaining`}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: User Profile */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">{roleName} Profile</h3>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:border-black transition-colors">
                        {loading ? (
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-10 bg-gray-100 rounded w-full"></div>
                            </div>
                        ) : error ? (
                            <p className="text-red-500 text-sm text-center py-4">{error}</p>
                        ) : otherPartyInfo ? (
                            <div className="flex flex-col items-center text-center">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center mb-4 transition-transform group-hover:scale-105 duration-300">
                                    {otherPartyInfo.profile_url || otherPartyInfo.profile_pic_url ? (
                                        <img src={otherPartyInfo.profile_url || otherPartyInfo.profile_pic_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-indigo-600 uppercase">
                                            {otherPartyInfo.full_name?.charAt(0) || roleName.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-1">{otherPartyInfo.full_name || 'Anonymous User'}</h4>
                                <p className="text-sm text-gray-500 font-medium mb-4 flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    {otherPartyInfo.email || 'No email available'}
                                </p>                                <div className="w-full bg-gray-50 rounded-xl p-4 text-left border border-gray-100 mt-2">
                                    {isFreelancer ? (
                                        // Show Client details
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-xs font-bold text-gray-500 uppercase">Company</span>
                                                <p className="text-sm text-gray-900 font-medium">{otherPartyInfo.company_name || 'N/A'}</p>
                                            </div>

                                            <div>
                                                <span className="text-xs font-bold text-gray-500 uppercase">Total Spent</span>
                                                <p className="text-sm text-gray-900 font-medium">${otherPartyInfo.total_spent || 0}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-gray-500 uppercase">Reviews</span>
                                                <p className="text-sm text-gray-900 font-medium">{otherPartyInfo.review_count || '0'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        // Show Freelancer details
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-xs font-bold text-gray-500 uppercase">Hourly Rate</span>
                                                <p className="text-sm text-gray-900 font-medium">${otherPartyInfo.hourly_rate || 0}/hr</p>
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-gray-500 uppercase">Bio</span>
                                                <p className="text-sm text-gray-900 font-medium italic line-clamp-3">{otherPartyInfo.bio || 'No bio available'}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-gray-500 uppercase">Skills</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {(typeof otherPartyInfo.skills === 'string' ? JSON.parse(otherPartyInfo.skills) : (otherPartyInfo.skills || [])).length > 0
                                                        ? (typeof otherPartyInfo.skills === 'string' ? JSON.parse(otherPartyInfo.skills) : (otherPartyInfo.skills || [])).map((skill, idx) => (
                                                            <span key={idx} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-sm font-semibold text-gray-600">{skill}</span>
                                                        ))
                                                        : <span className="text-sm text-gray-500">Not specified</span>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        const base = isClient ? '/client' : '/freelancer';
                                        navigate(`${base}/chat/${contract.id}`, {
                                            state: {
                                                contract,
                                                otherPartyName: otherPartyInfo?.full_name || 'User'
                                            }
                                        });
                                    }}
                                    className="mt-6 w-full py-2.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm text-sm"
                                >
                                    Send Message
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
