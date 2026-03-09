import React, { useState } from 'react';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const UpdateSubmissionStatusModal = ({ isOpen, onClose, submissionId, currentStatus, onSuccess }) => {
    const [status, setStatus] = useState(currentStatus || 'PENDING_REVIEW');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axiosInstance.patch(API_PATH.SUBMISSION.UPDATE_STATUS(submissionId), {
                status,
                feedback,
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-fade-in-up">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold font-serif text-gray-900">Review Submission</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Update Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none bg-white cursor-pointer appearance-none"
                            required
                        >
                            <option value="PENDING_REVIEW">Pending Review</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REVISION_REQUESTED">Revision Requested</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Feedback / Comments
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows="4"
                            className="w-full px-4 py-2 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none resize-none bg-gray-50 focus:bg-white"
                            placeholder="Helpful feedback for the freelancer..."
                        ></textarea>
                    </div>

                    <div className="pt-2 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 text-sm font-semibold bg-black text-white hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center min-w-[100px]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent flex-shrink-0 animate-spin rounded-full"></div>
                            ) : (
                                'Save Review'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateSubmissionStatusModal;
