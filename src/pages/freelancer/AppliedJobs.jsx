import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';
import { useNavigate } from 'react-router-dom';

const AppliedJobs = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const res = await axiosInstance.get(API_PATH.CONTRACT.GET_MY_APPLICATIONS(user.id));
                setApplications(res.data.applications || []);
            } catch (err) {
                console.error("Failed to fetch applied jobs:", err);
                setError("Could not load your applications. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [user?.id]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'HIRED': return 'bg-green-50 text-green-700 border-green-100';
            case 'REJECTED': return 'bg-red-50 text-red-700 border-red-100';
            case 'SHORTLISTED': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            default: return 'bg-blue-50 text-blue-700 border-blue-100'; // APPLIED
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your applications...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
            <button onClick={() => navigate('/freelancer/search-project')} className="text-gray-500 hover:text-black flex items-center gap-2 mb-2 text-sm font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Find more jobs
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-2">My Applications</h1>
                    <p className="text-gray-500 text-sm">
                        Track the status of the proposals you've submitted.
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold font-serif text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-500">You haven't applied to any jobs yet. Start browsing and submit a proposal!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getStatusStyle(app.status)}`}>
                                                {app.status || 'APPLIED'}
                                            </span>
                                            <span className="text-xs text-gray-400">Date Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{app.job_title}</h3>
                                        <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Cover Letter snippet</h4>
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">{app.cover_letter}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-48 flex-shrink-0 flex flex-col justify-start border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 space-y-4">
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
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppliedJobs;
