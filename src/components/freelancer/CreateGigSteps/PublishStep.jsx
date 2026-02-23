import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../service/axiosInstance';
import { API_PATH } from '../../../service/api';
import { useAuth } from '../../../context/AuthContext';

export default function PublishStep({ gigData, prevStep }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handlePublish = async () => {
        setLoading(true);
        setError('');

        try {
            // Removing the File object before sending, keeping only url and type which the API expects
            const payload = {
                freelancer_id: user?.id,
                title: gigData.title,
                description: gigData.description,
                category: gigData.category,
                tags: gigData.tags,
                subcategory: gigData.subcategory,
                packages: gigData.packages.map(p => ({
                    type: p.type,
                    price: Number(p.price) || 0,
                    description: p.description,
                    delivery_days: Number(p.delivery_days) || 0,
                    revisions: Number(p.revisions) || 0
                })),
                media: gigData.media.map(m => ({
                    url: m.url,
                    type: m.type
                }))
            };

            await axiosInstance.post(API_PATH.GIGS.CREATE, payload);
            setSuccess(true);
        } catch (err) {
            console.error("Error creating gig:", err);
            // Fallback message
            setError(err.response?.data?.message || 'Failed to create gig. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-serif font-bold">Publish your gig</h2>
                <p className="text-green-600 font-medium">Congratulations! Your gig was successfully published on your profile.</p>

                <button
                    onClick={() => navigate('/freelancer/dashboard')}
                    className="mt-8 bg-black text-white px-8 py-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8 flex flex-col items-center justify-center py-10">

            <h2 className="text-3xl font-serif font-bold mb-4">Publish your gig</h2>
            <p className="text-gray-500 mb-8 max-w-md text-center">
                You are almost there! Publishing your gig and getting it live allows clients to purchase your services. Let's do this!
            </p>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md w-full max-w-md text-sm text-center mb-6 border border-red-200">
                    {error}
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={prevStep}
                    className="px-8 py-3 rounded text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                    disabled={loading}
                >
                    Go Back
                </button>
                <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="bg-black text-white px-10 py-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            Publishing...
                        </>
                    ) : (
                        'Publish'
                    )}
                </button>
            </div>
        </div>
    );
}
