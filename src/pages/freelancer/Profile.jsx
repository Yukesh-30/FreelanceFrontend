import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const Profile = () => {
    const { user } = useAuth();
    const userId = user?.id || user?.userId || 1;

    const [userData, setUserData] = useState(null);
    const [freelancerData, setFreelancerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');

    const [isEditingSkills, setIsEditingSkills] = useState(false);
    const [skillsArray, setSkillsArray] = useState([]);
    const [currentSkillInput, setCurrentSkillInput] = useState('');

    useEffect(() => {
        if (!userId) return;

        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const [userRes, freelancerRes] = await Promise.all([
                    axiosInstance.get(API_PATH.USERS.GET_USER(userId)),
                    axiosInstance.get(API_PATH.FREELANCER.GET_DETAILS(userId)).catch(err => {
                        console.warn("Freelancer details not found, mocking default structure", err);
                        // Handled missing details gracefully if 404
                        return { data: { information: { bio: "", skills: [], hourly_rate: "0.00", total_earnings: "0.00", rating: "0.0", review_count: 0 } } };
                    })
                ]);

                const userInfo = userRes.data?.informations || userRes.data?.infomations || userRes.data;
                if (userInfo) {
                    setUserData(userInfo);
                }

                if (freelancerRes.data?.information || freelancerRes.data) {
                    const info = freelancerRes.data.information || freelancerRes.data;
                    setFreelancerData(info);
                    setBioText(info.bio || '');
                    setHourlyRate(info.hourly_rate || '0.00');
                    setSkillsArray(info.skills || []);
                }

            } catch (err) {
                console.error("Error fetching profile data", err);
                setError("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [userId]);


    const handleUpdateDetails = async () => {
        try {
            const rateNum = Number(hourlyRate);
            await axiosInstance.patch(API_PATH.FREELANCER.UPDATE_DETAILS(userId), {
                bio: bioText,
                ...(rateNum > 0 && { hourly_rate: rateNum })
            });
            setIsEditingBio(false);
            setFreelancerData(prev => ({ ...prev, bio: bioText, hourly_rate: hourlyRate }));
        } catch (err) {
            console.error("Failed to update details", err);
            alert("Failed to update details");
        }
    };

    const handleUpdateSkills = async () => {
        try {
            let finalSkills = [...skillsArray];
            const pendingVal = currentSkillInput.trim();
            if (pendingVal && !finalSkills.includes(pendingVal)) {
                finalSkills.push(pendingVal);
                setSkillsArray(finalSkills);
                setCurrentSkillInput('');
            }

            await axiosInstance.patch(API_PATH.FREELANCER.UPDATE_SKILLS(userId), {
                skills: finalSkills
            });
            setIsEditingSkills(false);
            setFreelancerData(prev => ({ ...prev, skills: finalSkills }));
        } catch (err) {
            console.error("Failed to update skills", err);
            alert("Failed to update skills");
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    }

    if (error && !userData) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }


    // The backend seems to have a typo "infomations". 
    // We normalize this in the state, but handle all cases here just to be safe.
    const name = userData?.full_name || userData?.infomations?.full_name || userData?.informations?.full_name || user?.email?.split('@')[0] || 'Unknown User';
    const email = userData?.email || userData?.infomations?.email || userData?.informations?.email || user?.email;
    const stats = freelancerData || {};

    let calculatedLevel = 'Beginner';
    if (stats) {
        const rating = parseFloat(stats.rating) || 0;
        const review_count = parseInt(stats.review_count) || 0;
        if (rating >= 4.8 && review_count >= 100) {
            calculatedLevel = 'Top Rated';
        } else if (rating >= 4.5 && review_count >= 50) {
            calculatedLevel = 'Expert';
        } else if (rating >= 3.5 && rating < 4.5 && review_count >= 10 && review_count < 50) {
            calculatedLevel = 'Intermediate';
        }
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Top Search & Actions Bar Placeholder */}
            {/* We typically put this in Layout, but keeping the screenshot aesthetic */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">

                {/* Left Column */}
                <div className="space-y-6">
                    {/* Profile Hero Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-6">
                            <span className="bg-gray-100 text-gray-900 font-semibold text-xs px-2.5 py-1 rounded-full border border-gray-200">
                                {userData?.is_verified ? 'Verified ✓' : 'Available'}
                            </span>
                        </div>
                        <div className="flex flex-col items-center mb-6">
                            <div className="h-24 w-24 rounded-full bg-gray-200 mb-3 border-4 border-white shadow-md overflow-hidden relative group">
                                <img src="https://i.pravatar.cc/150?u=profile1" alt="Profile" className="object-cover h-full w-full" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold font-serif text-gray-900">{name}</h2>
                            <p className="text-gray-500 text-sm">@{name.toLowerCase().replace(' ', '_')}</p>
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Since</span>
                                <span className="font-semibold text-gray-900">{userData?.member_since || userData?.infomations?.member_since || userData?.informations?.member_since || 'Unknown'}</span>
                            </div>
                        </div>

                        <button className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm text-sm">
                            Hire Me
                        </button>
                    </div>

                    {/* My Portfolio Card (Mocked) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4 font-serif">My portfolio</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-100 aspect-video rounded-lg overflow-hidden group relative cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="portfolio" />
                            </div>
                            <div className="bg-gray-100 aspect-video rounded-lg overflow-hidden group relative cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1627398225058-f4f408731eb1?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="portfolio" />
                            </div>
                            <div className="bg-gray-100 aspect-video rounded-lg overflow-hidden group relative cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="portfolio" />
                            </div>
                            <div className="bg-gray-100 aspect-video rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer border border-dashed border-gray-300">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Meta Details Section (Bio, Skills, Language, etc.) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-8">

                        {/* Description (Bio) */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-900 font-serif">Description</h3>
                                {!isEditingBio ? (
                                    <button onClick={() => setIsEditingBio(true)} className="text-black bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-semibold transition-colors">
                                        Edit
                                    </button>
                                ) : (
                                    <button onClick={handleUpdateDetails} className="text-white bg-black hover:bg-gray-900 px-3 py-1 rounded-full text-xs font-semibold transition-colors shadow-sm">
                                        Save
                                    </button>
                                )}
                            </div>
                            {isEditingBio ? (
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black min-h-[100px] resize-y"
                                    value={bioText}
                                    onChange={(e) => setBioText(e.target.value)}
                                    placeholder="Write your bio here..."
                                />
                            ) : (
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {stats.bio || 'No description provided.'}
                                </p>
                            )}
                        </div>

                        {/* Hourly Rate - Combining with Bio Edit per API structure requirement constraint logic */}
                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-900 font-serif">Hourly Rate</h3>
                                {!isEditingBio ? (
                                    <button onClick={() => setIsEditingBio(true)} className="text-black bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-semibold transition-colors">
                                        Edit
                                    </button>
                                ) : null}
                            </div>
                            {isEditingBio ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">$</span>
                                    <input
                                        type="number"
                                        className="border border-gray-300 rounded-lg p-2 text-sm w-32 focus:outline-none focus:ring-1 focus:ring-black"
                                        value={hourlyRate}
                                        onChange={(e) => setHourlyRate(e.target.value)}
                                    />
                                    <span className="text-gray-500 text-sm">/ hr</span>
                                </div>
                            ) : (
                                <p className="text-sm font-semibold text-gray-900">
                                    ${stats.hourly_rate || '0.00'} <span className="text-gray-500 font-normal">/ hr</span>
                                    <span className="block mt-1 text-xs text-green-600">Total Earnings: ${stats.total_earnings || '0.00'}</span>
                                </p>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-900 font-serif">Skills</h3>
                                {!isEditingSkills ? (
                                    <button onClick={() => setIsEditingSkills(true)} className="text-black bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-semibold transition-colors">
                                        Edit Skills
                                    </button>
                                ) : (
                                    <button onClick={handleUpdateSkills} className="text-white bg-black hover:bg-gray-900 px-3 py-1 rounded-full text-xs font-semibold transition-colors shadow-sm">
                                        Save
                                    </button>
                                )}
                            </div>
                            {isEditingSkills ? (
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {skillsArray.map((skill, index) => (
                                            <span key={index} className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                                                {skill}
                                                <button onClick={() => setSkillsArray(skillsArray.filter((_, i) => i !== index))} className="hover:text-red-400 focus:outline-none">
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                        value={currentSkillInput}
                                        onChange={(e) => setCurrentSkillInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ',') {
                                                e.preventDefault();
                                                const val = currentSkillInput.trim();
                                                if (val && !skillsArray.includes(val)) {
                                                    setSkillsArray([...skillsArray, val]);
                                                }
                                                setCurrentSkillInput('');
                                            }
                                        }}
                                        placeholder="Type a skill and press Enter or comma"
                                    />
                                    <p className="text-xs text-gray-400 mt-2">Press Enter or comma to add a tag.</p>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {(stats.skills && stats.skills.length > 0) ? stats.skills.map((skill, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200">
                                            {skill}
                                        </span>
                                    )) : (
                                        <span className="text-sm text-gray-500">No skills listed.</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mocked sections below based on screenshot */}
                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-900 font-serif">Language</h3>
                                <button className="text-black bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-semibold transition-colors">
                                    Add New
                                </button>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-900 font-medium">English - <span className="text-gray-500 font-normal">Conversational</span></p>
                                <p className="text-sm text-gray-900 font-medium">Tamil - <span className="text-gray-500 font-normal">Native</span></p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-900 font-serif">Education</h3>
                                <button className="text-black bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-semibold transition-colors">
                                    Add New
                                </button>
                            </div>
                            <p className="text-sm text-gray-500">Add education details</p>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-900 font-serif">Certification</h3>
                                <button className="text-black bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-semibold transition-colors">
                                    Add New
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="bg-gray-50 aspect-video rounded-lg border border-gray-200"></div>
                                <div className="bg-gray-50 aspect-video rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer border border-dashed border-gray-300">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column: Active Gigs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wide text-xs border-b border-gray-100 pb-2">Active Gigs</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Existing Gig Card Mock */}
                            <div className="group rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-all cursor-pointer bg-white flex flex-col h-full">
                                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="gig cover" />
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <img src="https://i.pravatar.cc/150?u=profile1" alt="avatar" className="w-5 h-5 rounded-full" />
                                        <span className="text-xs font-medium text-gray-600 truncate">{name}</span>
                                        <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded ml-auto">{calculatedLevel}</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm mb-4 leading-tight group-hover:text-black transition-colors line-clamp-2">
                                        I do professional video editing
                                    </h4>

                                    <div className="mt-auto">
                                        <div className="flex items-center gap-1 mb-2">
                                            <span className="text-yellow-500 text-sm">★</span>
                                            <span className="text-sm font-bold text-gray-900">{stats.rating || '5.0'}</span>
                                            <span className="text-xs text-gray-500">({stats.review_count || 148})</span>
                                        </div>
                                        <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
                                            <span className="text-xs font-semibold text-gray-400">STARTING AT</span>
                                            <span className="font-bold text-gray-900">${stats.hourly_rate ? parseInt(stats.hourly_rate) * 10 : 1500}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Create New Gig Card */}
                            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center p-6 h-full min-h-[300px] group">
                                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                </div>
                                <h4 className="font-serif font-bold text-gray-900 text-lg">Create a new gig</h4>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;

