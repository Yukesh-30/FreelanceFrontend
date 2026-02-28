import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                // 1. Fetch Job
                const jobRes = await axiosInstance.get(API_PATH.JOBS.GET_BY_ID(id));
                const jobData = jobRes.data;
                setJob(jobData);

                // 2. Fetch Client Info
                if (jobData?.client_id) {
                    try {
                        const clientRes = await axiosInstance.get(API_PATH.CLIENT.GET_PROFILE(jobData.client_id));
                        setClient(clientRes.data);
                    } catch (clientErr) {
                        console.warn("Could not fetch client details", clientErr);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch job details", err);
                setError("Could not load job details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading job details...</div>;
    if (error || !job) return <div className="p-8 text-center text-red-500">{error || "Job not found"}</div>;

    const companyName = client?.company_name || 'Unknown Company';
    const rating = client?.rating ? `${client.rating} ★` : 'No rating yet';

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-black flex items-center gap-2 mb-4 text-sm font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back
            </button>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-3">{job.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md font-medium">{job.category}</span>
                            <span>•</span>
                            <span>{job.subcategory}</span>
                            <span>•</span>
                            <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0 text-left md:text-right">
                        <p className="text-sm text-gray-500 mb-1">Budget</p>
                        <p className="text-xl font-bold text-gray-900">${job.budget_min} - ${job.budget_max}</p>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{job.job_type}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <section>
                            <h3 className="text-lg font-bold font-serif text-gray-900 mb-4">Description</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">{job.description}</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold font-serif text-gray-900 mb-4">Skills & Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills_required?.map(skill => (
                                    <span key={skill} className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <h3 className="font-bold font-serif text-gray-900 mb-4">About the Client</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 uppercase flex-shrink-0 border border-gray-300">
                                        {companyName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{companyName}</p>
                                        <p className="text-xs text-gray-500">{rating} • {client?.review_count || 0} reviews</p>
                                    </div>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-gray-500">Experience Level</span>
                                    <span className="font-medium text-gray-900 capitalize">{job.experience_level?.toLowerCase()}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-gray-500">Deadline</span>
                                    <span className="font-medium text-gray-900">{new Date(job.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-medium transition-colors shadow-sm">
                            Submit a Proposal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
