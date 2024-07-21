import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import './Endorsement.css';

const skillsList = [
    'Classical Dance', 'Classical Music', 'Western Dance', 'Western Music', 'Fusion Dance', 'Fusion Music',
    'Theater', 'Opera', 'Ballet', 'Hip-Hop', 'Jazz', 'Salsa', 'Tap Dance', 'Contemporary Dance', 'Folk Dance',
    'Blues Music', 'Country Music', 'Electronic Music', 'Pop Music', 'Rock Music', 'Reggae', 'Rap', 'R&B',
    'Soul Music', 'Gospel Music', 'Sound Engineering', 'Music Production', 'Voice Acting', 'Composing', 'Choreography',
    'Writing', 'Poetry', 'Creative Writing', 'Screenwriting', 'Playwriting', 'Graphic Design', 'Painting', 'Sculpture',
    'Photography', 'Film Direction', 'Acting', 'Editing', 'Cinematography', 'Illustration', 'Animation', 'Literature Analysis'
];

const Endorsement = ({ senderEmail }) => {
    const [receiverEmail, setReceiverEmail] = useState('');
    const [skill, setSkill] = useState('');
    const [message, setMessage] = useState('');

    const handleEndorseSkill = async () => {
        try {
            const response = await axios.post('http://localhost:3001/endorsements/endorse', {
                senderEmail: senderEmail,
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

    return (
        <div className="endorsement-container">
            <TextField
                label="Enter the email of the user you want to endorse"
                variant="outlined"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                fullWidth
                style={{ marginBottom: '20px' }}
                InputLabelProps={{
                    style: { color: 'white' },
                }}
                inputProps={{
                    style: { backgroundColor: '#c71585', color: 'white' },
                }}
            />
            <Select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                displayEmpty
                fullWidth
                style={{ marginBottom: '20px' }}
                inputProps={{
                    style: { backgroundColor: '#c71585', color: 'white' },
                }}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 200, 
                            overflowY: 'auto',
                            backgroundColor: '#c71585',
                        },
                    },
                }}
            >
                <MenuItem value="" disabled>
                    <span style={{ color: 'white', display: 'flex', justifyContent: 'center', width: '100%' }}>Select a skill</span>
                </MenuItem>
                {skillsList.map((skill, index) => (
                    <MenuItem key={index} value={skill}>
                        <span style={{ color: 'white' }}>{skill}</span>
                    </MenuItem>
                ))}
            </Select>
            <div className="endorse-button-container">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEndorseSkill}
                >
                    Endorse Skill
                </Button>
            </div>
            {message && <p style={{ marginTop: '20px', color: 'green' }}>{message}</p>}
        </div>
    );
};

export default Endorsement;
