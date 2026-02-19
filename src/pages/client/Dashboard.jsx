import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ClientDashboard = () => {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-100">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Client Dashboard</h1>
                <p className="text-gray-500 mb-8">Welcome! You have successfully logged in as a Client.</p>

                <button
                    onClick={logout}
                    className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default ClientDashboard;
