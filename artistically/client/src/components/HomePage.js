import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { ChakraProvider } from '@chakra-ui/react';
import Messages from './Messages'; // Import the Messages component
import ConnectionForm from './ConnectionForm'; // Assuming you have ConnectionForm component
import EventsDiscovery from './EventsDiscovery'; // Assuming you have EventsDiscovery component
import JobOpenings from './JobOpenings'; // Assuming you have JobOpenings component
import PendingRequests from './PendingRequests'; // Assuming you have PendingRequests component
import PortfolioManager from './PortfolioManager'
import AcceptedConnections from './AcceptedConnections'; // Import the AcceptedConnections component
import Endorsement from './Endorsement';
import Get_Started from './Get_Started';


function HomePage({ user }) {
    const [currentPage, setCurrentPage] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [receiverEmail, setReceiverEmail] = useState('');
    const [skill, setSkill] = useState('');
    const [message, setMessage] = useState('');
    const [loggedOut, setLoggedOut] = useState(false);


    const handleConnectionsClick = () => {
        setCurrentPage('connections');
    };

    const handleEventsClick = () => {
        setCurrentPage('events');
    };

    const handleJobClick = () => {
        setCurrentPage('job');
    };

    const handlePortfolioClick = () => {
        setCurrentPage('portfolio');
    };

    const handleAcceptedConnectionsClick = () => {
        setCurrentPage('acceptedConnections'); // Handle clicking on Accepted Connections button
    };

    const handleEndorseClick = () => {
        setCurrentPage('endorse');
    };

    const handleLogout = () => {
        setLoggedOut(true);
    };

    const handleMessagesClick = async () => {
        try {
            const response = await axios.get(`https://artistically2-b1c26d45fe00.herokuapp.com/messages/users/all/filtered`);
            setContacts(response.data);
            if (response.data.length > 0) {
                setSelectedContact(response.data[0]);
            }
            setCurrentPage('messages');
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleEndorseSkill = async () => {
        if (!receiverEmail || !skill) {
            setMessage('Please enter a receiver email and select a skill');
            return;
        }

        try {
            const response = await axios.post('https://artistically2-b1c26d45fe00.herokuapp.com/endorsements/endorse', {
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
                            style={{ backgroundColor: '#9C27B0', color: 'white', borderColor: '#6A1B9A', marginLeft: '20px' }}
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
                            style={{ backgroundColor: '#9C27B0', color: 'white', borderColor: '#6A1B9A', marginLeft: '20px' }}
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
                            style={{ backgroundColor: '#9C27B0', color: 'white', borderColor: '#6A1B9A', marginLeft: '20px' }}
                            onClick={() => setCurrentPage(null)}
                        >
                            Back to Home
                        </Button>
                        <Messages
                            userId={user.id}
                            contacts={contacts}
                            selectedContact={selectedContact}
                            setSelectedContact={setSelectedContact}
                        />
                    </>
                );
            case 'connections':
                return (
                    <>
                        <Button
                            variant="outlined"
                            style={{ backgroundColor: '#9C27B0', color: 'white', borderColor: '#6A1B9A', marginLeft: '20px' }}
                            onClick={() => setCurrentPage(null)}
                        >
                            Back to Home
                        </Button>
                        <ConnectionForm senderEmail={user.email} />
                        <PendingRequests userEmail={user.email} />
                    </>
                );
            case 'portfolio':
                return (
                    <>
                        <Button
                            variant="outlined"
                            style={{ backgroundColor: '#AC25B0', color: 'white', borderColor: '#6A1B9A', marginLeft: '20px' }}
                            onClick={() => setCurrentPage(null)}
                        >
                            Back to Home
                        </Button>
                        <ChakraProvider>
                            <PortfolioManager userId={user.id} />
                        </ChakraProvider>
                    </>
                );
            case 'acceptedConnections': // New case for displaying accepted connections
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
            default:
                return (
                    <>
                        <div style={{ backgroundColor: 'white', minHeight: '100vh', borderRadius: '10px', padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Montserrat, sans-serif', color: 'white', width: '96vw', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', color: '#333', display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                    src="/avatar.png"
                                    sx={{
                                        height: '250px',
                                        width: '250px',
                                        marginRight: '10vw',
                                    }} />

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '80px' }}>
                                    <h1 style={{ fontWeight: 'bold', fontSize: '2.75rem' }}>Welcome back {user ? `${user.firstName} ${user.lastName}` : ''}! </h1>
                                    <h2 style={{ fontSize: '1.7rem' }}>You have successfully logged in!</h2>
                                    <p style={{ fontSize: '1.2rem' }}>Feel free to enjoy the following fun features.</p>
                                    <br /> <br /> <br />
                                </div>
                            </div>
                            <hr color="#c1acd9" width="90%" style={{ marginBottom: "20px" }} />
                            <p style={{ color: "black", marginBottom: "80px" }}>Explore features to message other artists or potential employers, showcase your work, apply for jobs, and discover events!</p>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '180px', justifyContent: 'center', marginBottom: '50px', paddingLeft: '40px' }}>
                                <img src="/events.png" alt="Events" style={{ width: '120px', height: '120px' }} />
                                <img src="/jobs.png" alt="Jobs" style={{ width: '120px', height: '120px' }} />
                                <img src="/messages.png" alt="Messages" style={{ width: '120px', height: '120px' }} />
                                <img src="/portfolio.png" alt="Portfolio" style={{ width: '120px', height: '120px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '70px', justifyContent: 'center' }}>
                                <Button
                                    variant='outlined'
                                    style={{
                                        fontSize: '1.7rem',
                                        borderRadius: '50px',
                                        fontFamily: 'Montserrat, sans-serif',
                                        color: '#3900FF',
                                        borderColor: '#3900FF',
                                        padding: '20px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={handleEventsClick}
                                >
                                    Events Discovery
                                </Button>
                                <Button
                                    variant='outlined'
                                    style={{
                                        fontSize: '1.7rem',
                                        borderRadius: '50px',
                                        fontFamily: 'Montserrat, sans-serif',
                                        color: '#9C27B0',
                                        borderColor: '#9C27B0',
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
                                        color: '#FF5700',
                                        borderColor: '#FF5700',
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
                                        color: '#9C27B0',
                                        borderColor: '#9C27B0',
                                        padding: '20px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={handlePortfolioClick}
                                >
                                    Portfolio
                                </Button>

                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'center', fontFamily: 'Montserrat, sans-serif', color: 'black', marginTop: '30px' }}>

                                <p style={{ color: "black", marginBottom: "80px" }}>Explore our 3 extended features: connect and receive requests to grow your network with Connections, view and manage profiles with My Network, and enhance credibility by endorsing skills through Endorse Skills. Connect, collaborate, and create with ease on ArtisticAlly!</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '250px', justifyContent: 'center', marginBottom: '50px', paddingLeft: '40px' }}>
                                <img src="/conn.png" alt="Accepted Connections" style={{ width: '120px', height: '120px' }} />
                                <img src="/connections.png" alt="Connections" style={{ width: '120px', height: '120px' }} />
                                <img src="/endorse.png" alt="Endorse Skills" style={{ width: '120px', height: '120px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '120px', justifyContent: 'center', marginLeft: '50px' }}>
                                <Button
                                    variant='outlined'
                                    style={{
                                        fontSize: '1.7rem',
                                        borderRadius: '50px',
                                        fontFamily: 'Montserrat, sans-serif',
                                        color: '#FF0097',
                                        borderColor: '#FF0097',
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
                                    onClick={handleAcceptedConnectionsClick}
                                >
                                    My Network
                                </Button>
                                <Button
                                    variant='outlined'
                                    style={{
                                        fontSize: '1.7rem',
                                        borderRadius: '50px',
                                        fontFamily: 'Montserrat, sans-serif',
                                        color: '#8E25FF',
                                        borderColor: '#8E25FF',
                                        padding: '20px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={handleEndorseClick}
                                >
                                    Endorse Skills
                                </Button>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return <>
        {currentPage === null && (
            <Button variant='outlined'
                style={{
                    position: 'absolute',
                    top: '100px',
                    right: '50px',
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
    </>;
}

export default HomePage;
