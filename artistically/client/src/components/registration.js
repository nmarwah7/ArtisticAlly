import React, { useState } from "react";
import "./registration.css";
import axios from 'axios'; // Import axios for making HTTP requests
import Login from "./login";


export default function Registration() {
    const [selectedDate, setSelectedDate] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [inputEmail, setEmailValue] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [firstName, setFirstName] = useState(""); // State for first name
    const [lastName, setLastName] = useState(""); // State for last name
    const [showDonereg, setShowDoneReg] = useState(false); // State to control the view

    const handleDoneregClick = () => {
        setShowDoneReg(true); // Switch to the Login view when button is clicked
    };
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleChange = (e) => {
        const value = e.target.value;

        if (/^\d*$/.test(value) && value.length <= 8) {
            setInputValue(value);
            setErrorMessage("");
        } else if (value.length > 8) {
            setErrorMessage("Max of 8 numbers only");
        }
    };

    const handleChange3 = (e) => {
        const value = e.target.value;
        setEmailValue(value);
        if (value === "") {
            setErrorMessage("");
        } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setEmailValue(value);
            setErrorMessage("");
        } else {
            setErrorMessage("Enter in email format");
        }
    };

    const handleChange2 = (e) => {
        const { id, value } = e.target;

        if (id === "password") {
            setPassword(value);
            if (verifyPassword !== "" && value !== verifyPassword) {
                setErrorMessage("Passwords do not match");
            } else {
                setErrorMessage("");
            }
        } else if (id === "verifyPassword") {
            setVerifyPassword(value);
            if (value === "" && password !== "") {
                setErrorMessage("");
            } else if (password !== "" && value !== password) {
                setErrorMessage("Passwords do not match");
            } else {
                setErrorMessage("");
            }
        }
    };

    const handleRegistration = async () => {
        try {
            const response = await axios.post('https://artistically2-b1c26d45fe00.herokuapp.com/auth/register', {
                firstName: firstName, // Pass first name value
                lastName: lastName, // Pass last name value
                email: inputEmail,
                phoneNumber: inputValue,
                dateOfBirth: selectedDate,
                password: password
            });
            console.log(response.data); // Handle successful registration response
            setSuccessMessage("Registration successful"); // Set success message
            setErrorMessage(""); // Clear any previous error messages
        } catch (error) {
            console.error('Error registering:', error.response.data.error);
            setErrorMessage(error.response.data.error || 'Registration failed'); // Set error message
            setSuccessMessage(""); // Clear any previous success messages
        }
    };

    return (
        <div className="form-container">
            {showDonereg ? (
                <Login />
            ) : (
                <>
                    <h1>Registration Page</h1>
                    <div className="form-el">
                        <label className="label">First Name:</label>
                        <input
                            type="text"
                            className="input"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} // Update first name state
                        />
                    </div>
                    <br />
                    <div className="form-el">
                        <label className="label">Last Name:</label>
                        <input
                            type="text"
                            className="input"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)} // Update last name state
                        />
                    </div>
                    <br />
                    <div className="form-el">
                        <label className="label">Email ID:</label>
                        <input
                            className="input"
                            type="text"
                            value={inputEmail}
                            onChange={handleChange3}
                            placeholder="Enter email"
                        />
                    </div>
                    <br />
                    <div className="form-el">
                        <label className="label">Phone Number:</label>
                        <input
                            className="input"
                            type="text"
                            value={inputValue}
                            onChange={handleChange}
                            placeholder="Enter up to 8 numbers"
                        />
                    </div>
                    <br />
                    <div className="form-el">
                        <label className="label">Date of Birth:</label>
                        <input
                            className="date"
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    <br />
                    <div className="form-el">
                        <label className="label">Password:</label>
                        <input
                            className="input"
                            type="password"
                            id="password"
                            value={password}
                            onChange={handleChange2}
                        />
                    </div>
                    <br />
                    <div className="form-el">
                        <label className="label">Verify password:</label>
                        <input
                            className="input"
                            type="password"
                            id="verifyPassword"
                            value={verifyPassword}
                            onChange={handleChange2}
                        />
                    </div>
                    <br />
                    {/* Display error messages */}
                    {errorMessage && <div className="error">{errorMessage}</div>}
                    {/* Display success message */}
                    {successMessage && <div className="success">{successMessage}</div>}
                    <br />
                    <button className="button" onClick={handleRegistration}>Submit</button>
                    <button className="button" onClick={handleDoneregClick} style={{ marginLeft: '10px' }}> Done </button>
                </>)
            }
        </div >
    );
}
