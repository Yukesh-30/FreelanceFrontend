import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_PATH } from '../../service/api';
import { axiosInstance } from '../../service/axiosInstance';
const Dashboard = () => {
    const { user } = useAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [freelancerDetails, setFreelancerDetails] = useState(null);
    const [level, setLevel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(API_PATH.USERS.GET_USER(user.id));
                setUserDetails(response.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchFreelancerDetails = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(API_PATH.FREELANCER.GET_DETAILS(user.id));
                setFreelancerDetails(response.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
        fetchFreelancerDetails();
    }, []);


    const fullName = userDetails?.informations?.full_name || userDetails?.infomations?.full_name || user?.email?.split('@')[0] || 'User';

    useEffect(() => {
        if (freelancerDetails?.information) {
            const rating = parseFloat(freelancerDetails.information.rating) || 0;
            const review_count = parseInt(freelancerDetails.information.review_count) || 0;

            if (rating >= 4.8 && review_count >= 100) {
                setLevel('Top Rated');
            } else if (rating >= 4.5 && review_count >= 50) {
                setLevel('Expert');
            } else if (rating >= 3.5 && rating < 4.5 && review_count >= 10 && review_count < 50) {
                setLevel('Intermediate');
            } else {
                setLevel('Beginner');
            }
        }
    }, [freelancerDetails]);

    if (loading && !userDetails) return <p>Loading profile...</p>;
    const classes = [
        { id: 1, name: 'class_class_1', progress: 10 },
        { id: 2, name: 'class_class_2', progress: 75 },
        { id: 3, name: 'class_class_3', progress: 100 },
    ];

    const recommendedProjects = [
        { id: 1, client: 'client_client_1', title: 'Video editor for a 30 second instagram reel...' },
        { id: 2, client: 'client_client_2', title: 'Video editor for a 5-10 minute youtube video...' },
        { id: 3, client: 'client_client_3', title: 'Thumbnail design for a youtube video...' },
    ];

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Welcome Banner */}
            <div className="bg-black rounded-2xl p-8 sm:p-12 text-center shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white relative z-10">
                    Welcome Back <span className="italic font-light">{fullName}!</span>
                </h1>
            </div>

            {/* Quick Stats & Progress Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{fullName}</h3>
                            <p className="text-sm text-gray-500 capitalize">{user?.role?.toLowerCase() || 'Freelancer'}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Level:</span>
                            <span className="font-semibold text-gray-900">{level || 'Beginner'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Rating:</span>
                            <div className="flex text-yellow-500">
                                <span className="text-gray-900 ml-1 font-semibold text-xs pt-0.5">{freelancerDetails?.information?.rating}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Reviews:</span>
                            <span className="font-semibold text-gray-900">{freelancerDetails?.information?.review_count}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Tracker Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-serif font-bold text-lg text-gray-900">Progress Tracker</h2>
                        <button className="text-xs font-semibold text-black bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                            View All Progress
                        </button>
                    </div>
                    <div className="space-y-6">
                        {classes.map((cls) => (
                            <div key={cls.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center text-gray-700 font-medium">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {cls.name}
                                    </div>
                                    <span className="font-bold text-gray-900">{cls.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-black h-1.5 rounded-full"
                                        style={{ width: `${cls.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Calendar (Mocked completely static layout to match screenshot roughly) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
                <h2 className="text-center font-serif font-bold text-lg text-gray-900 mb-6">Calendar</h2>
                <div className="w-full overflow-x-auto">
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-7 border-b border-gray-200">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                                <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{day}</div>
                            ))}
                        </div>
                        {/* Mocking a few rows */}
                        <div className="grid grid-cols-7 border-b border-gray-100 min-h-[80px]">
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">1</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100 bg-gray-50 relative">
                                2
                                <div className="absolute top-8 left-1 right-1 bg-black text-white text-[10px] px-1 py-0.5 rounded truncate">class_class_1</div>
                            </div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100 bg-gray-50 relative">
                                3
                                <div className="absolute top-8 left-1 right-1 bg-black text-white text-[10px] px-1 py-0.5 rounded truncate">class_class_1</div>
                            </div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100 bg-gray-50 relative">
                                4
                                <div className="absolute top-8 left-1 right-1 bg-black text-white text-[10px] px-1 py-0.5 rounded truncate">class_class_1</div>
                            </div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">5</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100 relative">
                                <span className="w-6 h-6 rounded-full bg-black text-white inline-flex items-center justify-center font-bold">6</span>
                            </div>
                            <div className="p-2 text-right text-sm text-gray-500">7</div>
                        </div>
                        <div className="grid grid-cols-7 border-b border-gray-100 min-h-[80px]">
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">8</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">9</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100 bg-gray-50 relative">
                                10
                                <div className="absolute top-8 left-1 flex h-1.5 w-full bg-gray-200">
                                    <div className="h-full bg-black w-2/3"></div>
                                </div>
                                <div className="absolute top-10 left-1 right-1 text-black text-[10px] text-center font-medium">class_class_2</div>
                            </div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100 bg-gray-50">11</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100 bg-gray-50">12</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">13</div>
                            <div className="p-2 text-right text-sm text-gray-500">14</div>
                        </div>
                        <div className="grid grid-cols-7 border-b border-gray-100 min-h-[80px]">
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">15</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">16</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">17</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">18</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">19</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">20</div>
                            <div className="p-2 text-right text-sm text-gray-500">21</div>
                        </div>
                        <div className="grid grid-cols-7 min-h-[80px]">
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">22</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">23</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">24</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">25</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">26</div>
                            <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-100">27</div>
                            <div className="p-2 text-right text-sm text-gray-500">28</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Projects & Tutorial Container */}
            <div className="space-y-8 max-w-4xl mx-auto">
                {/* Recommended Projects */}
                <div>
                    <h2 className="text-center font-serif font-bold text-lg text-gray-900 mb-6">Recommended Projects</h2>
                    <div className="space-y-4">
                        {recommendedProjects.map((project) => (
                            <div key={project.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-black transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600 mt-1">
                                        C
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 font-medium mb-1">{project.client}</div>
                                        <div className="text-sm font-semibold text-gray-900">{project.title}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="bg-black text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors shadow-sm">
                                        Open
                                    </button>
                                    <button className="bg-white text-black border border-black text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                        Save Project
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tutorial Video Placeholder */}
                <div>
                    <h2 className="text-center font-serif font-bold text-lg text-gray-900 mb-6">Tutorial</h2>
                    <div className="bg-gray-300 w-full rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-sm">
                        <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Dummy chat fab to match screenshot */}
                <div className="fixed bottom-6 right-6">
                    <button className="h-12 w-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-black hover:scale-105 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

