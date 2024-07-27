import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Messages.css'; // Import CSS file for styling

const Messages = ({ userId, contacts, selectedContact, setSelectedContact }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [existingChats, setExistingChats] = useState(new Set());
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        // Fetch existing chats for all contacts on component mount
        fetchAllChats();
        // Fetch all users for search functionality
        fetchAllUsers();
    }, []);

    useEffect(() => {
        if (selectedContact) {
            fetchMessages(selectedContact.id);
        }
    }, [selectedContact]);

    const fetchAllChats = async () => {
        try {
            const chatPromises = contacts.map(contact =>
                axios.get(`https://artistically2-b1c26d45fe00.herokuapp.com/messages/${userId}/${contact.id}`)
            );
            const responses = await Promise.all(chatPromises);
            const chatIds = responses
                .filter(response => response.data.length > 0)
                .map((_, index) => contacts[index].id);
            setExistingChats(new Set(chatIds));
        } catch (error) {
            console.error('Error fetching all chats:', error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get('https://artistically2-b1c26d45fe00.herokuapp.com/messages/users/all/filtered'); // Assuming this endpoint returns all users
            setAllUsers(response.data);
        } catch (error) {
            console.error('Error fetching all users:', error);
        }
    };

    const fetchMessages = async (contactId) => {
        try {
            const response = await axios.get(`https://artistically2-b1c26d45fe00.herokuapp.com/messages/${userId}/${contactId}`);
            setMessages(response.data);
            if (response.data.length > 0) {
                setExistingChats(prev => new Set(prev).add(contactId));
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!selectedContact || newMessage.trim() === '') return;

        try {
            await axios.post('https://artistically2-b1c26d45fe00.herokuapp.com/messages/send', {
                senderId: userId,
                receiverId: selectedContact.id,
                message: newMessage,
            });
            const newMessageObj = {
                id: Date.now(), // Generate a unique temporary ID (replace with actual ID from server if available)
                senderId: userId,
                receiverId: selectedContact.id,
                message: newMessage,
            };
            setMessages([...messages, newMessageObj]);
            setNewMessage('');
            setExistingChats(prev => new Set(prev).add(selectedContact.id));
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Filter existing chats based on search term and exclude current user
    const filteredContacts = contacts
        .filter(contact => contact.id !== userId) // Exclude current user
        .filter(
            contact =>
                existingChats.has(contact.id) &&
                (contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );

    // Filter all users based on search term and exclude current user
    const filteredUsers = allUsers
        .filter(user => user.id !== userId) // Exclude current user
        .filter(
            user =>
            (user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );


    // Conditionally render content based on search term
    const showUsers = searchTerm.length > 0;
    const displayContacts = showUsers ? filteredUsers : filteredContacts;

    return (
        <div className="messages-container">
            <div className="chat-list">
                <input
                    className='search'
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="chat-list-content">
                    {displayContacts.length > 0 ? (
                        displayContacts.map(contact => (
                            <div
                                key={contact.id}
                                className={`chat-item ${selectedContact && selectedContact.id === contact.id ? 'selected' : ''}`}
                                onClick={() => setSelectedContact(contact)}
                            >
                                {contact.firstName} {contact.lastName}
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            {showUsers ? 'No users found' : 'No existing chats'}
                        </div>
                    )}
                </div>
            </div>
            <div className="chat-messages">
                {selectedContact ? (
                    <>
                        <div className="messages">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`message ${msg.sender_id === userId ? 'sent' : 'received'}`}>
                                    {msg.message}
                                </div>
                            ))}
                        </div>
                        <div className="message-input">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                            />
                            <button onClick={handleSendMessage}>Send</button>
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">Select a contact to start messaging</div>
                )}
            </div>
        </div>
    );
};

export default Messages;