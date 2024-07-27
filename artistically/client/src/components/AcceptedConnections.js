import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Box, CircularProgress, Divider, TextField } from '@mui/material';
import './AcceptedConnections.css';

function AcceptedConnections({ user }) {
    const [connections, setConnections] = useState([]);
    const [filteredConnections, setFilteredConnections] = useState([]);
    const [selectedConnection, setSelectedConnection] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAcceptedConnections();
    }, []);

    useEffect(() => {
        filterConnections(searchTerm);
    }, [searchTerm, connections]);

    const fetchAcceptedConnections = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://artistically2-b1c26d45fe00.herokuapp.com/fetch/accepted/${user.email}`);
            setConnections(response.data);
            setFilteredConnections(response.data);
        } catch (error) {
            console.error('Error fetching accepted connections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnectionClick = async (email) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://artistically2-b1c26d45fe00.herokuapp.com/fetch/details/${email}`);
            setSelectedConnection(response.data);
        } catch (error) {
            console.error('Error fetching connection details:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterConnections = (searchTerm) => {
        const filtered = connections.filter(connection =>
            connection.firstName.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
            connection.lastName.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
        setFilteredConnections(filtered);
    };

    return (
        <Box className="accepted-connections-container">
            <Box className="left-container">
                <Typography variant="h6" component="div" className="title">
                    Accepted Connections
                </Typography>
                <br></br>
                <TextField
                    label="Search Connections"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
                {loading && <CircularProgress className="loader" />}
                <List>
                    {filteredConnections.map((connection) => (
                        <ListItem
                            button
                            key={connection.id}
                            onClick={() => handleConnectionClick(connection.email)}
                            className="list-item"
                        >
                            <ListItemText primary={`${connection.firstName} ${connection.lastName}`} className="list-item-text" />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box className="right-container">
                {selectedConnection ? (
                    <>
                        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} className="detail-title">
                            {`${selectedConnection.firstName} ${selectedConnection.lastName}`}
                        </Typography>
                        <br></br>
                        <Typography variant="body1" className="detail-text">
                            Email: {selectedConnection.email}
                        </Typography>
                        <Typography variant="body1" className="detail-text">
                            Phone: {selectedConnection.phoneNumber}
                        </Typography>
                        <Typography variant="body1" className="detail-text">
                            Date of Birth: {new Date(selectedConnection.dateOfBirth).toLocaleDateString()}
                        </Typography>
                        <br></br>
                        <Divider className="divider" />
                        <br></br>
                        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} className="detail-title">
                            Endorsed Skills
                        </Typography>
                        <List>
                            {selectedConnection.skills.map((skill, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={<span className="endorsed-skill">{skill.skill}</span>}
                                        secondary={<span className="endorsed-by">Endorsed by: {skill.endorsedByFirstName} {skill.endorsedByLastName}</span>}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </>
                ) : (
                    <Typography variant="h6" component="div" className="detail-title">
                        Select a connection to see details
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default AcceptedConnections;