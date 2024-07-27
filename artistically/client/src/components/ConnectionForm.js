import React, { useState } from 'react';
import axios from 'axios';
import './Connections.css';

const ConnectionForm = ({ senderEmail }) => {
    const [receiverEmail, setReceiverEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSendRequest = async () => {
        try {
            const response = await axios.post('https://artistically2-b1c26d45fe00.herokuapp.com/connections/send', {
                senderEmail: senderEmail,
                receiverEmail: receiverEmail
            });
            setMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.error);
            } else {
                setMessage('Failed to send connection request');
            }
        }
    };

    return (
        <div className="container connection-form">
            <h2>Send Connection Request</h2>
            <div>
                <label>Your Registered Email:</label>
                <input type="email" value={senderEmail} disabled />
            </div>
            <div>
                <label>Receiver's Registered Email:</label>
                <input type="email" value={receiverEmail} onChange={(e) => setReceiverEmail(e.target.value)} />
            </div>
            <button onClick={handleSendRequest}>Send Request</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ConnectionForm;