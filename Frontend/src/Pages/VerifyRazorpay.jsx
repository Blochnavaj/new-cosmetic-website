import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Tittle from '../Components/Tittle';
import { ShopContext } from '../Context/ShopContext';

function VerifyRazorpay() {
    const [verificationStatus, setVerificationStatus] = useState('processing');
    const location = useLocation();
    const navigate = useNavigate();
    const { backendUrl, token, setCartItems } = useContext(ShopContext);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const { paymentResponse, orderData } = location.state || {};

                if (!paymentResponse || !orderData) {
                    toast.error("Invalid payment data. Redirecting to home...");
                    navigate('/');
                    return;
                }

                const { data } = await axios.post(
                    `${backendUrl}/api/order/verifyRazorpay`,
                    { paymentResponse: paymentResponse, orderData },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (data.success) {
                    setVerificationStatus('success');
                    setCartItems(prev => 
                        prev.filter(item => 
                            !orderData.items.some(oItem => oItem.productId === item.productId._id)
                        )
                    );
                    toast.success("Payment verified successfully!");
                } else {
                    setVerificationStatus('failed');
                    toast.error(data.message || "Payment verification failed!");
                }
            } catch (error) {
                console.error("Verification error:", error?.response?.data || error.message);
                setVerificationStatus('error');
                toast.error("Error verifying payment!");
            }
        };

        verifyPayment();
    }, [location.state, backendUrl, token, setCartItems, navigate]);

    return (
        <div className='container mx-auto px-4 py-10 mt-20 text-center'>
            <Tittle text1='Payment' text2='Verification' />

            {verificationStatus === 'processing' && (
                <div className='mt-8'>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className='mt-4 text-lg'>Verifying your payment...</p>
                </div>
            )}

            {verificationStatus === 'success' && (
                <div className='mt-8'>
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className='mt-4 text-2xl font-semibold'>Payment Successful!</h3>
                    <button 
                        onClick={() => navigate('/orders')}
                        className='mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700'
                    >
                        View Orders
                    </button>
                </div>
            )}

            {verificationStatus === 'failed' && (
                <div className='mt-8'>
                    <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <h3 className='mt-4 text-2xl font-semibold'>Payment Failed!</h3>
                    <button
                        onClick={() => navigate('/cart')}
                        className='mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700'
                    >
                        Back to Cart
                    </button>
                </div>
            )}
        </div>
    );
}

export default VerifyRazorpay;
