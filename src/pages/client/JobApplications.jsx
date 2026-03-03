import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const JobApplications = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Profile Modal State
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedFreelancerId, setSelectedFreelancerId] = useState(null);
    const [freelancerProfile, setFreelancerProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    // Action State
    const [actionLoading, setActionLoading] = useState(null); // stores application ID being processed
    const [actionError, setActionError] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null); // { applicationId, status }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch Job Details just for the title/header context
                const jobRes = await axiosInstance.get(API_PATH.JOBS.GET_BY_ID(id));
                setJobDetails(jobRes.data);

                // Fetch Applications for this job
                const appsRes = await axiosInstance.get(API_PATH.CONTRACT.GET_APPLICATIONS_BY_JOB(id));
                // Extract from job_applications wrapper if present
                const appsData = appsRes.data?.job_applications || appsRes.data || [];
                setApplications(appsData);
            } catch (err) {
                console.error("Failed to fetch applications", err);
                setError("Could not load applications. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleReviewProfile = async (freelancerId) => {
        setSelectedFreelancerId(freelancerId);
        setIsProfileModalOpen(true);
        setLoadingProfile(true);
        setFreelancerProfile(null);

        try {
            // 1. Fetch Freelancer Details
            const res = await axiosInstance.get(API_PATH.FREELANCER.GET_DETAILS(freelancerId));
            const freelancerInfo = res.data?.information || res.data;

            // 2. Fetch User Details to get the Name (using GET_USER)
            let userDetails = { full_name: 'Unknown Freelancer', profile_url: null };
            try {
                // Notice: GET_USER requires user ID, but we only have freelancer_id here. 
                // Let's assume the API handles it or the freelancer object has a user_id. 
                // We'll try to fetch it if user_id exists, otherwise we'll just display a fallback.
                if (freelancerInfo.user_id) {
                    const userRes = await axiosInstance.get(API_PATH.USERS.GET_USER(freelancerInfo.user_id));
                    userDetails = userRes.data?.infomations || userRes.data;
                } else {
                    // Since we might not have `user_id` inside freelancerInfo depending on the backend, 
                    // try calling it with freelancerId directly just in case it's a 1:1 mapping
                    const userRes = await axiosInstance.get(API_PATH.USERS.GET_USER(freelancerId));
                    userDetails = userRes.data?.infomations || userRes.data;
                }
            } catch (err) {
                console.warn("Could not fetch user details for name, using fallback.", err);
            }

            setFreelancerProfile({
                ...freelancerInfo,
                full_name: userDetails.full_name,
                profile_url: userDetails.profile_url
            });
        } catch (err) {
            console.error("Failed to fetch freelancer profile", err);
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleApplicationAction = (applicationId, status) => {
        setConfirmAction({ applicationId, status });
    };

    const executeAction = async () => {
        if (!confirmAction) return;
        const { applicationId, status } = confirmAction;

        setConfirmAction(null);
        setActionLoading(applicationId);
        setActionError(null);

        try {
            await axiosInstance.patch(API_PATH.CONTRACT.UPDATE_APPLICATION_STATUS(applicationId), { status });
            setApplications(prev => prev.map(app =>
                app.id === applicationId ? { ...app, status: status } : app
            ));
        } catch (err) {
            console.error(`Failed to ${status.toLowerCase()} freelancer`, err);
            setActionError(err.response?.data?.message || `Failed to ${status.toLowerCase()} application.`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading applications...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
            <button onClick={() => navigate('/client/jobs')} className="text-gray-500 hover:text-black flex items-center gap-2 mb-2 text-sm font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to My Jobs
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-2">Review Applicants</h1>
                    <p className="text-gray-500 text-sm">
                        Candidates who applied for <span className="font-semibold text-gray-800">"{jobDetails?.title || 'this project'}"</span>
                    </p>
                </div>
                <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200">
                    Total Applications: {applications.length}
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold font-serif text-gray-900 mb-2">No applicants yet</h3>
                    <p className="text-gray-500">New proposals will appear here once freelancers apply to your job.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${app.status === 'HIRED' ? 'bg-green-50 text-green-700 border-green-100' :
                                                app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>
                                                {app.status || 'NEW PROPOSAL'}
                                            </span>
                                            <span className="text-xs text-gray-400">Received {new Date(app.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Cover Letter</h4>
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{app.cover_letter}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-64 flex-shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Proposed Budget</p>
                                            <p className="text-xl font-bold font-serif text-gray-900">${app.proposed_rate || app.proposed_budget}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Estimated Time</p>
                                            <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {app.estimated_days} Days
                                            </p>
                                        </div>
                                    </div>

                                    {actionError && actionLoading === app.id && (
                                        <div className="text-xs text-red-500 mb-2">{actionError}</div>
                                    )}
                                    {app.status !== 'HIRED' && app.status !== 'REJECTED' ? (
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => handleApplicationAction(app.id, 'HIRED')}
                                                disabled={actionLoading === app.id}
                                                className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm"
                                            >
                                                {actionLoading === app.id ? 'Processing...' : 'Hire Freelancer'}
                                            </button>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApplicationAction(app.id, 'REJECTED')}
                                                    disabled={actionLoading === app.id}
                                                    className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-xl font-medium transition-colors text-sm"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleReviewProfile(app.freelancer_id)}
                                                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2.5 rounded-xl font-medium transition-colors text-sm"
                                                >
                                                    Profile
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleReviewProfile(app.freelancer_id)}
                                            className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2.5 rounded-xl font-medium transition-colors text-sm"
                                        >
                                            Review Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Freelancer Profile Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl font-bold font-serif text-gray-900">Freelancer Profile</h2>
                                <p className="text-sm text-gray-500 mt-1">Detailed overview of the candidate's skills and experience.</p>
                            </div>
                            <button onClick={() => setIsProfileModalOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:text-black hover:bg-gray-200 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {loadingProfile ? (
                            <div className="py-12 flex flex-col items-center justify-center space-y-3">
                                <svg className="w-8 h-8 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                <p className="text-gray-500 text-sm font-medium">Loading profile data...</p>
                            </div>
                        ) : !freelancerProfile ? (
                            <div className="py-12 text-center text-gray-500">
                                This freelancer has not set up their public profile yet.
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex gap-6 items-start">
                                    {freelancerProfile.profile_url ? (
                                        <img
                                            src={freelancerProfile.profile_url}
                                            alt={freelancerProfile.full_name}
                                            className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl font-serif text-gray-400 font-bold uppercase overflow-hidden">
                                            {freelancerProfile.full_name?.charAt(0) || 'F'}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {freelancerProfile.full_name}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2">
                                            {freelancerProfile.hourly_rate && (
                                                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                                    ${freelancerProfile.hourly_rate} / hr
                                                </span>
                                            )}
                                            {freelancerProfile.rating && (
                                                <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full flex items-center gap-1">
                                                    ★ {freelancerProfile.rating} ({freelancerProfile.review_count || 0})
                                                </span>
                                            )}
                                            {freelancerProfile.total_earnings && (
                                                <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                                                    ${freelancerProfile.total_earnings} earned
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Availability</p>
                                        <p className="font-medium text-gray-900 capitalize">{freelancerProfile.availability?.replace('_', ' ').toLowerCase() || 'Flexible'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Portfolio</p>
                                        {freelancerProfile.portfolio_url ? (
                                            <a href={freelancerProfile.portfolio_url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">View Website</a>
                                        ) : (
                                            <p className="font-medium text-gray-900">Not provided</p>
                                        )}
                                    </div>
                                </div>

                                {freelancerProfile.bio && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Biography</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{freelancerProfile.bio}</p>
                                    </div>
                                )}

                                {freelancerProfile.skills && freelancerProfile.skills.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {freelancerProfile.skills.map(skill => (
                                                <span key={skill} className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Confirmation Modal */}
            {confirmAction && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmAction.status === 'HIRED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {confirmAction.status === 'HIRED' ? (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {confirmAction.status === 'HIRED' ? 'Hire Freelancer?' : 'Reject Application?'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">
                            {confirmAction.status === 'HIRED'
                                ? 'Are you sure you want to hire this freelancer? A contract will be initiated.'
                                : 'Are you sure you want to reject this application? This action cannot be undone.'}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeAction}
                                className={`flex-1 text-white py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm ${confirmAction.status === 'HIRED' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobApplications;
