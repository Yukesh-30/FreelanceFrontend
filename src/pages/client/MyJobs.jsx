import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';
import EditJobModal from '../../components/client/EditJobModal';

const statusColors = {
    OPEN: 'bg-green-100 text-green-700',
    CLOSED: 'bg-gray-100 text-gray-600',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-purple-100 text-purple-700',
    CANCELLED: 'bg-red-100 text-red-600',
};

const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
        <div className="flex justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-5 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-3 bg-gray-100 rounded w-full mb-2" />
        <div className="h-3 bg-gray-100 rounded w-4/5 mb-5" />
        <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(i => <div key={i} className="h-5 bg-gray-100 rounded-lg w-16" />)}
        </div>
        <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded-xl w-14" />
                <div className="h-8 bg-gray-200 rounded-xl w-16" />
            </div>
        </div>
    </div>
);

const ConfirmDialog = ({ job, onConfirm, onCancel, deleting }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </div>
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Delete this job?</h3>
            <p className="text-sm text-gray-500 mb-6">
                <span className="font-medium text-gray-700">"{job.title}"</span> will be permanently removed. This cannot be undone.
            </p>
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
                <button onClick={onConfirm} disabled={deleting}
                    className="flex-1 py-2.5 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {deleting ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Deleting…
                        </>
                    ) : 'Delete'}
                </button>
            </div>
        </div>
    </div>
);

export default function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editJob, setEditJob] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchJobs = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axiosInstance.get(API_PATH.JOBS.GET_MY_JOBS);
            setJobs(res.data || []);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load your jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJobs(); }, []);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await axiosInstance.delete(API_PATH.JOBS.DELETE(deleteTarget.id));
            setJobs(prev => prev.filter(j => j.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            setError(err?.response?.data?.message || 'Delete failed. Try again.');
            setDeleteTarget(null);
        } finally {
            setDeleting(false);
        }
    };

    const handleUpdated = (updated) => {
        setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
    };

    const formatDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatBudget = (min, max) => {
        const fmt = (n) => Number(n).toLocaleString('en-US');
        return `$${fmt(min)} – $${fmt(max)}`;
    };

    return (
        <div className="min-h-full bg-gray-50 py-8 px-4 sm:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">My Jobs</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage all your posted jobs</p>
                    </div>
                    <Link
                        to="/client/jobs/create"
                        className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Post a Job
                    </Link>
                </div>

                {/* Error State */}
                {error && !loading && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                        <button onClick={fetchJobs} className="ml-auto underline text-xs">Retry</button>
                    </div>
                )}

                {/* Loading Skeletons */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && jobs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">No jobs posted yet</h3>
                        <p className="text-gray-500 text-sm mb-6">Post your first job and start finding talent.</p>
                        <Link to="/client/jobs/create"
                            className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition-colors">
                            Post a Job
                        </Link>
                    </div>
                )}

                {/* Job Cards Grid */}
                {!loading && jobs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {jobs.map(job => (
                            <div key={job.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">

                                {/* Card Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
                                        {job.title}
                                    </h3>
                                    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[job.status] || 'bg-gray-100 text-gray-500'}`}>
                                        {job.status}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                    {job.description}
                                </p>

                                {/* Skills */}
                                {job.skills_required?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {job.skills_required.slice(0, 4).map(s => (
                                            <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">
                                                {s}
                                            </span>
                                        ))}
                                        {job.skills_required.length > 4 && (
                                            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg">
                                                +{job.skills_required.length - 4}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Meta row */}
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {formatBudget(job.budget_min, job.budget_max)}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Deadline: {formatDate(job.deadline)}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        {job.job_type}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        {job.experience_level}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                    <span className="text-xs text-gray-400">
                                        Posted {formatDate(job.created_at)}
                                    </span>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/client/jobs/${job.id}/applications`}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            View Applicants
                                        </Link>
                                        <button
                                            onClick={() => setEditJob(job)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(job)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-100 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editJob && (
                <EditJobModal
                    job={editJob}
                    onClose={() => setEditJob(null)}
                    onUpdated={handleUpdated}
                />
            )}

            {/* Delete Confirm Dialog */}
            {deleteTarget && (
                <ConfirmDialog
                    job={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    deleting={deleting}
                />
            )}
        </div>
    );
}
