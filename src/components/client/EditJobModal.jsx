import React, { useState, useEffect } from 'react';
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
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
);

const inputCls = (err) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm bg-white outline-none transition-all ${err
        ? 'border-red-400 focus:ring-2 focus:ring-red-200'
        : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-100'
    }`;

export default function EditJobModal({ job, onClose, onUpdated }) {
    const [form, setForm] = useState({
        title: job.title || '',
        description: job.description || '',
        category: job.category || '',
        subcategory: job.subcategory || '',
        job_type: job.job_type || 'FIXED',
        experience_level: job.experience_level || 'INTERMEDIATE',
        budget_min: job.budget_min || '',
        budget_max: job.budget_max || '',
        deadline: job.deadline ? job.deadline.slice(0, 16) : '',
        expires_at: job.expires_at ? job.expires_at.slice(0, 16) : '',
    });
    const [skills, setSkills] = useState(job.skills_required || []);
    const [skillInput, setSkillInput] = useState('');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');

    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const set = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const addSkill = (raw) => {
        const trimmed = raw.trim();
        if (trimmed && !skills.includes(trimmed)) setSkills(prev => [...prev, trimmed]);
        setSkillInput('');
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(skillInput); }
        if (e.key === 'Backspace' && !skillInput && skills.length) setSkills(prev => prev.slice(0, -1));
    };

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Title is required.';
        if (!form.description.trim()) e.description = 'Description is required.';
        if (!form.category) e.category = 'Category is required.';
        if (skills.length === 0) e.skills = 'Add at least one skill.';
        if (!form.budget_min) e.budget_min = 'Required.';
        if (!form.budget_max) e.budget_max = 'Required.';
        if (form.budget_min && form.budget_max && Number(form.budget_max) < Number(form.budget_min))
            e.budget_max = 'Max ≥ Min.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ev = validate();
        if (Object.keys(ev).length) { setErrors(ev); return; }
        setSubmitting(true);
        setApiError('');
        try {
            const res = await axiosInstance.put(API_PATH.JOBS.UPDATE(job.id), {
                ...form,
                skills_required: skills,
                budget_min: Number(form.budget_min),
                budget_max: Number(form.budget_max),
            });
            onUpdated(res.data);
            onClose();
        } catch (err) {
            setApiError(err?.response?.data?.message || 'Update failed. Try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
        >
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-serif font-bold text-gray-900">Edit Job</h2>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-black">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
                    {apiError && (
                        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {apiError}
                        </div>
                    )}

                    <InputField label="Job Title" required error={errors.title}>
                        <input type="text" value={form.title} onChange={e => set('title', e.target.value)} className={inputCls(errors.title)} />
                    </InputField>

                    <InputField label="Description" required error={errors.description}>
                        <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)}
                            className={inputCls(errors.description) + ' resize-none'} />
                    </InputField>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Category" required error={errors.category}>
                            <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls(errors.category)}>
                                <option value="">Select…</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </InputField>
                        <InputField label="Subcategory" error={errors.subcategory}>
                            <input type="text" value={form.subcategory} onChange={e => set('subcategory', e.target.value)} className={inputCls(errors.subcategory)} />
                        </InputField>
                    </div>

                    {/* Skills */}
                    <InputField label="Required Skills" required error={errors.skills}>
                        <div
                            className={`flex flex-wrap gap-2 px-4 py-2.5 rounded-xl border bg-white min-h-[44px] cursor-text ${errors.skills ? 'border-red-400' : 'border-gray-200 focus-within:border-black'}`}
                            onClick={() => document.getElementById('edit-skill-input').focus()}
                        >
                            {skills.map(s => (
                                <span key={s} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                                    {s}
                                    <button type="button" onClick={() => setSkills(prev => prev.filter(x => x !== s))} className="text-gray-400 hover:text-black">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </span>
                            ))}
                            <input
                                id="edit-skill-input"
                                type="text"
                                value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={handleSkillKeyDown}
                                onBlur={() => skillInput.trim() && addSkill(skillInput)}
                                placeholder={skills.length === 0 ? 'Press Enter to add…' : ''}
                                className="flex-1 min-w-[100px] text-sm outline-none bg-transparent"
                            />
                        </div>
                    </InputField>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Job Type">
                            <div className="flex gap-2">
                                {JOB_TYPES.map(jt => (
                                    <button key={jt} type="button" onClick={() => set('job_type', jt)}
                                        className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition-all ${form.job_type === jt ? 'bg-black text-white border-black' : 'text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                                        {jt}
                                    </button>
                                ))}
                            </div>
                        </InputField>
                        <InputField label="Experience Level">
                            <select value={form.experience_level} onChange={e => set('experience_level', e.target.value)} className={inputCls()}>
                                {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </InputField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Budget Min ($)" required error={errors.budget_min}>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input type="number" min="1" value={form.budget_min} onChange={e => set('budget_min', e.target.value)} className={inputCls(errors.budget_min) + ' pl-7'} />
                            </div>
                        </InputField>
                        <InputField label="Budget Max ($)" required error={errors.budget_max}>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input type="number" min="1" value={form.budget_max} onChange={e => set('budget_max', e.target.value)} className={inputCls(errors.budget_max) + ' pl-7'} />
                            </div>
                        </InputField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Deadline" required error={errors.deadline}>
                            <input type="datetime-local" value={form.deadline} onChange={e => set('deadline', e.target.value)} className={inputCls(errors.deadline)} />
                        </InputField>
                        <InputField label="Expires At" required error={errors.expires_at}>
                            <input type="datetime-local" value={form.expires_at} onChange={e => set('expires_at', e.target.value)} className={inputCls(errors.expires_at)} />
                        </InputField>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                        <button type="button" onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            className="px-7 py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-60 flex items-center gap-2">
                            {submitting ? (
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
            </div>
        </div>
    );
}
