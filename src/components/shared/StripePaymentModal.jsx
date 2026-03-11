import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/* ─── Inner checkout form ─────────────────────────────────────────── */
const CheckoutForm = ({ amount, onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError('');

        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (stripeError) {
            setError(stripeError.message || 'Payment failed. Please try again.');
            setLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'requires_capture') {
            // Backend uses manual capture (escrow), so requires_capture = success held in escrow
            onSuccess();
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess();
        } else {
            setError('Unexpected payment state. Please try again.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            {/* Escrow Notice */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                    <p className="text-sm font-bold text-blue-800">Funds held in Escrow</p>
                    <p className="text-xs text-blue-600 mt-0.5">
                        Your payment of <span className="font-bold">${amount}</span> will be securely held until you approve the freelancer's work.
                    </p>
                </div>
            </div>

            <PaymentElement
                options={{
                    layout: 'tabs',
                }}
            />

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || !stripe || !elements}
                    className="px-6 py-2.5 text-sm font-semibold bg-black text-white hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50 shadow-sm flex items-center gap-2 min-w-[160px] justify-center"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Fund Escrow
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

/* ─── Outer modal wrapper ─────────────────────────────────────────── */
const StripePaymentModal = ({ isOpen, onClose, contractId, amount, onSuccess }) => {
    const [clientSecret, setClientSecret] = useState(null);
    const [fetchError, setFetchError] = useState('');
    const [fetchLoading, setFetchLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !contractId) return;
        setClientSecret(null);
        setFetchError('');

        const createPaymentIntent = async () => {
            setFetchLoading(true);
            try {
                const response = await axiosInstance.post(API_PATH.PAYMENTS.FUND_CONTRACT(contractId));
                setClientSecret(response.data.clientSecret);
            } catch (err) {
                console.error('Failed to create payment intent:', err);
                setFetchError(err.response?.data?.message || 'Could not initiate payment. Please try again.');
            } finally {
                setFetchLoading(false);
            }
        };

        createPaymentIntent();
    }, [isOpen, contractId]);

    if (!isOpen) return null;

    const handleSuccess = () => {
        onSuccess();
        onClose();
    };

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#000000',
            colorBackground: '#ffffff',
            colorText: '#1a1a1a',
            colorDanger: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '12px',
        },
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold font-serif text-gray-900">Fund Contract</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Secure payment powered by Stripe</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {fetchLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="w-10 h-10 border-2 border-black border-t-transparent animate-spin rounded-full" />
                            <p className="text-sm text-gray-500 font-medium">Preparing secure checkout...</p>
                        </div>
                    ) : fetchError ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                                {fetchError}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                            <CheckoutForm amount={amount} onSuccess={handleSuccess} onClose={onClose} />
                        </Elements>
                    ) : null}
                </div>

                {/* Stripe Badge */}
                <div className="px-6 py-3 border-t border-gray-50 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                    </svg>
                    <span className="text-xs text-gray-400 font-medium">256-bit SSL secured · Powered by Stripe</span>
                </div>
            </div>
        </div>
    );
};

export default StripePaymentModal;
