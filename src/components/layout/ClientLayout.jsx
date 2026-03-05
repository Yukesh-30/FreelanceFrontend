import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const ClientLayout = ({ children }) => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState('');
    const [companyName, setCompanyName] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get(API_PATH.CLIENT.GET_MY_PROFILE);
                setDisplayName(res.data?.full_name || user?.email?.split('@')[0] || 'Client');
                setCompanyName(res.data?.company_name || '');
            } catch {
                setDisplayName(user?.email?.split('@')[0] || 'Client');
            }
        };
        if (user?.id) fetchProfile();
    }, [user?.id]);

    const navItems = [
        {
            label: 'Dashboard', path: '/client/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            label: 'Search Freelancers', path: '/client/search-freelancers',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            label: 'Post a Job', path: '/client/jobs/create',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 4v16m8-8H4" />
                </svg>
            )
        },
        {
            label: 'My Jobs', path: '/client/jobs',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            )
        },
        {
            label: 'Current Jobs', path: '/client/current-projects',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            label: 'Messages', path: '/client/chat',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            )
        },
        {
            label: 'Profile', path: '/client/profile',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
    ];

    const currentPageLabel = navItems.find(i => i.path === location.pathname)?.label || 'Dashboard';

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-black">
                        SkillSphere<span className="text-gray-400">.</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-4 mb-3">Client Menu</p>
                    <div className="space-y-1">
                        {navItems.map(({ label, path, icon }) => {
                            const active = location.pathname === path;
                            return (
                                <Link
                                    key={label}
                                    to={path}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors gap-3 ${active
                                        ? 'bg-black text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                                        }`}
                                >
                                    <span className={active ? 'text-white' : 'text-gray-400'}>
                                        {icon}
                                    </span>
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-black transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-8">
                    <h1 className="text-xl font-serif font-bold text-gray-900 hidden sm:block">
                        {currentPageLabel}
                    </h1>

                    <div className="flex items-center space-x-4">
                        <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
                        <Link to="/client/profile" className="flex items-center gap-3 group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900 group-hover:underline">{displayName}</p>
                                <p className="text-xs text-gray-500">{companyName || 'Client'}</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-sm uppercase">
                                {displayName?.[0] || 'C'}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 focus:outline-none">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ClientLayout;
