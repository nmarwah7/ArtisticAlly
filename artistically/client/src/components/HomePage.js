import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import { ChakraProvider } from '@chakra-ui/react';
import ConnectionForm from './ConnectionForm';
import Messages from './Messages';
import EventsDiscovery from './EventsDiscovery';
import JobOpenings from './JobOpenings';
import PendingRequests from './PendingRequests';
import Get_Started from './Get_Started';
import AcceptedConnections from './AcceptedConnections'; 
import Endorsement from './Endorsement';


function HomePage({ user }) {
    const [currentPage, setCurrentPage] = useState(null);
    const [contactId, setContactId] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [receiverEmail, setReceiverEmail] = useState('');
    const [skill, setSkill] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [error, setError] = useState('');
    const [loggedOut, setLoggedOut] = useState(false);
    const [message, setMessage] = useState('');

    const handleMessagesClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleConnectionsClick = () => {
        setCurrentPage('connections');
    };

    const handleEventsClick = () => {
        setCurrentPage('events');
    };

    const handleJobClick = () => {
        setCurrentPage('job');
    };

    const handleEndorseClick = () => {
        setCurrentPage('endorse');
    };

    const handleAcceptedConnectionsClick = () => {
        setCurrentPage('acceptedConnections'); 
    };

    const handleSendMessage = async () => {
        try {
            const response = await axios.get('http://localhost:3001/messages/${encodeURIComponent(contactEmail)}');
            setContactId(response.data.id);
            setCurrentPage('messages');
            handleClose();
        } catch (error) {
            console.error('Error fetching contact ID:', error);
            setError('User not found');
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
        setError('');
    };

    const handleLogout = () => {
        setLoggedOut(true);
    };

    const handleEndorseSkill = async () => {
        if (!receiverEmail || !skill) {
            setMessage('Please enter a receiver email and select a skill');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/endorsements/endorse', {
                senderEmail: user.email,
                receiverEmail: receiverEmail,
                skill: skill
            });
            setMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.error);
            } else {
                setMessage('Failed to endorse skill');
            }
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    if (loggedOut) {
        return (
            <>
                <Get_Started />
            </>
        );
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'events':
                return (
                    <>
                        <Button
                            variant="outlined"
                            style={{ marginBottom: '20px', backgroundColor: '#9C27B0', color: 'white', borderColor: '#6A1B9A' }}
                            onClick={() => setCurrentPage(null)}
                        >
                            Back to Home
                        </Button>
                        <ChakraProvider>
                            <EventsDiscovery />
                        </ChakraProvider>
                    </>
                );
            case 'job':
                return (
                    <>
                        <Button
                            variant="outlined"
                            style={{ marginBottom: '20px', backgroundColor: '#9C27B0', color: 'white', borderColor: '#6A1B9A' }}
                            onClick={() => setCurrentPage(null)}
                        >
                            Back to Home
                        </Button>
                        <ChakraProvider>
                            <JobOpenings />
                        </ChakraProvider>
                    </>
                );
            case 'messages':
                return (
                    <>
                        <Button
                            variant="outlined"
                            style={{ marginBottom: '20px', backgroundColor: '#9C27B0', color: 'white', borderColor: '#6A1B9A' }}
                            onClick={() => setCurrentPage(null)}
                        >
                            Back to Home
                        </Button>
                        <Messages userId={user.id} contactId={contactId} />
                    </>
                );
            case 'connections':
                return (
                    <>
                        <Button
                            variant="outlined"
                            style={{ marginBottom: '20px', backgroundColor: '#9C27B0', color: 'white', borderColor: '#6A1B9A' }}
                            onClick={() => setCurrentPage(null)}
                        >
                            Back to Home
                        </Button>
                        <ConnectionForm senderEmail={user.email} />
                        <PendingRequests userEmail={user.email} />
                    </>
                );
                case 'endorse':
                    return (
                        <>
                            <Button
                                variant="outlined"
                                style={{ marginBottom: '20px', backgroundColor: '#9C27B0', color: 'white', borderColor: '#6A1B9A' }}
                                onClick={() => setCurrentPage(null)}
                            >
                                Back to Home
                            </Button>
                            <Endorsement senderEmail={user.email} />
                        </>
                    );
            case 'acceptedConnections': 
                return (
                    <>
                        <Button
                            variant="outlined"
                            style={{ marginBottom: '20px', backgroundColor: '#9C27B0', color: 'white', borderColor: '#6A1B9A' }}
                            onClick={() => setCurrentPage(null)}
                        >
                            Back to Home
                        </Button>
                        <AcceptedConnections user={user} />
                    </>
                );
            default:
                return (
                    <>
                        <div style={{ backgroundColor: 'white', minHeight: '100vh', borderRadius: '10px', padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Montserrat, sans-serif', color: 'white' }}>
                            <div style={{ textAlign: 'center', color: '#333', display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                    src="/avatar.png"
                                    sx={{
                                        height: '250px',
                                        width: '250px',
                                        marginRight: '10vw',
                                    }} />

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '80px' }}>
                                    <h1 style={{ fontWeight: 'bold', fontSize: '2.75rem' }}>Welcome back {user ? '${user.firstName} ${user.lastName}' : ''}! </h1>
                                    <h2 style={{ fontSize: '1.7rem' }}>You have successfully logged in!</h2>
                                    <p style={{ fontSize: '1.2rem' }}>Feel free to enjoy the following fun features.</p>
                                    <br /> <br /> <br />
                                </div>
                            </div>
                            <hr color="#c1acd9" width="90%" style={{ marginBottom: "80px" }} />
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '100px', justifyContent: 'center', marginBottom: '50px', paddingLeft: '40px' }}>
                                <img src="/events.png" alt="Events" style={{ width: '120px', height: '120px' }} />
                                <img src="/jobs.png" alt="Jobs" style={{ width: '120px', height: '120px' }} />
                                <img src="/messages.png" alt="Messages" style={{ width: '120px', height: '120px' }} />
                                <img src="/connections.png" alt="Connections" style={{ width: '120px', height: '120px' }} />
                                <img src="/endorse.png" alt="Endorse Skills" style={{ width: '120px', height: '120px' }} />
                                <img src="/conn.png" alt="Accepted Connections" style={{ width: '120px', height: '120px' }} /> 
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', justifyContent: 'center' }}>
                                <Button
                                    variant='outlined'
                                    style={{
                                        fontSize: '1.7rem',
                                        borderRadius: '50px',
                                        fontFamily: 'Montserrat, sans-serif',
                                        color: '#8E24AA',
                                        borderColor: '#8E24AA',
                                        padding: '20px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={handleEventsClick}
                                >
                                    Events
                                </Button>
                                <Button
                                    variant='outlined'
                                    style={{
                                        fontSize: '1.7rem',
                                        borderRadius: '50px',
                                        fontFamily: 'Montserrat, sans-serif',
                                        color: '#8E24AA',
                                        borderColor: '#8E24AA',
                                        padding: '20px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={handleJobClick}
                                >
                                    Job Openings
                                </Button>
                                <Button
                                    variant='outlined'
                                    style={{
                                        fontSize: '1.7rem',
                                        borderRadius: '50px',
                                        fontFamily: 'Montserrat, sans-serif',
                                        color: '#8E24AA',
                                        borderColor: '#8E24AA',
                                        padding: '20px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={handleMessagesClick}
                                >
                                    Messages
                                </Button>
                                <Button
                                    variant='outlined'
                                    style={{
                                        fontSize: '1.7rem',
                                        borderRadius: '50px',
                                        fontFamily: 'Montserrat, sans-serif',
                                        color: '#8E24AA',
                                        borderColor: '#8E24AA',
                                        padding: '20px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={handleConnectionsClick}
                                >
                                    Connections
                                </Button>
                                <Button
                                    variant='outlined'
                                    style={{
                                        fontSize: '1.7rem',
                                        borderRadius: '50px',
                                        fontFamily: 'Montserrat, sans-serif',
                                        color: '#8E24AA',
                                        borderColor: '#8E24AA',
                                        padding: '20px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={handleEndorseClick}
                                >
                                    Endorse Skills
                                </Button>
                                <Button
                                    variant='outlined'
                                    style={{
                                        fontSize: '1.7rem',
                                        borderRadius: '50px',
                                        fontFamily: 'Montserrat, sans-serif',
                                        color: '#8E24AA',
                                        borderColor: '#8E24AA',
                                        padding: '20px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={handleAcceptedConnectionsClick} 
                                >
                                    Accepted Connections
                                </Button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', textAlign: 'center', fontFamily: 'Montserrat, sans-serif', color: 'black' }}>
                                <p>Here is where you can customize your profile, or add relevant skills. Do remember this profile will be displayed to other users and could potentially affect your hireability.</p>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <>
            {currentPage === null && (
                <Button variant='outlined'
                    style={{
                        position: 'absolute',
                        top: '100px',
                        right: '20px',
                        fontSize: '1rem',
                        borderRadius: '20px',
                        fontFamily: 'Montserrat, sans-serif',
                        color: '#FF0000',
                        borderColor: '#FF0000',
                        padding: '10px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                    }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            )}
            {renderPage()}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div style={{ padding: '20px' }}>
                    <p>Who would you like to message with?</p>
                    <TextField
                        label="Contact Email"
                        variant="outlined"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        fullWidth
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '10px' }}
                        onClick={handleSendMessage}
                    >
                        Send Message
                    </Button>
                </div>
            </Popover>
        </>
    );
}

export default HomePage;


