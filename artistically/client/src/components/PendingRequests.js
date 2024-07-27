import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Connections.css';

const PendingRequests = ({ userEmail }) => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await axios.get(`https://artistically2-b1c26d45fe00.herokuapp.com/pending/${encodeURIComponent(userEmail)}`);
                setPendingRequests(response.data);
            } catch (error) {
                console.error('Error fetching pending requests:', error);
                setError('Failed to fetch pending requests');
            }
        };

        fetchPendingRequests();
    }, [userEmail]);

    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.put(`https://artistically2-b1c26d45fe00.herokuapp.com/connections/accept/${requestId}`);
            setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
        } catch (error) {
            console.error('Error accepting request:', error);
            setError('Failed to accept request');
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await axios.put(`https://artistically2-b1c26d45fe00.herokuapp.com/connections/reject/${requestId}`);
            setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
        } catch (error) {
            console.error('Error rejecting request:', error);
            setError('Failed to reject request');
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container pending-requests">
            <h2>Pending Requests</h2>
            {pendingRequests.length === 0 ? (
                <p>No pending requests</p>
            ) : (
                <ul>
                    {pendingRequests.map(request => (
                        <li key={request.id}>
                            <p>From: {request.sender_email}</p>
                            <p>Status: {request.status}</p>
                            <div>
                                <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                                <button className="reject" onClick={() => handleRejectRequest(request.id)}>Reject</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PendingRequests;