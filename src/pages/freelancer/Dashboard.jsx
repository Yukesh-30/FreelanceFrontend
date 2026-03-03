import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_PATH } from '../../service/api';
import { axiosInstance } from '../../service/axiosInstance';
const Dashboard = () => {
    const { user } = useAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [freelancerDetails, setFreelancerDetails] = useState(null);
    const [contracts, setContracts] = useState([]);
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

        const fetchContracts = async () => {
            try {
                const response = await axiosInstance.get(API_PATH.CONTRACT.GET_MY_CONTRACTS(user.id));
                setContracts(response.data.contracts || []);
            } catch (error) {
                console.error("Failed to fetch contracts:", error);
            }
        };

        fetchUser();
        fetchFreelancerDetails();
        fetchContracts();
    }, [user?.id]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }
    const totalSlots = Math.ceil(calendarDays.length / 7) * 7;
    for (let i = calendarDays.length; i < totalSlots; i++) {
        calendarDays.push(null);
    }

    const getEventsForDay = (day) => {
        if (!day) return [];
        const checkDate = new Date(currentYear, currentMonth, day);
        checkDate.setHours(0, 0, 0, 0);

        const events = [];
        const seenStarts = new Set();
        const seenEnds = new Set();

        contracts.forEach(c => {
            const title = c.job_title || c.gig_title || 'Project';
            if (c.start_date) {
                const start = new Date(c.start_date);
                start.setHours(0, 0, 0, 0);
                if (checkDate.getTime() === start.getTime() && !seenStarts.has(title)) {
                    seenStarts.add(title);
                    events.push({ ...c, type: 'START' });
                }
            }
            if (c.end_date) {
                const end = new Date(c.end_date);
                end.setHours(0, 0, 0, 0);
                if (checkDate.getTime() === end.getTime() && !seenEnds.has(title)) {
                    seenEnds.add(title);
                    events.push({ ...c, type: 'END' });
                }
            }
        });

        return events;
    };

    console.log("User Details:", userDetails);
    const fullName = userDetails?.informations?.full_name || userDetails?.infomations?.full_name || user?.email?.split('@')[0] || 'User';
    const profilePicUrl = userDetails?.infomations?.profile_url || userDetails?.informations?.profileImageUrl || userDetails?.informations?.profileImage || userDetails?.informations?.profile_picture || userDetails?.informations?.profile_image || userDetails?.infomations?.profileImageUrl || "https://i.pravatar.cc/150?u=a042581f4e29026704d";

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
            <div className="flex justify-end gap-3 mb-2">
                <button onClick={() => window.location.href = '/freelancer/current-projects'} className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-200 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Current Jobs
                </button>
                <button onClick={() => window.location.href = '/freelancer/applications'} className="bg-black text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    My Applications
                </button>
            </div>
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md flex-shrink-0">
                        <img src={profilePicUrl} alt="Profile" className="h-full w-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-serif text-gray-900">{fullName}</h3>
                        <p className="text-sm text-gray-500 capitalize font-medium mt-1">{user?.role?.toLowerCase() || 'Freelancer'}</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 sm:gap-12 w-full md:w-auto justify-around sm:justify-end">
                    <div className="text-center">
                        <div className="text-sm text-gray-500 font-medium mb-1">Level</div>
                        <div className="font-bold text-gray-900 text-lg">{level || 'Beginner'}</div>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-gray-200"></div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500 font-medium mb-1">Rating</div>
                        <div className="font-bold text-gray-900 text-lg flex items-center justify-center gap-1">
                            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            {freelancerDetails?.information?.rating || 'New'}
                        </div>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-gray-200"></div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500 font-medium mb-1">Reviews</div>
                        <div className="font-bold text-gray-900 text-lg">{freelancerDetails?.information?.review_count || 0}</div>
                    </div>
                </div>
            </div>



            {/* Calendar with Data */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif font-bold text-lg text-gray-900">
                        {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
                    </h2>
                </div>
                <div className="w-full overflow-x-auto">
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-7 border-b border-gray-200">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                                <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 border-l border-gray-100">
                            {calendarDays.map((dayNumber, index) => {
                                const dayEvents = getEventsForDay(dayNumber);
                                const isToday = dayNumber === currentDate.getDate();

                                return (
                                    <div key={`day-${index}`} className={`p-2 min-h-[100px] text-right text-sm text-gray-500 border-r border-b border-gray-100 relative ${dayEvents.length > 0 ? 'bg-indigo-50/10' : ''}`}>
                                        {dayNumber ? (
                                            <>
                                                {isToday ? (
                                                    <span className="w-7 h-7 rounded-full bg-black text-white inline-flex items-center justify-center font-bold mb-1">{dayNumber}</span>
                                                ) : (
                                                    <span className="inline-block w-7 h-7 text-center leading-7 font-medium mb-1">{dayNumber}</span>
                                                )}

                                                {dayEvents.length > 0 && (
                                                    <div className="flex flex-col gap-1 mt-1 text-left">
                                                        {dayEvents.map((evt, i) => {
                                                            const isStart = evt.type === 'START';
                                                            return (
                                                                <div key={`${evt.id || i}-${evt.type}`} className={`text-white text-[10px] px-2 py-1 rounded shadow-sm truncate border ${isStart ? 'bg-emerald-600 border-emerald-700' : 'bg-rose-500 border-rose-600'}`} title={evt.job_title || evt.gig_title || 'Project'}>
                                                                    <strong className="block text-[9px] uppercase tracking-wide opacity-80">
                                                                        {isStart ? 'Starts' : 'Ends'}
                                                                    </strong>
                                                                    {evt.job_title || evt.gig_title || 'Project'}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="h-full w-full bg-gray-50/50"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Projects & Tutorial Container */}
            <div className="space-y-8 max-w-4xl mx-auto">
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

