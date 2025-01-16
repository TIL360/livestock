// src/Payment.js
import React, { useState } from 'react';
import axios from 'axios';

const Payment = () => {
    const [amount, setAmount] = useState('');
    const [userId, setUserId] = useState(''); // This can be your user identifier

    const handlePayment = async () => {
        try {
            const response = await axios.post('http://localhost:3000/feepay/initiate-payment', {
                amount: amount,
                userId: userId,
            });

            if (response.data.success) {
                // Redirect to PhonePe payment URL
                window.location.href = response.data.paymentUrl;
            } else {
                alert('Payment initiation failed.');
            }
        } catch (error) {
            console.error('Payment error', error);
            alert('Payment initiation failed.');
        }
    };

    return (
        <div>
            <h2>Payment</h2>
            <input
                type="text"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
};

export default Payment;
