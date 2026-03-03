import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const GigOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // The backend endpoint GET /api/orders now expects freelancer_id in query params
            const response = await axiosInstance.get(API_PATH.ORDERS.GET_FREELANCER_ORDERS, {
                params: { freelancer_id: user.id }
            });

            if (response.data?.orders) {
                // Fetch extra gig/client info for each order
                const enrichedOrders = await Promise.all(response.data.orders.map(async (order) => {
                    let gigInfo = null;
                    let clientInfo = null;
                    try {
                        // Fetch Gig Name
                        const gigRes = await axiosInstance.get(API_PATH.GIGS.GET_BY_ID(order.gig_id));
                        gigInfo = gigRes.data?.gig;

                        // Fetch Client Info
                        const clientRes = await axiosInstance.get(API_PATH.CLIENT.GET_PROFILE(order.client_id));
                        clientInfo = clientRes.data;
                    } catch (err) {
                        console.warn('Failed to fetch enrichment data for order:', err);
                    }

                    return {
                        ...order,
                        gig: gigInfo,
                        client: clientInfo
                    };
                }));
                // Filter out ACCEPTED orders, keep PENDING and REJECTED
                const filteredOrders = enrichedOrders.filter(order => order.status !== 'ACCEPTED');
                // Sort by newest first
                setOrders(filteredOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            }
        } catch (error) {
            console.error('Error fetching gig orders:', error);
            // Ignore 404 No orders found, just leave array empty
            if (error.response?.status !== 404) {
                // Handle actual error
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        if (!window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this order?`)) return;

        try {
            setProcessingId(orderId);
            await axiosInstance.patch(API_PATH.ORDERS.UPDATE_ORDER_STATUS(orderId), {
                freelancer_id: user.id,
                status: newStatus
            });

            // Refresh orders after status change
            await fetchOrders();
        } catch (error) {
            console.error(`Failed to update order to ${newStatus}:`, error);
            alert(error.response?.data?.message || 'Failed to update order status');
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pending Response</span>;
            case 'ACCEPTED':
                return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Accepted (Active)</span>;
            case 'REJECTED':
                return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Rejected</span>;
            default:
                return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 border-b-4 border-black inline-block pb-2 mb-2">Gig Orders</h1>
                    <p className="text-gray-500">Manage order requests from clients for your published gigs.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 text-gray-500 min-h-[40vh]">
                    <svg className="animate-spin w-10 h-10 text-black mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="font-medium animate-pulse">Loading active orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="bg-gray-50 rounded-full p-6 mb-6">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold font-serif text-gray-900 mb-2">No Orders Yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">You haven't received any gig orders from clients currently. Make sure your gigs look appealing to attract more clients!</p>
                    <Link to="/freelancer/gigs/create" className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                        Publish a New Gig
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                            {/* Decorative accent for pending orders */}
                            {order.status === 'PENDING' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-400"></div>}

                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Left Side: Client & Message Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            {getStatusBadge(order.status)}
                                            <h3 className="text-xl font-bold text-gray-900 mt-3 mb-1 line-clamp-1">
                                                Order for: <Link to={`/freelancer/gigs/${order.gig_id}`} className="hover:underline">{order.gig?.title || 'Unknown Gig'}</Link>
                                            </h3>
                                            <p className="text-sm text-gray-500">Ordered on {new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Client Box */}
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 text-lg border border-gray-300 shrink-0">
                                            {(order.client?.company_name || 'Client').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Ordered By</p>
                                            <p className="font-semibold text-gray-900">{order.client?.company_name || 'Unknown Client'}</p>
                                            <p className="text-xs text-gray-500">{order.client?.industry || 'Unknown Industry'}</p>
                                        </div>
                                    </div>

                                    {/* Message from Client */}
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Message from Client</p>
                                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 relative">
                                            <svg className="w-6 h-6 text-blue-200 absolute -top-3 -left-2 bg-white rounded-full" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                                            <p className="text-sm text-gray-700 italic leading-relaxed pl-2">{order.message}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Package Details & Actions */}
                                <div className="lg:w-80 flex flex-col justify-between p-5 bg-gray-50 rounded-2xl border border-gray-200">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                            <span className="text-gray-500 font-semibold">Total Price</span>
                                            <span className="text-2xl font-bold text-gray-900">${order.price_snapshot}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-3">
                                            <span className="text-gray-500 font-medium">Delivery Time</span>
                                            <span className="font-semibold text-gray-900">{order.delivery_days_snapshot} Days</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {order.status === 'PENDING' && (
                                        <div className="flex gap-3 mt-6">
                                            <button
                                                onClick={() => handleUpdateStatus(order.id, 'REJECTED')}
                                                disabled={processingId === order.id}
                                                className="flex-1 bg-white border-2 border-red-500 hover:bg-red-50 text-red-600 font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                                                disabled={processingId === order.id}
                                                className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                {processingId === order.id ? 'Processing...' : 'Accept Order'}
                                            </button>
                                        </div>
                                    )}
                                    {order.status === 'ACCEPTED' && (
                                        <div className="mt-6 text-center">
                                            <Link to="/freelancer/current-projects" className="text-sm font-bold text-blue-600 hover:text-blue-800 underline">
                                                View inside Current Jobs →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GigOrders;
