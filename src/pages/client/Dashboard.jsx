import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ClientDashboard = () => {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                        Client Dashboard
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Welcome back, <span className="font-semibold text-black">{user?.email}</span>
                    </p>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                        <p className="text-sm text-gray-500">Role: <span className="font-medium text-black uppercase">{user?.role}</span></p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
