import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const ReadOnlyStat = ({ label, value, icon }) => (
    <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-lg font-semibold text-gray-900 mt-0.5">{value ?? '—'}</p>
        </div>
    </div>
);

export default function ClientProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);

    const fetchProfile = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axiosInstance.get(API_PATH.CLIENT.GET_MY_PROFILE);
            setProfile(res.data);
            setCompanyName(res.data?.company_name || '');
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!companyName.trim()) { setSaveError('Company name is required.'); return; }
        setSaving(true);
        setSaveError('');
        setSaveSuccess(false);
        try {
            const res = await axiosInstance.put(API_PATH.CLIENT.UPDATE_MY_PROFILE, { company_name: companyName.trim() });
            setProfile(prev => ({ ...prev, ...res.data }));
            setEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setSaveError(err?.response?.data?.message || 'Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-full bg-gray-50 py-8 px-4 sm:px-8">
                <div className="max-w-3xl mx-auto animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-48" />
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
                        <div className="h-24 bg-gray-100 rounded-2xl" />
                        <div className="h-12 bg-gray-100 rounded-xl" />
                        <div className="h-12 bg-gray-100 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(n => <div key={n} className="h-24 bg-white border border-gray-100 rounded-2xl" />)}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full bg-gray-50 py-8 px-4 sm:px-8 flex items-start justify-center">
                <div className="mt-16 text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-700 font-medium mb-4">{error}</p>
                    <button onClick={fetchProfile} className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition-colors">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const initials = (profile?.full_name || profile?.email || 'C')[0].toUpperCase();
    const ratingDisplay = profile?.rating != null ? Number(profile.rating).toFixed(1) : 'No ratings yet';
    const totalSpent = profile?.total_spent != null
        ? `$${Number(profile.total_spent).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        : '$0.00';

    return (
        <div className="min-h-full bg-gray-50 py-8 px-4 sm:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Page Title */}
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Client Profile</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your company information</p>
                </div>

                {/* Success Banner */}
                {saveSuccess && (
                    <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Profile updated successfully!
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Avatar banner */}
                    <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-700" />
                    <div className="px-8 pb-8">
                        {/* Avatar */}
                        <div className="-mt-10 mb-5 flex items-end justify-between">
                            <div className="w-20 h-20 rounded-2xl bg-black text-white flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-white uppercase">
                                {initials}
                            </div>
                            {!editing ? (
                                <button
                                    onClick={() => { setEditing(true); setSaveError(''); }}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profile
                                </button>
                            ) : null}
                        </div>

                        {/* Name & Email */}
                        <div className="space-y-1 mb-6">
                            <h2 className="text-2xl font-serif font-bold text-gray-900">
                                {profile?.full_name || 'N/A'}
                            </h2>
                            <p className="text-gray-500 text-sm">{profile?.email}</p>
                        </div>

                        {/* Company Name Form */}
                        {editing ? (
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Company Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={e => { setCompanyName(e.target.value); setSaveError(''); }}
                                        placeholder="Your company or business name"
                                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${saveError
                                            ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                                            : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-100'
                                            }`}
                                    />
                                    {saveError && <p className="text-xs text-red-500">{saveError}</p>}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setEditing(false); setCompanyName(profile?.company_name || ''); setSaveError(''); }}
                                        className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-7 py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-60 flex items-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                                                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                                Saving…
                                            </>
                                        ) : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</p>
                                <p className="text-gray-900 font-medium">{profile?.company_name || <span className="text-gray-400 italic">Not set</span>}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Read-only Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <ReadOnlyStat
                        label="Total Spent"
                        value={totalSpent}
                        icon={
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <ReadOnlyStat
                        label="Rating"
                        value={ratingDisplay}
                        icon={
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        }
                    />
                    <ReadOnlyStat
                        label="Reviews"
                        value={profile?.review_count ?? 0}
                        icon={
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        }
                    />
                </div>

                {/* Read-only notice */}
                <p className="text-xs text-gray-400 text-center pb-4">
                    Rating, reviews, and total spent are calculated automatically and cannot be edited.
                </p>
            </div>
        </div>
    );
}
