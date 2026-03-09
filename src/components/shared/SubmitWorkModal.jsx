import React, { useState } from 'react';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const SubmitWorkModal = ({ isOpen, onClose, contractId, onSuccess }) => {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [waterMarkText, setWaterMarkText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (files.length === 0) {
            setError('Please select at least one file to upload.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });
        formData.append('message', message);
        if (waterMarkText) {
            formData.append('waterMarkText', waterMarkText);
        }

        try {
            await axiosInstance.post(API_PATH.SUBMISSION.SUBMIT_WORK(contractId), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 0, // Disable timeout for file uploads
            });
            onSuccess();
            setFiles([]);
            setMessage('');
            setWaterMarkText('');
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit work. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-fade-in-up">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold font-serif text-gray-900">Submit Work</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Upload Files <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors cursor-pointer border border-gray-200 rounded-lg p-1"
                            accept="image/*, application/pdf, .zip"
                            required
                        />
                        {files.length > 0 && (
                            <p className="mt-2 text-xs text-gray-500">{files.length} file(s) selected</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Message / Notes
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="3"
                            className="w-full px-4 py-2 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none resize-none bg-gray-50 focus:bg-white"
                            placeholder="Add a message for your client..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Watermark Text (Optional)
                        </label>
                        <input
                            type="text"
                            value={waterMarkText}
                            onChange={(e) => setWaterMarkText(e.target.value)}
                            className="w-full px-4 py-2 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                            placeholder="e.g. Draft, MyProject"
                        />
                        <p className="mt-1 text-xs text-gray-500 text-end">Applicable for images only.</p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
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
                            disabled={loading || files.length === 0}
                            className="px-5 py-2 text-sm font-semibold bg-black text-white hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center min-w-[100px]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent flex-shrink-0 animate-spin rounded-full"></div>
                            ) : (
                                'Submit Work'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitWorkModal;
