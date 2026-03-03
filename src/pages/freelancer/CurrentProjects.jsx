import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_PATH } from '../../service/api';
import { axiosInstance } from '../../service/axiosInstance';
import { useNavigate } from 'react-router-dom';

const CurrentProjects = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        const fetchContracts = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(API_PATH.CONTRACT.GET_MY_CONTRACTS(user.id));
                setContracts(response.data.contracts || []);
            } catch (error) {
                console.error("Failed to fetch contracts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();
    }, [user?.id]);

    if (loading) return <p className="p-8 text-gray-500">Loading your active projects...</p>;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/freelancer/dashboard')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h1 className="text-3xl font-serif font-bold text-gray-900">Current Jobs</h1>
            </div>

            {contracts.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center text-gray-500 font-medium">
                    You have no active contracts at the moment.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contracts.map((contract) => (
                        <div key={contract.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-black transition-colors">
                            <div>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 text-sm">
                                        {contract.job_title ? 'JOB' : 'GIG'}
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        {contract.status}
                                    </span>
                                </div>
                                <h3 className="text-md font-bold text-gray-900 mb-2 line-clamp-2" title={contract.job_title || contract.gig_title || 'Project'}>
                                    {contract.job_title || contract.gig_title || 'Project'}
                                </h3>
                                <div className="text-sm text-gray-500 flex items-center gap-2 mb-4">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Ends: {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-100">
                                <span className="font-serif font-bold text-lg text-gray-900">${contract.total_amount}</span>
                                <button className="text-sm font-semibold text-black hover:text-indigo-600 transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CurrentProjects;
