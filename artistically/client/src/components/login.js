import React, { useState } from "react";
import "./login.css";
import axios from 'axios'; // Import axios for making HTTP requests
import Registration from "./registration";
import HomePage from "./HomePage";
import BackgroundSlider from './bgm';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showRegistration, setShowRegistration] = useState(false); // State to control the view
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to control the login status
    const [user, setUser] = useState(null); // State to store user information

    const handleRegistrationClick = () => {
        setShowRegistration(true); // Switch to the Login view when button is clicked
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://artistically2-b1c26d45fe00.herokuapp.com/auth/login', { email: username, password: password });
            console.log(response.data); // Handle successful login response
            setSuccessMessage("Login successful"); // Set success message
            setErrorMessage(""); // Clear error message
            setIsLoggedIn(true);
            setUser(response.data.user);
            // Redirect or set appropriate state upon successful login
        } catch (error) {
            console.error('Error logging in:', error.response.data.error);
            setErrorMessage("Invalid username or password"); // Set error message
            setSuccessMessage(""); // Clear success message
            // Handle error response (display error message, etc.)
        }
    };

    return (
        <div>
            {isLoggedIn ? (
                <HomePage user={user} />

            ) : showRegistration ? (
                <div className="col">
                    <BackgroundSlider />
                    <Registration />
                </div>

            ) : (
                <div className="col">
                    <BackgroundSlider />
                    <img id="LOGO" src="LOGO.jpg" alt="Logo" />
                    <p className="p1">Email ID:</p>
                    <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Enter Email ID"
                        className="inp1"
                    />
                    <p className="p2">Password:</p>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter Password"
                        className="inp2"
                    />
                    <button className="enter_button" onClick={handleLogin}>Enter</button>
                    {errorMessage && (
                        <p style={{
                            color: "white",
                            backgroundColor: "red",
                            padding: "10px",
                            borderRadius: "8px",
                            position: "absolute",
                            top: "67%",
                            right: "30%",
                            width: "350px",
                            textAlign: "center",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                        }}>
                            {errorMessage}
                        </p>
                    )}
                    {successMessage && (
                        <p style={{
                            color: "white",
                            backgroundColor: "green",
                            padding: "10px",
                            borderRadius: "8px",
                            position: "absolute",
                            top: "67%",
                            right: "30%",
                            width: "350px",
                            textAlign: "center",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                        }}>
                            {successMessage}
                        </p>
                    )}

                    <p className="p3">Don't have an account? </p>
                    <button className="register_button" onClick={handleRegistrationClick}>Register here!</button>
                </div>
            )}
        </div>
    );
}
