# Express-Mongo

This project demonstrates a simple Express application with MongoDB and Mongoose for user authentication and todo management.

## Features
- **Sign Up**: Register users
- **Sign In**: Authenticate and get JWTs
- **Get User Info**: Retrieve user details
- **Create/Retrieve Todos**: Manage todo items

## Usage
1. Clone: `git clone https://github.com/-Singh02/express-mongo.git`
2. Install: `npm install`
3. Run: `node index.js`

## API Endpoints
Use Postman with the following:

**POST /signup**
```json
{ 
    "username": "gurvinder", 
    "password": "yourpassword", 
}
```

**POST /signin**
```json
{ 
    "username": "gurvinder", 
    "password": "yourpassword" 
}
```
**GET /me**
- Include header: `token: the output you get in signin`

**POST /todo**
- Include header: `token: the output you get in signin`
```json
{ 
    "username": "gurvinder", 
    "password": "yourpassword" 
}
```
**GET /todos**
- Include header: `token: the output you get in signin`
