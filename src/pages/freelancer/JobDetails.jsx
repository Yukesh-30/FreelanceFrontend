import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';
import { useAuth } from '../../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [proposal, setProposal] = useState({
        cover_letter: '',
        proposed_budget: '',
        estimated_days: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);

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

    const handleSubmitProposal = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        setIsSubmitting(true);

        const freelancerId = user?.id || user?.userId || user?.sub;

        if (!freelancerId) {
            setSubmitError("Could not identify freelancer ID. Please log in again.");
            setIsSubmitting(false);
            return;
        }

        const payload = {
            freelancer_id: freelancerId,
            cover_letter: proposal.cover_letter,
            proposed_budget: parseFloat(proposal.proposed_budget),
            estimated_days: parseInt(proposal.estimated_days, 10)
        };

        try {
            await axiosInstance.post(API_PATH.CONTRACT.APPLY_JOB(id), payload);
            setSubmitSuccess(true);
            setTimeout(() => {
                setIsModalOpen(false);
                setSubmitSuccess(false);
                setProposal({ cover_letter: '', proposed_budget: '', estimated_days: '' });
            }, 2000);
        } catch (err) {
            console.error("Failed to submit proposal", err);

            // Handle specific backend errors
            if (err.response?.status === 500) {
                setSubmitError("You have already submitted a proposal for this project.");
            } else {
                setSubmitError(err.response?.data?.message || "Failed to submit proposal. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-medium transition-colors shadow-sm"
                        >
                            Submit a Proposal
                        </button>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-serif text-gray-900">Submit Proposal</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {submitSuccess ? (
                            <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="font-medium">Proposal submitted successfully!</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitProposal} className="space-y-5">
                                {submitError && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                                        {submitError}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={proposal.cover_letter}
                                        onChange={(e) => setProposal({ ...proposal, cover_letter: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none"
                                        placeholder="Introduce yourself and explain why you're a great fit for this job..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Budget ($)</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={proposal.proposed_budget}
                                            onChange={(e) => setProposal({ ...proposal, proposed_budget: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                            placeholder="e.g. 1500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Days</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={proposal.estimated_days}
                                            onChange={(e) => setProposal({ ...proposal, estimated_days: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                            placeholder="e.g. 14"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;
