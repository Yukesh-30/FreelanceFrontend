import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const StatCard = ({ label, value, sub, icon, linkTo, linkText }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                {icon}
            </div>
            {sub && <span className="text-xs text-gray-400">{sub}</span>}
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        </div>
        {linkTo && (
            <Link to={linkTo} className="text-xs font-semibold text-black hover:underline flex items-center gap-1">
                {linkText}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </Link>
        )}
    </div>
);

export default function ClientDashboard() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [profRes, jobsRes] = await Promise.allSettled([
                    axiosInstance.get(API_PATH.CLIENT.GET_MY_PROFILE),
                    axiosInstance.get(API_PATH.JOBS.GET_MY_JOBS),
                ]);
                if (profRes.status === 'fulfilled') setProfile(profRes.value.data);
                if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value.data || []);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Client';
    const openJobs = jobs.filter(j => j.status === 'OPEN').length;
    const closedJobs = jobs.filter(j => j.status !== 'OPEN').length;

    return (
        <div className="min-h-full bg-gray-50 py-8 px-4 sm:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Welcome */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Welcome back 👋</p>
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                            {loading ? '…' : displayName}
                        </h1>
                        {profile?.company_name && (
                            <p className="text-gray-400 text-sm mt-1">{profile.company_name}</p>
                        )}
                    </div>
                    <Link
                        to="/client/jobs/create"
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Post a Job
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <StatCard
                        label="Total Jobs Posted"
                        value={loading ? '—' : jobs.length}
                        icon={<svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                        linkTo="/client/jobs"
                        linkText="View all jobs"
                    />
                    <StatCard
                        label="Open Jobs"
                        value={loading ? '—' : openJobs}
                        sub="Active listings"
                        icon={<svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        linkTo="/client/jobs"
                        linkText="Manage"
                    />
                    <StatCard
                        label="Total Spent"
                        value={loading ? '—' : `$${Number(profile?.total_spent || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                        icon={<svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        linkTo="/client/profile"
                        linkText="View profile"
                    />
                </div>

                {/* Recent Jobs */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-serif font-bold text-gray-900">Recent Jobs</h2>
                        <Link to="/client/jobs" className="text-sm text-gray-500 hover:text-black transition-colors">View all →</Link>
                    </div>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2].map(n => (
                                <div key={n} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                                </div>
                            ))}
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                            <p className="text-gray-400 text-sm mb-4">No jobs posted yet.</p>
                            <Link to="/client/jobs/create" className="text-sm font-semibold text-black underline">
                                Post your first job →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {jobs.slice(0, 5).map(job => (
                                <div key={job.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{job.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{job.category} · ${Number(job.budget_min).toLocaleString()} – ${Number(job.budget_max).toLocaleString()}</p>
                                    </div>
                                    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {job.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 gap-4 pb-6">
                    <Link to="/client/jobs/create" className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group">
                        <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center group-hover:bg-gray-800 transition-colors flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Post a New Job</p>
                            <p className="text-xs text-gray-400">Find the right talent for your project</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
