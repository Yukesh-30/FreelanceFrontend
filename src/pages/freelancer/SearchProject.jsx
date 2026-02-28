import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const SearchProject = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axiosInstance.get(API_PATH.JOBS.GET_ALL_JOBS);
                let jobsData = [];
                if (res.data && res.data.jobs) {
                    jobsData = res.data.jobs;
                } else if (Array.isArray(res.data)) {
                    jobsData = res.data;
                }

                const jobsWithClientInfo = await Promise.all(
                    jobsData.map(async (job) => {
                        let companyName = 'Unknown Company';
                        if (job.client_id) {
                            try {
                                const clientRes = await axiosInstance.get(API_PATH.CLIENT.GET_PROFILE(job.client_id));
                                if (clientRes.data && clientRes.data.company_name) {
                                    companyName = clientRes.data.company_name;
                                }
                            } catch (error) {
                                console.warn(`Could not fetch client info for ${job.client_id}`, error);
                            }
                        }
                        return { ...job, companyName };
                    })
                );

                setJobs(jobsWithClientInfo);
            } catch (err) {
                console.error("Failed to fetch jobs.", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (job.title && job.title.toLowerCase().includes(searchLower)) ||
            (job.description && job.description.toLowerCase().includes(searchLower)) ||
            (job.companyName && job.companyName.toLowerCase().includes(searchLower)) ||
            (job.category && job.category.toLowerCase().includes(searchLower))
        );
    });

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold font-serif text-gray-900 mb-6">Search Projects</h1>

            <div className="mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by title, description, category, or company..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-8">Loading projects...</div>
            ) : (
                <div className="space-y-4">
                    {filteredJobs.length === 0 ? (
                        <p className="text-center text-gray-500 py-8 bg-white rounded-xl border border-gray-200">
                            {searchTerm ? "No projects found matching your search." : "No projects available at the moment."}
                        </p>
                    ) : (
                        filteredJobs.map(job => (
                            <div key={job.id} className="bg-white border text-sm border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 uppercase flex-shrink-0 border border-gray-300">
                                        {job.companyName?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">{job.companyName}</p>
                                        <h3 className="font-semibold text-gray-900 line-clamp-1">{job.title || job.description}</h3>
                                        {job.category && <p className="text-xs text-gray-400 mt-0.5">{job.category}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 sm:ml-4 flex-shrink-0 mt-3 sm:mt-0">
                                    <Link to={`/freelancer/jobs/${job.id}`} className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto text-center block">
                                        Open
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchProject;
