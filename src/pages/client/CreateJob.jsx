import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const CATEGORIES = [
    'Web Development', 'Mobile Development', 'Design & Creative', 'Writing & Translation',
    'Data Science & Analytics', 'Marketing', 'Video & Animation', 'Music & Audio', 'Other',
];
const JOB_TYPES = ['FIXED', 'HOURLY'];
const EXPERIENCE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

const InputField = ({ label, required, error, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
);

export default function CreateJob() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        subcategory: '',
        job_type: 'FIXED',
        experience_level: 'INTERMEDIATE',
        budget_min: '',
        budget_max: '',
        deadline: '',
        expires_at: '',
    });
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [apiError, setApiError] = useState('');

    const set = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    // Skills tag input
    const addSkill = (raw) => {
        const trimmed = raw.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills(prev => [...prev, trimmed]);
        }
        setSkillInput('');
        setErrors(prev => ({ ...prev, skills: '' }));
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkill(skillInput);
        }
        if (e.key === 'Backspace' && !skillInput && skills.length) {
            setSkills(prev => prev.slice(0, -1));
        }
    };

    const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Title is required.';
        else if (form.title.trim().length < 10) e.title = 'Title must be at least 10 characters.';
        if (!form.description.trim()) e.description = 'Description is required.';
        else if (form.description.trim().length < 30) e.description = 'Description must be at least 30 characters.';
        if (!form.category) e.category = 'Category is required.';
        if (skills.length === 0) e.skills = 'Add at least one required skill.';
        if (!form.budget_min) e.budget_min = 'Minimum budget is required.';
        else if (Number(form.budget_min) <= 0) e.budget_min = 'Must be greater than 0.';
        if (!form.budget_max) e.budget_max = 'Maximum budget is required.';
        else if (Number(form.budget_max) <= 0) e.budget_max = 'Must be greater than 0.';
        if (form.budget_min && form.budget_max && Number(form.budget_max) < Number(form.budget_min))
            e.budget_max = 'Max budget must be ≥ min budget.';
        if (!form.deadline) e.deadline = 'Deadline is required.';
        if (!form.expires_at) e.expires_at = 'Expiry date is required.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        const e2 = validate();
        if (Object.keys(e2).length) { setErrors(e2); return; }

        setSubmitting(true);
        try {
            await axiosInstance.post(API_PATH.JOBS.CREATE, {
                ...form,
                skills_required: skills,
                budget_min: Number(form.budget_min),
                budget_max: Number(form.budget_max),
            });
            setSuccessMsg('Job posted successfully! Redirecting…');
            setTimeout(() => navigate('/client/jobs'), 1500);
        } catch (err) {
            setApiError(err?.response?.data?.message || 'Failed to post job. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const inputCls = (field) =>
        `w-full px-4 py-3 rounded-xl border text-sm bg-white outline-none transition-all ${errors[field]
            ? 'border-red-400 focus:ring-2 focus:ring-red-200'
            : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-100'
        }`;

    return (
        <div className="min-h-full bg-gray-50 py-8 px-4 sm:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-gray-900">
                        Post a <span className="italic font-light">new</span> job
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Describe your project clearly to attract the right talent.
                    </p>
                </div>

                {/* Success Banner */}
                {successMsg && (
                    <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {successMsg}
                    </div>
                )}

                {/* API Error Banner */}
                {apiError && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-7">

                    {/* Title */}
                    <InputField label="Job Title" required error={errors.title}>
                        <input
                            type="text"
                            placeholder="e.g. Build a React Dashboard with Charts"
                            value={form.title}
                            onChange={e => set('title', e.target.value)}
                            className={inputCls('title')}
                        />
                    </InputField>

                    {/* Description */}
                    <InputField label="Description" required error={errors.description}>
                        <textarea
                            rows={5}
                            placeholder="Describe the project, deliverables, and any specific requirements…"
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                            className={inputCls('description') + ' resize-none'}
                        />
                        <p className="text-xs text-gray-400 text-right">{form.description.length} chars</p>
                    </InputField>

                    {/* Category + Subcategory */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <InputField label="Category" required error={errors.category}>
                            <select
                                value={form.category}
                                onChange={e => set('category', e.target.value)}
                                className={inputCls('category')}
                            >
                                <option value="">Select category</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </InputField>

                        <InputField label="Subcategory" error={errors.subcategory}>
                            <input
                                type="text"
                                placeholder="e.g. Frontend, Backend, SEO…"
                                value={form.subcategory}
                                onChange={e => set('subcategory', e.target.value)}
                                className={inputCls('subcategory')}
                            />
                        </InputField>
                    </div>

                    {/* Skills */}
                    <InputField label="Required Skills" required error={errors.skills}>
                        <div
                            className={`flex flex-wrap gap-2 px-4 py-3 rounded-xl border bg-white min-h-[52px] cursor-text transition-all ${errors.skills
                                ? 'border-red-400 focus-within:ring-2 focus-within:ring-red-200'
                                : 'border-gray-200 focus-within:border-black focus-within:ring-2 focus-within:ring-gray-100'
                                }`}
                            onClick={() => document.getElementById('skill-input').focus()}
                        >
                            {skills.map(s => (
                                <span key={s} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                                    {s}
                                    <button type="button" onClick={() => removeSkill(s)} className="text-gray-400 hover:text-black transition-colors">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            ))}
                            <input
                                id="skill-input"
                                type="text"
                                value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={handleSkillKeyDown}
                                onBlur={() => skillInput.trim() && addSkill(skillInput)}
                                placeholder={skills.length === 0 ? 'Type a skill and press Enter or comma…' : ''}
                                className="flex-1 min-w-[120px] text-sm outline-none bg-transparent"
                            />
                        </div>
                    </InputField>

                    {/* Job Type + Experience Level */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <InputField label="Job Type" required>
                            <div className="flex gap-3">
                                {JOB_TYPES.map(jt => (
                                    <button
                                        key={jt}
                                        type="button"
                                        onClick={() => set('job_type', jt)}
                                        className={`flex-1 py-3 text-sm font-semibold rounded-xl border transition-all ${form.job_type === jt
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        {jt}
                                    </button>
                                ))}
                            </div>
                        </InputField>

                        <InputField label="Experience Level" required>
                            <select
                                value={form.experience_level}
                                onChange={e => set('experience_level', e.target.value)}
                                className={inputCls('experience_level')}
                            >
                                {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </InputField>
                    </div>

                    {/* Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <InputField label="Budget Min ($)" required error={errors.budget_min}>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="500"
                                    value={form.budget_min}
                                    onChange={e => set('budget_min', e.target.value)}
                                    className={inputCls('budget_min') + ' pl-8'}
                                />
                            </div>
                        </InputField>

                        <InputField label="Budget Max ($)" required error={errors.budget_max}>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="1200"
                                    value={form.budget_max}
                                    onChange={e => set('budget_max', e.target.value)}
                                    className={inputCls('budget_max') + ' pl-8'}
                                />
                            </div>
                        </InputField>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <InputField label="Project Deadline" required error={errors.deadline}>
                            <input
                                type="datetime-local"
                                value={form.deadline}
                                onChange={e => set('deadline', e.target.value)}
                                className={inputCls('deadline')}
                            />
                        </InputField>

                        <InputField label="Listing Expires At" required error={errors.expires_at}>
                            <input
                                type="datetime-local"
                                value={form.expires_at}
                                onChange={e => set('expires_at', e.target.value)}
                                className={inputCls('expires_at')}
                            />
                        </InputField>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/client/jobs')}
                            className="px-6 py-3 text-sm font-medium text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-60 flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Posting…
                                </>
                            ) : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
