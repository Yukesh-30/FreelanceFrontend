import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const SearchProject = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchJobs = async (page = 1) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(API_PATH.JOBS.GET_ALL_JOBS, {
                params: {
                    page,
                    limit
                }
            });
            
            if (res.data && res.data.jobs) {
                setJobs(res.data.jobs);
                setTotal(res.data.total || 0);
                setTotalPages(res.data.totalPages || 1);
                setCurrentPage(res.data.page || page);
            } else if (Array.isArray(res.data)) {
                setJobs(res.data);
                setCurrentPage(page);
            }
        } catch (err) {
            console.error("Failed to fetch jobs.", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(currentPage);
    }, [currentPage, limit]);

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
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header / Search Area */}
            <div className="bg-black rounded-2xl p-8 sm:p-12 text-center shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white relative z-10 mb-4">
                    Explore <span className="italic font-light">Available Jobs</span>
                </h1>
                <p className="text-gray-300 relative z-10 max-w-2xl mx-auto">
                    Discover amazing projects and clients to help your freelance career grow.
                </p>
                <div className="mt-8 max-w-xl mx-auto relative z-10">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Search by title, description, category, or company..."
                            className="w-full bg-white text-black px-6 py-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="absolute right-2 bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold font-serif text-gray-900">All Available Projects</h2>
                    <span className="text-sm text-gray-500 font-medium">{filteredJobs.length} of {total} Projects</span>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-gray-500 flex flex-col items-center">
                        <svg className="animate-spin w-8 h-8 text-black mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p>Loading projects...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.length === 0 ? (
                            <div className="py-16 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">No Projects Found</h3>
                                <p className="text-gray-500 text-sm">
                                    {searchTerm ? "No projects found matching your search." : "No projects available at the moment."}
                                </p>
                            </div>
                        ) : (
                            filteredJobs.map(job => (
                                <div key={job.id} className="bg-white border text-sm border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 line-clamp-1">{job.title || job.description}</h3>
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

                {/* Pagination Controls */}
                {!loading && filteredJobs.length > 0 && (
                    <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors font-medium"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                                                currentPage === pageNum
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors font-medium"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchProject;
