import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';
import UpdateSubmissionStatusModal from './UpdateSubmissionStatusModal';

const SubmissionsList = ({ contractId, isClient, refreshTrigger, onSubmissionsLoaded }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATH.SUBMISSION.GET_SUBMISSIONS(contractId));
            const data = response.data || [];
            // Assuming the robust endpoint structure, handle different return styles based on user
            setSubmissions(data);
            if (onSubmissionsLoaded) {
                const hasApproved = data.some(sub => sub.status === 'APPROVED');
                onSubmissionsLoaded(hasApproved);
            }
            setError('');
        } catch (err) {
            console.error('Failed to fetch submissions:', err);
            setError('Could not load submissions. ' + (err.response?.data?.message || ''));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (contractId) {
            fetchSubmissions();
        }
    }, [contractId, refreshTrigger]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-50 text-green-700 border-green-200';
            case 'REVISION_REQUESTED': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'PENDING_REVIEW':
            default: return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };

    const formatStatusName = (status) => {
        if (!status) return 'Unknown';
        return status.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
    };

    const extractImageUrls = (filesArray) => {
        if (!Array.isArray(filesArray)) return [];
        const urls = [];
        filesArray.forEach(fileObj => {
            if (typeof fileObj === 'string') {
                urls.push(fileObj);
            } else if (fileObj.preview_url) {
                if (Array.isArray(fileObj.preview_url)) {
                    urls.push(...fileObj.preview_url);
                } else {
                    urls.push(fileObj.preview_url);
                }
            } else if (fileObj.download_url) {
                if (Array.isArray(fileObj.download_url)) {
                    urls.push(...fileObj.download_url);
                } else {
                    urls.push(fileObj.download_url);
                }
            } else if (fileObj.url) {
                urls.push(fileObj.url);
            }
        });
        return urls;
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">{error}</div>;
    }

    if (!submissions || submissions.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-100 p-8 rounded-2xl text-center text-gray-500 font-medium h-full flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
                No submissions have been made yet.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold font-serif text-gray-900 mb-4">Work Submissions</h3>
            <div className="grid grid-cols-1 gap-6">
                {submissions.map((sub) => {
                    const imageUrls = extractImageUrls(sub.files);

                    return (
                        <div key={sub.submission_id || sub.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getStatusColor(sub.status)}`}>
                                            {formatStatusName(sub.status)}
                                        </span>
                                        <span className="text-sm text-gray-400 font-medium">
                                            {new Date(sub.submitted_at || sub.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="text-sm font-mono text-gray-500">
                                        ID: {sub.submission_id || sub.id}
                                    </div>
                                </div>
                                {isClient && (
                                    <button
                                        onClick={() => setSelectedSubmission(sub)}
                                        disabled={sub.status === 'APPROVED'}
                                        title={sub.status === 'APPROVED' ? "Status already approved" : "Update submission status"}
                                        className={`text-sm px-4 py-2 font-semibold border rounded-xl transition-colors flex-shrink-0 ${sub.status === 'APPROVED'
                                            ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-black hover:text-white hover:border-black'
                                            }`}
                                    >
                                        Update Status
                                    </button>
                                )}
                            </div>

                            <div className="mb-5">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</h4>
                                <p className="text-gray-800 text-sm whitespace-pre-wrap">{sub.message || <i>No message provided</i>}</p>
                            </div>

                            {imageUrls.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Attached Files</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {imageUrls.map((url, idx) => (
                                            <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 rounded-xl border border-gray-200 overflow-hidden group relative flex-shrink-0">
                                                <img src={url} alt={`Submission File ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {sub.feedback && (
                                <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Client Feedback</h4>
                                    <p className="text-sm font-medium text-gray-800 italic">"{sub.feedback}"</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {isClient && selectedSubmission && (
                <UpdateSubmissionStatusModal
                    isOpen={!!selectedSubmission}
                    onClose={() => setSelectedSubmission(null)}
                    submissionId={selectedSubmission.submission_id || selectedSubmission.id}
                    currentStatus={selectedSubmission.status}
                    onSuccess={() => {
                        fetchSubmissions();
                        setSelectedSubmission(null);
                    }}
                />
            )}
        </div>
    );
};

export default SubmissionsList;
