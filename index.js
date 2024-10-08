const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "topsecret";

//to serve public file
const USERS_FILE_PATH = path.join(__dirname, 'users.json');
const users = [];

// Middleware to parse JSON request bodies
app.use(express.json());

// Logger middleware
const logger = (req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    console.log(` Token :  ${req.headers.token}`);
    next();
};

//root
app.get("/", logger, function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
})

// Signup route
app.post("/signup", logger, async (req, res) => {
    try {
        const { username, password } = req.body;
        users.push({
            username: username,
            password: password
        })

        console.log(`User signed up: ${username}`);
        res.json({ message: "You are signed up" });
    } catch (err) {
        console.error("Error during signup:", err.message);
        res.status(500).json({ message: "Error signing up" });
    }
});

// Signin route
app.post("/signin", logger, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user
        const foundUser = users.find(user => user.username === username);

        if (!foundUser || foundUser.password !== password) {
            console.log("Invalid credentials");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate and sign JWT
        const token = jwt.sign({ username }, JWT_SECRET);
        console.log(`JWT generated for user: ${username}`);
        res.json({ token: token });
    } catch (err) {
        console.error("Error during signin:", err.message);
        res.status(500).json({ message: "Error signing in" });
    }
});

// JWT Authentication middleware
const auth = (req, res, next) => {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ message: "Token is missing" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.username = decoded.username;
        console.log(`Token verified for user: ${req.username}`);
        next();
    } catch (err) {
        console.error("Invalid token:", err.message);
        res.status(401).json({ message: "Invalid token" });
    }
};

// Profile route (requires authentication)
app.get("/me", logger, auth, async (req, res) => {

    // req = {status, headers...., username, password, userFirstName, random; ":123123"}
    const currentUser = req.username;
    try {
        const foundUser = users.find(user => user.username === currentUser);

        if (!foundUser) return res.status(404).json({ message: "User not found" });

        res.json({ username: foundUser.username, password: foundUser.password });
        console.log(`User details returned for: ${req.username}`);
    } catch (err) {
        console.error("Error retrieving user details:", err.message);
        res.status(500).json({ message: "Error retrieving user details" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
